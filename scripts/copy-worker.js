const fs = require("fs");
const path = require("path");

const src = path.join(__dirname, "../node_modules/pdfjs-dist/build/pdf.worker.min.mjs");
const dest = path.join(__dirname, "../public/pdf.worker.min.js");

if (!fs.existsSync(path.join(__dirname, "../public"))) {
  fs.mkdirSync(path.join(__dirname, "../public"), { recursive: true });
}

fs.copyFileSync(src, dest);
console.log("✓ pdf.worker.min.js copiado para public/");
