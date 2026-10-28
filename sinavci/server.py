import os
import sys
import json
import mimetypes
import urllib.parse
from http.server import ThreadingHTTPServer, BaseHTTPRequestHandler

PORT = int(os.environ.get("PORT", sys.argv[1] if len(sys.argv) > 1 and sys.argv[1].isdigit() else 8080))
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
STORAGE_FILE = os.path.join(BASE_DIR, "egemens_storage.json")

# Ensure complete mime types
mimetypes.init()
mimetypes.add_type("application/javascript", ".js")
mimetypes.add_type("text/css", ".css")
mimetypes.add_type("application/json", ".json")
mimetypes.add_type("font/woff2", ".woff2")
mimetypes.add_type("font/woff", ".woff")
mimetypes.add_type("font/ttf", ".ttf")
mimetypes.add_type("font/otf", ".otf")
mimetypes.add_type("image/webp", ".webp")
mimetypes.add_type("image/svg+xml", ".svg")
mimetypes.add_type("image/png", ".png")
mimetypes.add_type("image/x-icon", ".ico")
mimetypes.add_type("application/manifest+json", ".webmanifest")
mimetypes.add_type("text/plain", ".txt")

ROUTE_MAP = {
    "": "index.html",
    "basla": "index.html",
    "test": "test/index.html",
    "foy": "foy/index.html",
    "yazili": "yazili/index.html",
    "havuz": "havuz/index.html",
    "sinavlarim": "sinavlarim/index.html",
}

class EgemenServerHandler(BaseHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE, HEAD")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With, RSC, Next-Router-State-Tree")
        self.send_header("Cache-Control", "no-cache")
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        
        length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(length) if length > 0 else b''

        # Local storage & document sync
        if path.startswith("/bulut/") or path.startswith("/baski/") or path.startswith("/cdn-cgi/") or path.startswith("/api/"):
            try:
                data = json.loads(body.decode("utf-8", errors="ignore")) if body else {}
                with open(STORAGE_FILE, "a", encoding="utf-8") as f:
                    f.write(json.dumps({"endpoint": path, "payload": data}, ensure_ascii=False) + "\n")
            except Exception:
                pass
            self.send_json({"success": True, "status": "ok", "synced": True})
            return

        self.send_json({"success": True})

    def do_HEAD(self):
        parsed = urllib.parse.urlparse(self.path)
        clean_path = parsed.path.strip("/")
        
        if clean_path in ROUTE_MAP or clean_path == "":
            self.send_response(200)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.end_headers()
            return

        file_path = os.path.join(BASE_DIR, clean_path.replace("/", os.sep))
        if os.path.exists(file_path) and os.path.isfile(file_path):
            ctype, _ = mimetypes.guess_type(file_path)
            self.send_response(200)
            self.send_header("Content-Type", ctype or "application/octet-stream")
            self.send_header("Content-Length", str(os.path.getsize(file_path)))
            self.end_headers()
            return

        self.send_response(200)
        self.end_headers()

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        raw_path = parsed.path
        clean_path = raw_path.strip("/")

        # 1. Direct route match (HTML pages)
        if clean_path in ROUTE_MAP:
            target_rel = ROUTE_MAP[clean_path]
            return self.serve_file(target_rel, "text/html; charset=utf-8")

        # 2. Check for route.txt (e.g., test.txt, foy.txt, basla.txt)
        if clean_path.endswith(".txt"):
            direct_txt = os.path.join(BASE_DIR, clean_path.replace("/", os.sep))
            if os.path.exists(direct_txt):
                return self.serve_file(clean_path, "text/plain; charset=utf-8")

        # 3. Check for __next._tree.txt
        if clean_path.endswith("__next._tree.txt"):
            direct_file = os.path.join(BASE_DIR, clean_path.replace("/", os.sep))
            if os.path.exists(direct_file):
                return self.serve_file(clean_path, "text/plain; charset=utf-8")
            return self.serve_file("__next._tree.txt", "text/plain; charset=utf-8")

        # 4. Check for page RSC payloads
        if "__next." in clean_path and clean_path.endswith(".txt"):
            direct_file = os.path.join(BASE_DIR, clean_path.replace("/", os.sep))
            if os.path.exists(direct_file):
                return self.serve_file(clean_path, "text/plain; charset=utf-8")

        # 5. Check on-disk file
        file_path = os.path.join(BASE_DIR, clean_path.replace("/", os.sep))
        if os.path.exists(file_path):
            if os.path.isfile(file_path):
                ctype, _ = mimetypes.guess_type(file_path)
                return self.serve_file(clean_path, ctype or "application/octet-stream")
            idx_path = os.path.join(file_path, "index.html")
            if os.path.exists(idx_path):
                return self.serve_file(os.path.relpath(idx_path, BASE_DIR), "text/html; charset=utf-8")

        # 6. Fallback to index.html
        self.serve_file("index.html", "text/html; charset=utf-8")

    def serve_file(self, rel_path, content_type):
        full_path = os.path.join(BASE_DIR, rel_path.replace("/", os.sep))
        if not os.path.exists(full_path) or not os.path.isfile(full_path):
            self.send_response(404)
            self.end_headers()
            self.wfile.write(b"404 Not Found")
            return

        try:
            with open(full_path, "rb") as f:
                content = f.read()
            self.send_response(200)
            self.send_header("Content-Type", content_type)
            self.send_header("Content-Length", str(len(content)))
            self.end_headers()
            self.wfile.write(content)
        except Exception as e:
            self.send_response(500)
            self.end_headers()
            self.wfile.write(str(e).encode("utf-8"))

    def send_json(self, data):
        body = json.dumps(data, ensure_ascii=False).encode("utf-8")
        self.send_response(200)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

def run():
    server_address = ("127.0.0.1", PORT)
    httpd = ThreadingHTTPServer(server_address, EgemenServerHandler)
    print(f"==================================================")
    print(f"       SINAVCI - EGEMEN'S TESTMAKER STÜDYOSU")
    print(f"==================================================")
    print(f"  URL: http://localhost:{PORT}")
    print(f"  Atölyeler:")
    print(f"    * Yaprak Test  : http://localhost:{PORT}/test")
    print(f"    * Yazılı Sınav : http://localhost:{PORT}/yazili")
    print(f"    * Konu Föyü    : http://localhost:{PORT}/foy")
    print(f"    * Soru Havuzu  : http://localhost:{PORT}/havuz")
    print(f"  Kapatmak için: Ctrl + C")
    print(f"==================================================")
    
    if "--open" in sys.argv:
        import webbrowser
        webbrowser.open(f"http://localhost:{PORT}/")

    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nSunucu kapatiliyor...")
        httpd.server_close()

if __name__ == "__main__":
    run()
