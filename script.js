// script.js – Echo client-info tool (all-in-one)

class Echo {
    constructor() {
        this.sections = [];
    }

    addSection(provider) {
        this.sections.push(provider);
    }

    async render() {
        const container = document.getElementById('app');
        if (!container) return;
        container.innerHTML = '';

        for (const provider of this.sections) {
            const section = await provider();
            const secEl = document.createElement('section');

            const title = document.createElement('h2');
            title.textContent = section.title;

            const content = document.createElement('pre');
            content.textContent = section.content;

            secEl.appendChild(title);
            secEl.appendChild(content);
            container.appendChild(secEl);
        }
    }
}

const echo = new Echo();

// === Basic Environment ===
echo.addSection(() => ({ title: 'User Agent', content: navigator.userAgent }));
echo.addSection(() => ({ title: 'Language', content: navigator.language }));
echo.addSection(() => ({ title: 'Platform', content: navigator.platform }));
echo.addSection(() => ({ title: 'Timezone', content: Intl.DateTimeFormat().resolvedOptions().timeZone }));
echo.addSection(() => ({ title: 'Timezone Offset', content: new Date().getTimezoneOffset() + ' min' }));
echo.addSection(() => ({ title: 'Cookies Enabled', content: navigator.cookieEnabled ? 'Yes' : 'No' }));
echo.addSection(() => ({ title: 'Do Not Track', content: navigator.doNotTrack ?? 'Not supported' }));
echo.addSection(() => ({ title: 'Online', content: navigator.onLine ? 'Yes' : 'No' }));

// === Hardware / Display ===
echo.addSection(() => ({ title: 'Screen Size', content: `${window.screen.width} × ${window.screen.height}` }));
echo.addSection(() => ({ title: 'Color Depth', content: window.screen.colorDepth + ' bit' }));
echo.addSection(() => ({ title: 'Pixel Ratio', content: window.devicePixelRatio }));
if ('deviceMemory' in navigator) {
    echo.addSection(() => ({ title: 'Device Memory', content: navigator.deviceMemory + ' GB' }));
}
if ('hardwareConcurrency' in navigator) {
    echo.addSection(() => ({ title: 'CPU Cores', content: navigator.hardwareConcurrency }));
}

// === Network ===
if ('connection' in navigator) {
    const c = navigator.connection;
    echo.addSection(() => ({ title: 'Connection Type', content: c.effectiveType }));
    echo.addSection(() => ({ title: 'Downlink Speed', content: c.downlink + ' Mb/s' }));
}

// === OS Preferences ===
echo.addSection(() => ({
    title: 'Color Scheme',
    content: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}));
echo.addSection(() => ({
    title: 'Reduced Motion',
    content: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'Yes' : 'No'
}));

// === Feature Support ===
echo.addSection(() => ({ title: 'Service Worker Support', content: 'serviceWorker' in navigator ? 'Yes' : 'No' }));
echo.addSection(() => ({ title: 'WebGL Support', content: 'WebGLRenderingContext' in window ? 'Yes' : 'No' }));
echo.addSection(() => ({ title: 'Clipboard API', content: 'clipboard' in navigator ? 'Yes' : 'No' }));

// === Async: Storage Estimate ===
if (navigator.storage?.estimate) {
    navigator.storage.estimate().then(e => {
        echo.addSection(() => ({ title: 'Storage Used', content: (e.usage / 1048576).toFixed(2) + ' MB' }));
        echo.addSection(() => ({ title: 'Storage Quota', content: (e.quota / 1048576).toFixed(2) + ' MB' }));
        echo.render();
    });
}

// === Async: Battery ===
if ('getBattery' in navigator) {
    navigator.getBattery().then(b => {
        echo.addSection(() => ({ title: 'Battery Level', content: (b.level * 100).toFixed(0) + '%' }));
        echo.addSection(() => ({ title: 'Charging', content: b.charging ? 'Yes' : 'No' }));
        echo.render();
    });
}

// === Async: Geolocation ===
if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(pos => {
        const { latitude, longitude } = pos.coords;
        echo.addSection(() => ({ title: 'Location', content: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}` }));
        echo.render();
    }, () => {
        echo.addSection(() => ({ title: 'Location', content: 'Permission denied' }));
        echo.render();
    });
}

// === Async: Public IP ===
fetch('/client-ip', { cache: 'no-store' })
    .then(r => r.json())
    .then(({ ip }) => {
        echo.addSection(() => ({ title: 'Public IP', content: ip }));
    })
    .catch(() => {
        echo.addSection(() => ({ title: 'Public IP', content: 'Unavailable' }));
    })
    .finally(() => echo.render());

function getWebGLInfo() {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return { vendor: 'Unavailable', renderer: 'Unavailable' };
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    return {
        vendor: debugInfo ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) : 'Unavailable',
        renderer: debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : 'Unavailable'
    };
}
const { vendor, renderer } = getWebGLInfo();
echo.addSection(() => ({ title: 'WebGL Vendor', content: vendor }));
echo.addSection(() => ({ title: 'WebGL Renderer', content: renderer }));
