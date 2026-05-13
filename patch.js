const fs = require('fs');
const agentPath = './agent.js';
let code = fs.readFileSync(agentPath, 'utf-8');

const oldExports = fs.readFileSync('old_exports.txt', 'utf-16le').split('\n');
const newExports = fs.readFileSync('exports_with_ordinals.txt', 'utf-16le').split('\n');

const mapping = {};
for (let i = 0; i < newExports.length; i++) {
    const oldName = oldExports[i].split(' ->')[0].trim();
    const newName = newExports[i].split(' ->')[0].trim();
    if (oldName && newName) {
        mapping[oldName] = newName;
    }
}

const mappingJson = JSON.stringify(mapping);

let result = code.replace(
    /function r\(exportName, retType, argTypes\) \{/,
    'var _obfuscatedMap = ' + mappingJson + ';\n      function r(exportName, retType, argTypes) {\n        exportName = _obfuscatedMap[exportName] || exportName;'
);

result = result.replace('export default require_index();', 'require_index();');

if (result !== code) {
    let finalResult = result;
    const parts = result.split('✂\n');
    if (parts.length === 2 && parts[0].startsWith('📦\n')) {
        const body = parts[1];
        const newLen = Buffer.byteLength(body, 'utf-8');
        const nameMatch = parts[0].match(/📦\n\d+ (.+)\n/);
        if (nameMatch) {
            finalResult = '📦\n' + newLen + ' ' + nameMatch[1] + '\n✂\n' + body;
        }
    }
    fs.writeFileSync(agentPath, finalResult, 'utf-8');
    console.log('[patch] global map done.');
} else {
    console.log('[patch] FAILED');
}
