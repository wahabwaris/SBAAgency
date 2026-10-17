// Exports lib/stock.ts as JSON for the PDF catalogue generator.
const ts = require("typescript");
const fs = require("fs");
const src = fs.readFileSync(__dirname + "/../lib/stock.ts", "utf8");
const js = ts.transpileModule(src, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2019 } }).outputText;
const m = { exports: {} };
new Function("module", "exports", "require", js)(m, m.exports, require);
fs.writeFileSync(process.argv[2] || "/tmp/stock.json", JSON.stringify({ ranges: m.exports.stockRanges, items: m.exports.stockItems }));
console.log("items", m.exports.stockItems.length);
