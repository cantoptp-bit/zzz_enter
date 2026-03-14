#!/usr/bin/env python3
"""Local dev server with Range request support so video/mp4 loads correctly."""
import http.server
import socketserver
import os

class RangeRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Accept-Ranges", "bytes")
        super().end_headers()

    def do_GET(self):
        path = self.translate_path(self.path)
        if not os.path.isfile(path):
            return super().do_GET()
        size = os.path.getsize(path)
        range_header = self.headers.get("Range")
        if not range_header:
            return super().do_GET()
        try:
            # Parse "bytes=start-end"
            r = range_header.replace("bytes=", "").strip().split("-")
            start = int(r[0]) if r[0] else 0
            end = int(r[1]) if len(r) > 1 and r[1] else size - 1
            end = min(end, size - 1)
            if start > end or start < 0:
                self.send_error(416, "Range Not Satisfiable")
                return
            length = end - start + 1
            self.send_response(206)
            self.send_header("Content-Type", self.guess_type(path))
            self.send_header("Content-Range", "bytes %d-%d/%d" % (start, end, size))
            self.send_header("Content-Length", str(length))
            self.send_header("Accept-Ranges", "bytes")
            self.end_headers()
            with open(path, "rb") as f:
                f.seek(start)
                self.wfile.write(f.read(length))
        except (ValueError, OSError):
            return super().do_GET()

    def guess_type(self, path):
        if path.endswith(".mp4"):
            return "video/mp4"
        return http.server.SimpleHTTPRequestHandler.guess_type(self, path)

if __name__ == "__main__":
    PORT = 8080
    with socketserver.TCPServer(("", PORT), RangeRequestHandler) as httpd:
        print("Serving at http://localhost:%s (video Range support enabled)" % PORT)
        httpd.serve_forever()
