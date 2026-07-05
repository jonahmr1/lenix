// ============================================================
// 🚀 Loading Screen - المنطق الرئيسي
// ============================================================

(function () {
    'use strict';

    // ---------------------------------
    // 1. تحميل الإعدادات من CONFIG
    // ---------------------------------
    const cfg = typeof CONFIG !== 'undefined' ? CONFIG : {};

    function get(key, fallback) {
        return cfg[key] !== undefined ? cfg[key] : fallback;
    }

    function setPersonImage(imgId, url) {
        const img = document.getElementById(imgId);
        if (!img) return;
        if (url && url.trim() !== '') {
            img.src = url.trim();
            img.classList.add('show');
        }
    }

    // ---------------------------------
    // 2. حقن الإعدادات في الصفحة
    // ---------------------------------
    function applyConfig() {
        // اسم السيرفر
        const serverNameEl = document.getElementById('serverName');
        if (serverNameEl) serverNameEl.textContent = get('serverName', 'SERVER NAME');

        // السبتايتل
        const subtitleEl = document.querySelector('.server-subtitle');
        if (subtitleEl) subtitleEl.textContent = get('serverSubtitle', 'Loading Screen');

        // الأونر
        const ownerEl = document.getElementById('ownerName');
        if (ownerEl) ownerEl.textContent = get('owner', '—');

        // الـ Co-Owner
        const coOwnerEl = document.getElementById('coOwnerName');
        if (coOwnerEl) coOwnerEl.textContent = get('coOwner', '—');

        // المبرمج
        const developerEl = document.getElementById('developerName');
        if (developerEl) developerEl.textContent = get('developer', '—');

        // صور الأشخاص (إذا حط رابط، يظهر الصورة بدل الأيقونة)
        setPersonImage('ownerImg', get('ownerImg', ''));
        setPersonImage('coOwnerImg', get('coOwnerImg', ''));
        setPersonImage('developerImg', get('developerImg', ''));

        // اللوجو
        const logoEl = document.getElementById('serverLogo');
        if (logoEl) {
            logoEl.src = get('logoImg', 'assets/img/logo.png');
            logoEl.alt = get('serverName', 'Server Logo');
        }

        // زر الوصف - يظهر وصف السيرفر
        const descTextEl = document.getElementById('descText');
        if (descTextEl) descTextEl.textContent = get('description', 'Welcome to ' + get('serverName', 'the server'));

        // الفيديو — غير المصدر لو اختلف عن الافتراضي فقط (لا نستدعي load() عشان ما نعطل الـ autoplay)
        var videoSrc = get('videoSrc', 'assets/video/background.mp4');
        var defaultVideo = 'assets/video/background.mp4';
        var videoSource = document.querySelector('#bgVideo source');
        var videoEl = document.getElementById('bgVideo');
        if (videoSource && videoSrc !== defaultVideo) {
            videoSource.src = videoSrc;
            videoSource.parentElement.load();
        } else if (videoEl && videoSrc !== defaultVideo) {
            videoEl.src = videoSrc;
            videoEl.load();
        }

        // الألوان
        const root = document.documentElement;
        const primary = get('primaryColor', '#00d4ff');
        const accent = get('accentColor', '#ff6b35');
        const overlay = get('overlayColor', 'rgba(0, 0, 0, 0.65)');

        root.style.setProperty('--primary', primary);
        root.style.setProperty('--accent', accent);

        // تطبيق لون التعتيم
        const overlayEl = document.getElementById('overlay');
        if (overlayEl) overlayEl.style.background = overlay;

        // تحديث الألوان في CSS
        const styleSheet = document.createElement('style');
        styleSheet.textContent = `
            :root {
                --primary: ${primary};
                --accent: ${accent};
                --text-secondary: ${get('textSecondary', '#888')};
            }
            #serverName,
            .card-value { color: ${get('textColor', '#ffffff')}; }
            .card-label { color: var(--text-secondary); }
            .card-icon svg { color: var(--primary); }
            #loadingBarFill { background: var(--primary); }
            .title-underline { background: var(--primary); }
            .info-card { border-right-color: transparent; }
            .info-card:hover { border-right-color: var(--primary); }
            #serverNameWrapper::after { background: linear-gradient(180deg, var(--primary), transparent); }
        `;
        document.head.appendChild(styleSheet);
    }

    // ---------------------------------
    // 3. نظام شريط التحميل (مربوط بتحميل اللعبة)
    // ---------------------------------
    let isLoadingComplete = false;
    let fiveMReady = false;
    const startTime = Date.now();

    const fillEl = document.getElementById('loadingBarFill');
    const percentEl = document.getElementById('loadingPercentage');

    function updateProgress(value) {
        const progress = Math.min(value, 100);
        if (fillEl) fillEl.style.width = progress + '%';
        if (percentEl) percentEl.textContent = Math.round(progress) + '%';
    }

    function finishLoading() {
        isLoadingComplete = true;
        updateProgress(100);

        // نخفي الشاشة بعد وقت كافي
        const elapsed = Date.now() - startTime;
        const minTime = get('minLoadTime', 3000);
        const remaining = Math.max(0, minTime - elapsed);

        setTimeout(function () {
            if (fiveMReady) {
                hideLoadingScreen();
            }
        }, remaining);
    }

    function hideLoadingScreen() {
        // 🎵 هدّي الصوت أولاً
        fadeOutMusic();

        // إخفاء سلس
        const container = document.getElementById('mainContainer');
        const loadingBar = document.getElementById('loadingBarContainer');
        const overlay = document.getElementById('overlay');

        if (container) container.style.transition = 'opacity 0.8s ease';
        if (container) container.style.opacity = '0';
        if (loadingBar) loadingBar.style.transition = 'opacity 0.8s ease';
        if (loadingBar) loadingBar.style.opacity = '0';
        if (overlay) overlay.style.transition = 'opacity 0.8s ease';
        if (overlay) overlay.style.opacity = '0';

        // بعد الفيد
        setTimeout(function () {
            if (container) container.style.display = 'none';
            if (loadingBar) loadingBar.style.display = 'none';
            if (overlay) overlay.style.display = 'none';
        }, 900);
    }

    // ---------------------------------
    // 4. 🔊 نظام تشغيل / إيقاف الصوت
    // ---------------------------------
    let isMusicPlaying = false;
    let musicFadeInterval = null;
    const audioEl = document.getElementById('bgMusic');
    const playBtn = document.getElementById('playBtn');
    const stopBtn = document.getElementById('stopBtn');

    function setActiveButton(active) {
        // active = 'play' يخلع play مضغوط، active = 'stop' يخلع stop مضغوط
        if (active === 'play') {
            playBtn.classList.add('active');
            playBtn.disabled = true;
            stopBtn.classList.remove('active');
            stopBtn.disabled = false;
        } else {
            stopBtn.classList.add('active');
            stopBtn.disabled = true;
            playBtn.classList.remove('active');
            playBtn.disabled = false;
        }
    }

    function initAudio() {
        if (!audioEl || !playBtn || !stopBtn) return;

        // حط المسار من الإعدادات
        const audioSource = audioEl.querySelector('source');
        if (audioSource) {
            audioSource.src = get('musicSrc', 'assets/audio/music.mp3');
            audioEl.load();
        }

        // مستوى الصوت
        audioEl.volume = get('musicVolume', 0.5);

        // ربط الأزرار
        playBtn.addEventListener('click', playMusic);
        stopBtn.addEventListener('click', stopMusic);

        // البداية: تشغيل مضغوط + إيقاف مفعل — الصوت يبدا شغال تلقائي
        setActiveButton('play');

        // نشغل الصوت فوراً (في CEF حق FiveM يشتغل بدون تفاعل)
        audioEl.play().then(function () {
            isMusicPlaying = true;
        }).catch(function () {
            // لو ما اشتغل (مثلاً في متصفح عادي)، نحاول بعد أول تفاعل
            function onFirstInteraction() {
                audioEl.play().then(function () {
                    isMusicPlaying = true;
                }).catch(function () {});
                document.removeEventListener('click', onFirstInteraction);
                document.removeEventListener('keydown', onFirstInteraction);
                document.removeEventListener('touchstart', onFirstInteraction);
            }
            document.addEventListener('click', onFirstInteraction, { once: true });
            document.addEventListener('keydown', onFirstInteraction, { once: true });
            document.addEventListener('touchstart', onFirstInteraction, { once: true });
        });
    }

    function playMusic() {
        if (!audioEl || isMusicPlaying) return;

        audioEl.play().then(function () {
            isMusicPlaying = true;
            setActiveButton('play');
        }).catch(function () {});
    }

    function stopMusic() {
        if (!audioEl || !isMusicPlaying) return;

        audioEl.pause();
        isMusicPlaying = false;
        setActiveButton('stop');
    }

    // تهدئة الصوت عند إخفاء الشاشة
    function fadeOutMusic() {
        if (!audioEl || !isMusicPlaying) return;

        const startVolume = audioEl.volume;
        const steps = 20;
        const interval = 40;
        let step = 0;

        if (musicFadeInterval) clearInterval(musicFadeInterval);

        musicFadeInterval = setInterval(function () {
            step++;
            const progress = step / steps;
            audioEl.volume = Math.max(0, startVolume * (1 - progress));

            if (step >= steps) {
                clearInterval(musicFadeInterval);
                musicFadeInterval = null;
                audioEl.pause();
            }
        }, interval);
    }

    // ---------------------------------
    // 5. 🎬 تشغيل الفيديو — يعتمد على autoplay حق HTML
    // ---------------------------------
    function initVideo() {
        var video = document.getElementById('bgVideo');
        if (!video) return;

        var videoReady = false;
        var retries = 0;
        var maxRetries = 12; // 12 محاولة

        function tryPlay() {
            if (videoReady || retries >= maxRetries) return;
            retries++;

            video.play().then(function () {
                videoReady = true;
            }).catch(function () {
                // نعيد المحاولة بعد وقت أطول كل مرة
                var delay = retries * 400;
                setTimeout(tryPlay, delay);
            });
        }

        // المحاولة الأولى
        tryPlay();

        // لو الفيديو جاهز بالفعل
        if (video.readyState >= 2) {
            tryPlay();
        }

        // تفاعل المستخدم — يحاول يشغل لو لسا ما اشتغل
        function onInteraction() {
            if (!videoReady) {
                video.play().then(function () {
                    videoReady = true;
                }).catch(function () {});
            }
            document.removeEventListener('click', onInteraction);
            document.removeEventListener('keydown', onInteraction);
            document.removeEventListener('touchstart', onInteraction);
        }
        document.addEventListener('click', onInteraction, { once: true });
        document.addEventListener('keydown', onInteraction, { once: true });
        document.addEventListener('touchstart', onInteraction, { once: true });
    }

    // ---------------------------------
    // 6. التكامل مع FiveM (شريط التحميل مربوط هنا)
    // ---------------------------------
    let fiveMDetected = false;
    let simProgress = 0;
    let simInterval = null;

    function startSimulatedProgress() {
        // نحاكي التحميل: يوصل لـ 90% خلال 25 ثانية
        var targetSim = 90;
        var simSpeed = 0.06; // % لكل ميلي ثانية (≈ 90% في 25 ثانية)
        var lastSim = Date.now();

        simInterval = setInterval(function () {
            if (isLoadingComplete) {
                clearInterval(simInterval);
                return;
            }
            var now = Date.now();
            var delta = now - lastSim;
            lastSim = now;

            simProgress = Math.min(simProgress + (delta * simSpeed), targetSim);
            updateProgress(simProgress);
        }, 100);
    }

    function initFiveM() {
        // كاشف FiveM: لو وصلت رسالة من FiveM، نعرف أنه في FiveM
        window.addEventListener('message', function (event) {
            const data = event.data;
            if (!data) return;

            // أول رسالة من FiveM = نحن في السيرفر
            if (!fiveMDetected) {
                fiveMDetected = true;
                // أوقف simulation لأن FiveM راح يرسل التحديثات الحقيقية
                if (simInterval) {
                    clearInterval(simInterval);
                    simInterval = null;
                }
            }

            // ── FiveM يرسل حدث التحميل ──
            if (data.eventName) {
                // انتهاء التحميل نهائياً
                if (data.eventName === 'loadingScreenDone' || data.eventName === 'onLogIn') {
                    fiveMReady = true;
                    finishLoading();
                    return;
                }
            }

            // ── نسبة التحميل من FiveM ──
            if (data.eventName === 'updateLoadingProgress' && typeof data.loadingProgress === 'number') {
                updateProgress(data.loadingProgress);
            } else if (typeof data.loadingProgress === 'number') {
                updateProgress(data.loadingProgress);
            }

            // ── أمر يدوي للإخفاء ──
            if (data.type === 'hideLoadingScreen') {
                fiveMReady = true;
                finishLoading();
            }
        });

        // 👇 نبدأ simulation لأنه يمكن ما في FiveM (testing)
        startSimulatedProgress();

        // 👇 لو FiveM ما أرسل شي بعد ٣٠ ثانية، نعتبر التحميل خلص (fallback)
        setTimeout(function () {
            if (!fiveMReady) {
                fiveMReady = true;
                updateProgress(100);
                finishLoading();
            }
        }, 30000);

        // نبث للسيرفر أن اللودنق سكرين جاهزة
        fetch('https://cfx-nui-loadingScreen/ready', {
            method: 'POST',
            body: JSON.stringify({ ready: true }),
            headers: { 'Content-Type': 'application/json' }
        }).catch(function () {
            // Silent fail — يعني إحنا مو داخل FiveM (testing)
        });
    }

    // ---------------------------------
    // 7. 🔥 الإقلاع
    // ---------------------------------
    document.addEventListener('DOMContentLoaded', function () {
        applyConfig();
        initVideo();
        initAudio();
        initFiveM();

        // زر الوصف (toggle)
        const descBtn = document.getElementById('descBtn');
        const descText = document.getElementById('descText');
        if (descBtn && descText) {
            descBtn.addEventListener('click', function () {
                descText.classList.toggle('show');
            });
        }

        // زر الروابط - يظهر/يخفي أيقونات السوشيال
        const linksBtn = document.getElementById('linksBtn');
        const linksIcons = document.getElementById('linksIcons');
        if (linksBtn && linksIcons) {
            linksBtn.addEventListener('click', function () {
                linksIcons.classList.toggle('show');
            });
        }

        // حط رابط الدسكورد — ينسخ الرابط للحافظة
        const discordLink = document.getElementById('discordLink');
        const copyMsg = document.getElementById('copyMsg');
        const discordUrl = get('discord', '#');
        if (discordLink) {
            discordLink.addEventListener('click', function (e) {
                if (!discordUrl || discordUrl === '#') return;
                e.preventDefault();

                // نسخ الرابط للحافظة
                var textarea = document.createElement('textarea');
                textarea.value = discordUrl;
                textarea.style.position = 'fixed';
                textarea.style.opacity = '0';
                document.body.appendChild(textarea);
                textarea.select();
                try {
                    document.execCommand('copy');
                } catch (ex) {}
                document.body.removeChild(textarea);

                // إظهار رسالة "تم النسخ"
                if (copyMsg) {
                    copyMsg.classList.add('show');
                    setTimeout(function () {
                        copyMsg.classList.remove('show');
                    }, 2000);
                }
            });
        }

        // لو المستخدم يبي يختبر اللودنق سكرين برا السيرفر (localhost)
        // نقدر نستخدم F8 عشان نخفيها
        document.addEventListener('keydown', function (e) {
            if (e.key === 'F8') {
                fiveMReady = true;
                finishLoading();
            }
            // F5 تحديث
            if (e.key === 'F5') {
                e.preventDefault();
                location.reload();
            }
        });
    });

})();
