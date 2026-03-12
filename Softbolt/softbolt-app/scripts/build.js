/**
 * Softbolt Build Script
 *
 * Copies softbolt-mobile.html into www/index.html and injects
 * safe-area CSS and Capacitor bridge for native shell.
 */

const fs = require('fs');
const path = require('path');

// Use the mobile-compatible version (pre-compiled Babel approach)
const SRC = path.resolve(__dirname, '..', '..', 'softbolt-mobile.html');
const FALLBACK_SRC = path.resolve(__dirname, '..', '..', 'softbolt.html');
const DEST_DIR = path.resolve(__dirname, '..', 'www');
const DEST = path.join(DEST_DIR, 'index.html');

// ── Safe-area CSS for notched devices ──
const SAFE_AREA_CSS = `
    <style>
      /* ── Capacitor / Native App Safe Areas ── */
      :root {
        --sat: env(safe-area-inset-top, 0px);
        --sab: env(safe-area-inset-bottom, 0px);
        --sal: env(safe-area-inset-left, 0px);
        --sar: env(safe-area-inset-right, 0px);
      }
      html, body {
        padding: 0;
        margin: 0;
        overscroll-behavior: none;
        -webkit-overflow-scrolling: touch;
        -webkit-tap-highlight-color: transparent;
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        user-select: none;
      }
      .sb-tab-bar {
        padding-bottom: var(--sab) !important;
      }
      .sb-miniplayer {
        bottom: calc(57px + var(--sab)) !important;
      }
      body {
        overscroll-behavior-y: contain;
      }
      button, a, [role="button"] {
        -webkit-user-select: none;
        user-select: none;
      }
      input, textarea {
        -webkit-user-select: text;
        user-select: text;
      }
    </style>
`;

// ── Capacitor bridge script ──
const CAPACITOR_BRIDGE = `
    <script>
      if (window.Capacitor) {
        document.addEventListener('backbutton', function() {
          window.history.back();
        });
        if (window.Capacitor.Plugins && window.Capacitor.Plugins.StatusBar) {
          window.Capacitor.Plugins.StatusBar.setStyle({ style: 'LIGHT' });
          window.Capacitor.Plugins.StatusBar.setBackgroundColor({ color: '#000000' });
        }
        if (window.Capacitor.Plugins && window.Capacitor.Plugins.SplashScreen) {
          window.Capacitor.Plugins.SplashScreen.hide();
        }
      }
    </script>
`;

// ── Build ──
console.log('[Softbolt Build] Starting...');

let srcPath = SRC;
if (!fs.existsSync(SRC)) {
  if (fs.existsSync(FALLBACK_SRC)) {
    srcPath = FALLBACK_SRC;
    console.log('[Softbolt Build] Using softbolt.html (fallback)');
  } else {
    console.error('[ERROR] No source file found. Expected softbolt-mobile.html or softbolt.html in parent directory.');
    process.exit(1);
  }
} else {
  console.log('[Softbolt Build] Using softbolt-mobile.html');
}

if (!fs.existsSync(DEST_DIR)) {
  fs.mkdirSync(DEST_DIR, { recursive: true });
}

let html = fs.readFileSync(srcPath, 'utf8');

// Inject safe-area CSS before closing </head>
html = html.replace('</head>', `${SAFE_AREA_CSS}\n  </head>`);

// Inject Capacitor bridge before closing </body>
html = html.replace('</body>', `${CAPACITOR_BRIDGE}\n  </body>`);

fs.writeFileSync(DEST, html);

const sizeKB = (fs.statSync(DEST).size / 1024).toFixed(1);
console.log(`[Softbolt Build] ✓ Built www/index.html (${sizeKB} KB)`);
console.log('[Softbolt Build] Done!');
