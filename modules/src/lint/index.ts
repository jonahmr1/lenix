import preset from "./preset.json"
/**
 * Load eslint presets rules.
 * @see https://raw.githubusercontent.com/LenixDev/lenix/refs/heads/main/lint/src/lint-preset.json
 */
export const lint = { strict: preset.rules }