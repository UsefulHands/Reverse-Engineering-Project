const frida = require("frida");
const fs = require("fs");
const path = require("path");

async function main() {
    try {
        const scriptPath = path.join(__dirname, "agent.js");
        if (!fs.existsSync(scriptPath)) {
            console.error("agent.js not found!");
            process.exit(1);
        }
        const scriptCode = fs.readFileSync(scriptPath, "utf-8");
        
        const device = await frida.getLocalDevice();
        const processes = await device.enumerateProcesses();
        const targetProcess = processes.find(p => p.name.toLowerCase().includes("pixelworlds"));
        
        if (!targetProcess) {
            console.log("PixelWorlds calismiyor. Lutfen once oyunu acin.");
            // Wait for 5 seconds before exiting
            await new Promise(r => setTimeout(r, 5000));
            process.exit(1);
        }
        
        const session = await frida.attach(targetProcess.pid);
        
        const script = await session.createScript(scriptCode);
        
        script.message.connect((message) => {
            if (message.type === 'send') {
                console.log("[*]", message.payload);
            } else if (message.type === 'error') {
                console.error("[!]", message.stack);
                console.error("[!] description:", message.description);
            } else {
                console.log(message);
            }
        });

        script.logHandler = (level, text) => {
            console.log(`[log][${level}] ${text}`);
        };

        await script.load();
        
        // Keep alive
        process.on('SIGINT', async () => {
            await session.detach();
            process.exit(0);
        });
        
    } catch (err) {
        console.error("Hata:", err);
        await new Promise(r => setTimeout(r, 5000));
    }
}

main();