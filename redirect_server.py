import http.server
import socketserver
import os
import re
from urllib.parse import urlparse

PORT = 8000

class ImageRedirectHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        # Parse the URL
        parsed_url = urlparse(self.path)
        path = parsed_url.path
        
        # Check if the request is for an image in static/media
        if path.startswith('/static/media/') and (path.endswith('.png') or path.endswith('.jpg') or path.endswith('.jpeg') or path.endswith('.svg')):
            # Try to redirect to an image in the images folder
            image_name = os.path.basename(path)
            images_dir = os.path.join(os.getcwd(), 'images')
            
            # Find a matching image or any image if no match
            found_image = None
            if os.path.exists(images_dir):
                for file in os.listdir(images_dir):
                    if file == image_name:
                        found_image = os.path.join('images', file)
                        break
                
                # If no exact match, use any image with the same extension
                if not found_image:
                    extension = os.path.splitext(image_name)[1]
                    for file in os.listdir(images_dir):
                        if file.endswith(extension):
                            found_image = os.path.join('images', file)
                            break
            
            if found_image:
                self.send_response(302)
                self.send_header('Location', '/' + found_image.replace('\\', '/'))
                self.end_headers()
                return
        
        # Default behavior for all other requests
        return http.server.SimpleHTTPRequestHandler.do_GET(self)

with socketserver.TCPServer(("", PORT), ImageRedirectHandler) as httpd:
    print(f"Serving at http://localhost:{PORT}")
    httpd.serve_forever()
