const express = require('express');
const path = require('path');
const app = express();
const port = 8000;

// Serve static files from the current directory
app.use(express.static('.'));

// Redirect image requests from static/media to images folder
app.get('/static/media/*', (req, res) => {
  const requestedPath = req.path.replace('/static/media/', '');
  const imagePath = path.join(__dirname, 'images', requestedPath);

  // Try to serve the file from the images directory
  res.sendFile(imagePath, (err) => {
    if (err) {
      // If file not found in images, try to serve from original path
      const originalPath = path.join(__dirname, req.path);
      res.sendFile(originalPath, (err) => {
        if (err) {
          // If still not found, send a default image from images folder
          const files = require('fs').readdirSync(path.join(__dirname, 'images'));
          if (files.length > 0) {
            const defaultImage = path.join(__dirname, 'images', files[0]);
            res.sendFile(defaultImage);
          } else {
            res.status(404).send('Image not found');
          }
        }
      });
    }
  });
});

// Serve menu.html for /menu route
app.get('/menu', (req, res) => {
  res.sendFile(path.join(__dirname, 'menu.html'));
});

// Serve calories.html for /calories route
app.get('/calories', (req, res) => {
  res.sendFile(path.join(__dirname, 'calories.html'));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
