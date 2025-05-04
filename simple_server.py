import http.server
import socketserver
import os
import webbrowser

PORT = 8000

class MyHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        http.server.SimpleHTTPRequestHandler.end_headers(self)

print(f"Starting server at http://localhost:{PORT}")
print("Opening browser automatically...")
print("Press Ctrl+C to stop the server")

# Open browser automatically
webbrowser.open(f'http://localhost:{PORT}/standalone-menu.html')

# Start server
with socketserver.TCPServer(("", PORT), MyHandler) as httpd:
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped.")
