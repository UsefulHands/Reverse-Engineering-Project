import frida
import sys
import time
import os

def on_message(message, data):
    pass

def main():
    log_file = os.path.join(os.getenv('TEMP'), 'fishbot_log.txt')
    try:
        def log(msg):
            with open(log_file, "a") as f:
                f.write(msg + "\n")
                
        log("Bot baslatiliyor...")
        # Determine paths based on PyInstaller extraction
        if getattr(sys, 'frozen', False):
            base_path = sys._MEIPASS
        else:
            base_path = os.path.dirname(os.path.abspath(__file__))
            
        script_path = os.path.join(base_path, 'agent.js')
        log(f"Agent yolu: {script_path}")
        
        with open(script_path, 'r', encoding='utf-8') as f:
            script_code = f.read()

        process_target = "pixelworlds"
        
        device = frida.get_local_device()
        target_pid = None
        
        log("Oyun bekleniyor...")
        # Oyun açılana kadar bekle
        while not target_pid:
            for proc in device.enumerate_processes():
                if process_target in proc.name.lower():
                    target_pid = proc.pid
                    break
            if not target_pid:
                time.sleep(2)
                
        log(f"Oyun bulundu! PID: {target_pid}")
            
        session = frida.attach(target_pid)
        script = session.create_script(script_code)
        script.on('message', on_message)
        script.load()
        log("Script basariyla enjekte edildi. Arka planda calisiyor.")
        
        # Keep alive as a background process
        while True:
            time.sleep(1)
    except Exception as e:
        with open(log_file, "a") as f:
            f.write(f"HATA: {str(e)}\n")
        sys.exit(1)

if __name__ == '__main__':
    main()