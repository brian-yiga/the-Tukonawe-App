const fs = require("fs");
const path = require("path");
const indexPath = path.join(__dirname, "..", "dist", "index.html");

if (!fs.existsSync(indexPath)) {
  console.error("dist/index.html not found. Run the web export build first.");
  process.exit(1);
}

let html = fs.readFileSync(indexPath, "utf8");

const headTags = `  <link rel="manifest" href="/manifest.json" />
  <meta name="theme-color" content="#1a5c3f" />
  <meta name="mobile-web-app-capable" content="yes" />
  <link rel="apple-touch-icon" href="/icon-square.png" />
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
`;

if (html.includes('rel="manifest"')) {
  console.log("dist/index.html already contains PWA head tags.");
  process.exit(0);
}

const needle = '<meta http-equiv="X-UA-Compatible" content="IE=edge"/>';
if (!html.includes(needle)) {
  console.error("Could not find expected insertion point in dist/index.html.");
  process.exit(1);
}

html = html.replace(needle, `${needle}\n${headTags}`);

// Add noscript fallback after body tag
const bodyStart = "<body>";
if (html.includes(bodyStart)) {
  const noscriptFallback =
    '<noscript><div style="display:flex;align-items:center;justify-content:center;height:100vh;background:#0d1621;color:#fff;font-family:system-ui;text-align:center;"><div><h1>JavaScript Required</h1><p>Please enable JavaScript to use this app.</p></div></div></noscript>';
  html = html.replace(bodyStart, bodyStart + noscriptFallback);
}

fs.writeFileSync(indexPath, html, "utf8");
console.log("Patched dist/index.html with PWA head tags.");
