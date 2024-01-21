const fs = require('fs');
const path = require('path');
const { stdout } = require('process');

const fileRead = path.join(__dirname, 'text.txt');
const stream = fs.createReadStream(fileRead, 'utf-8');
stream.on('data', (chunk) => stdout.write(chunk));
stream.on('error', (error) => stdout.write(`Error ${error.message}`));
