"""Local review server with byte-range support for reliable video seeking."""
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
import re
import shutil

ROOT = Path(__file__).resolve().parent

class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def send_head(self):
        self.byte_count = None
        file = Path(self.translate_path(self.path))
        if not file.is_file():
            return super().send_head()
        size = file.stat().st_size
        match = re.fullmatch(r'bytes=(\d+)-(\d*)', self.headers.get('Range', ''))
        start, end = 0, size - 1
        if match:
            start = int(match[1])
            end = min(int(match[2]) if match[2] else end, end)
            if start > end:
                self.send_response(416)
                self.send_header('Content-Range', f'bytes */{size}')
                self.end_headers()
                return None
        self.send_response(206 if match else 200)
        self.send_header('Content-Type', self.guess_type(str(file)))
        self.send_header('Accept-Ranges', 'bytes')
        self.send_header('Content-Length', str(end-start+1))
        if match:
            self.send_header('Content-Range', f'bytes {start}-{end}/{size}')
        self.end_headers()
        handle = file.open('rb')
        handle.seek(start)
        self.byte_count = end-start+1
        return handle

    def copyfile(self, source, outputfile):
        if self.byte_count is None:
            return shutil.copyfileobj(source, outputfile)
        remaining = self.byte_count
        try:
            while remaining:
                chunk = source.read(min(65536, remaining))
                if not chunk: break
                outputfile.write(chunk)
                remaining -= len(chunk)
        except (BrokenPipeError, ConnectionResetError, ConnectionAbortedError):
            pass

if __name__ == '__main__':
    print('ANU review player: http://127.0.0.1:8767', flush=True)
    ThreadingHTTPServer(('127.0.0.1', 8767), Handler).serve_forever()
