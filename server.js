const fs = require('fs');
const https = require('https');
const express = require('express');
const path = require('path');

const app = express();

const options = {
  key: fs.readFileSync('localhost+2-key.pem'),   // Use the key file
  cert: fs.readFileSync('localhost+2.pem')      // Use the certificate file
};

app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

https.createServer(options, app).listen(8081, () => {
  console.log('Server is running on https://localhost:8081');
});
