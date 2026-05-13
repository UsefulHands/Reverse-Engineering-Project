const fs = require('fs');

function generate() {
    if (!fs.existsSync('old_exports.txt') || !fs.existsSync('exports_with_ordinals.txt')) {
        console.log('[-] Hata: Kaynak .txt dosyaları bulunamadı!');
        return;
    }

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

    // Direkt JSON olarak kaydediyoruz
    fs.writeFileSync('mapping.json', JSON.stringify(mapping, null, 2));
    console.log('[+] mapping.json başarıyla oluşturuldu.');
}

generate();