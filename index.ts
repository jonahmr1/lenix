import * as fs from 'fs';
import * as path from 'path';
import JavaScriptObfuscator from 'javascript-obfuscator';
import { minify } from 'terser';

const IGNORE_FILE_PATHS: string[] = [
  'build.ts',
  'build.js',
  'client/bridge.js',
];

const IGNORE_DIRS: string[] = [
  'node_modules',
  'build',
];

const MANIFEST_FILE = 'fxmanifest.lua';

interface BuildResult {
  originalPath: string;
  builtPath: string;
}

function shouldIgnoreFile(filePath: string): boolean {
  const relativePath = path.relative(__dirname, filePath).replace(/\\/g, '/');
  return IGNORE_FILE_PATHS.some(ignorePath => {
    const normalizedIgnorePath = ignorePath.replace(/\\/g, '/');
    return relativePath === normalizedIgnorePath;
  });
}

function findJsFiles(dir: string, fileList: string[] = []): string[] {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      if (!file.startsWith('.') && !IGNORE_DIRS.includes(file)) {
        findJsFiles(filePath, fileList);
      }
    } else if (file.endsWith('.js') && !shouldIgnoreFile(filePath)) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

function findHtmlFiles(dir: string, fileList: string[] = []): string[] {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      if (!file.startsWith('.') && !IGNORE_DIRS.includes(file)) {
        findHtmlFiles(filePath, fileList);
      }
    } else if (file.endsWith('.html')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

async function buildFile(filePath: string): Promise<BuildResult | null> {
  try {
    const code = fs.readFileSync(filePath, 'utf8');
    const dir = path.dirname(filePath);
    const fileName = path.basename(filePath);
    const buildDir = path.join(dir, 'build');
    const outputPath = path.join(buildDir, fileName);
    
    console.log(`📦 Building: ${path.relative(__dirname, filePath)}`);
    
    const minified = await minify(code, {
      compress: {
        drop_console: false,
        dead_code: true,
        drop_debugger: true,
        conditionals: true,
        evaluate: true,
        booleans: true,
        loops: true,
        unused: true,
        hoist_funs: true,
        keep_fargs: false,
        hoist_vars: true,
        if_return: true,
        join_vars: true,
        side_effects: true,
      },
      mangle: {
        toplevel: true,
        eval: true,
        keep_fnames: false,
      },
      output: {
        comments: false,
        beautify: false,
      },
    });
    
    const obfuscated = JavaScriptObfuscator.obfuscate(minified.code!, {
      rotateStringArray: true,
      stringArray: true,
      stringArrayEncoding: ['rc4'],
      stringArrayThreshold: 0.75,
      splitStrings: true,
      splitStringsChunkLength: 10,
      deadCodeInjection: true,
      deadCodeInjectionThreshold: 0.4,
      controlFlowFlattening: true,
      controlFlowFlatteningThreshold: 0.75,
      identifierNamesGenerator: 'hexadecimal',
      renameGlobals: false,
      selfDefending: true,
      compact: true,
      unicodeEscapeSequence: false,
    });
    
    if (!fs.existsSync(buildDir)) {
      fs.mkdirSync(buildDir, { recursive: true });
    }
    
    fs.writeFileSync(outputPath, obfuscated.getObfuscatedCode());
    console.log(`✅ Output: ${path.relative(__dirname, outputPath)}`);
    
    return {
      originalPath: path.relative(__dirname, filePath).replace(/\\/g, '/'),
      builtPath: path.relative(__dirname, outputPath).replace(/\\/g, '/')
    };
    
  } catch (error) {
    console.error(`❌ Error building ${filePath}:`, (error as Error).message);
    return null;
  }
}

function updateManifest(builtFiles: BuildResult[]): void {
  const manifestPath = path.join(__dirname, MANIFEST_FILE);
  
  if (!fs.existsSync(manifestPath)) {
    console.log(`⚠️  Manifest file not found: ${MANIFEST_FILE}`);
    return;
  }
  
  let manifestContent = fs.readFileSync(manifestPath, 'utf8');
  
  builtFiles.forEach(({ originalPath, builtPath }) => {
    const escapedOriginal = originalPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`['"]${escapedOriginal}['"]`, 'g');
    manifestContent = manifestContent.replace(regex, `'${builtPath}'`);
  });
  
  fs.writeFileSync(manifestPath, manifestContent);
  console.log(`\n📝 Updated ${MANIFEST_FILE} with built file paths`);
}

function updateHtmlFiles(builtFiles: BuildResult[]): void {
  const htmlFiles = findHtmlFiles(__dirname);
  
  if (htmlFiles.length === 0) {
    return;
  }
  
  console.log(`\n🔧 Updating ${htmlFiles.length} HTML file(s)...`);
  
  htmlFiles.forEach(htmlPath => {
    let htmlContent = fs.readFileSync(htmlPath, 'utf8');
    let updated = false;
    const htmlDir = path.dirname(htmlPath);
    
    builtFiles.forEach(({ originalPath, builtPath }) => {
      // Calculate relative path from HTML file to JS file
      const absoluteOriginalPath = path.join(__dirname, originalPath);
      const absoluteBuiltPath = path.join(__dirname, builtPath);
      const relativeOriginalPath = path.relative(htmlDir, absoluteOriginalPath).replace(/\\/g, '/');
      const relativeBuiltPath = path.relative(htmlDir, absoluteBuiltPath).replace(/\\/g, '/');
      
      // Try both absolute and relative paths
      const pathsToTry = [
        { original: originalPath, built: builtPath },
        { original: relativeOriginalPath, built: relativeBuiltPath }
      ];
      
      pathsToTry.forEach(({ original, built }) => {
        // Update src attributes in script tags
        const srcRegex = new RegExp(`src=["']${original.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["']`, 'g');
        if (srcRegex.test(htmlContent)) {
          htmlContent = htmlContent.replace(srcRegex, `src="${built}"`);
          updated = true;
          console.log(`  🔄 ${original} → ${built}`);
        }
        
        // Update href attributes
        const hrefRegex = new RegExp(`href=["']${original.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["']`, 'g');
        if (hrefRegex.test(htmlContent)) {
          htmlContent = htmlContent.replace(hrefRegex, `href="${built}"`);
          updated = true;
          console.log(`  🔄 ${original} → ${built}`);
        }
      });
    });
    
    if (updated) {
      fs.writeFileSync(htmlPath, htmlContent);
      console.log(`✅ Updated: ${path.relative(__dirname, htmlPath)}`);
    } else {
      console.log(`⚠️  No changes: ${path.relative(__dirname, htmlPath)}`);
    }
  });
}

async function main(): Promise<void> {
  console.log('🔍 Scanning for JavaScript files...\n');
  console.log(`⚙️  Ignoring directories: ${IGNORE_DIRS.join(', ')}`);
  console.log(`⚙️  Ignoring files: ${IGNORE_FILE_PATHS.join(', ')}\n`);
  
  const jsFiles = findJsFiles(__dirname);
  
  if (jsFiles.length === 0) {
    console.log('No JavaScript files found.');
    return;
  }
  
  console.log(`Found ${jsFiles.length} file(s) to build\n`);
  
  const builtFiles: BuildResult[] = [];
  
  for (const file of jsFiles) {
    const result = await buildFile(file);
    if (result) {
      builtFiles.push(result);
    }
  }
  
  console.log('\n✨ Build complete!');
  
  if (builtFiles.length > 0) {
    updateManifest(builtFiles);
    updateHtmlFiles(builtFiles);
  }
}

main();