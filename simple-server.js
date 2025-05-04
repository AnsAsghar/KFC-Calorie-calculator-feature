const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8000;

const server = http.createServer((req, res) => {
  console.log(`Request for ${req.url}`);
  
  // Set the content type based on the file extension
  let contentType = 'text/html';
  let filePath = '.' + req.url;
  
  if (filePath === './') {
    filePath = './index.html';
  } else if (filePath === './menu') {
    filePath = './menu.html';
  }
  
  const extname = path.extname(filePath);
  switch (extname) {
    case '.js':
      contentType = 'text/javascript';
      break;
    case '.css':
      contentType = 'text/css';
      break;
    case '.json':
      contentType = 'application/json';
      break;
    case '.png':
      contentType = 'image/png';
      break;
    case '.jpg':
    case '.jpeg':
      contentType = 'image/jpeg';
      break;
    case '.svg':
      contentType = 'image/svg+xml';
      break;
  }
  
  // Handle image requests from static/media
  if (req.url.startsWith('/static/media/')) {
    const requestedPath = req.url.replace('/static/media/', '');
    const imagePath = path.join(__dirname, 'images', requestedPath);
    
    fs.readFile(imagePath, (err, content) => {
      if (err) {
        // If file not found in images, try to serve from original path
        const originalPath = path.join(__dirname, req.url);
        fs.readFile(originalPath, (err, content) => {
          if (err) {
            // If still not found, try to send a default image
            fs.readdir(path.join(__dirname, 'images'), (err, files) => {
              if (err || files.length === 0) {
                res.writeHead(404);
                res.end('Image not found');
                return;
              }
              
              const defaultImage = path.join(__dirname, 'images', files[0]);
              fs.readFile(defaultImage, (err, content) => {
                if (err) {
                  res.writeHead(404);
                  res.end('Image not found');
                  return;
                }
                
                res.writeHead(200, { 'Content-Type': getContentType(defaultImage) });
                res.end(content, 'utf-8');
              });
            });
            return;
          }
          
          res.writeHead(200, { 'Content-Type': getContentType(originalPath) });
          res.end(content, 'utf-8');
        });
        return;
      }
      
      res.writeHead(200, { 'Content-Type': getContentType(imagePath) });
      res.end(content, 'utf-8');
    });
    return;
  }
  
  // Read the file
  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // Page not found
        fs.readFile('./404.html', (err, content) => {
          if (err) {
            res.writeHead(404);
            res.end('404 - File Not Found');
          } else {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end(content, 'utf-8');
          }
        });
      } else {
        // Server error
        res.writeHead(500);
        res.end(`Server Error: ${err.code}`);
      }
    } else {
      // Success
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

function getContentType(filePath) {
  const extname = path.extname(filePath);
  switch (extname) {
    case '.js':
      return 'text/javascript';
    case '.css':
      return 'text/css';
    case '.json':
      return 'application/json';
    case '.png':
      return 'image/png';
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.svg':
      return 'image/svg+xml';
    default:
      return 'text/html';
  }
}

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
