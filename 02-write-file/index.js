const fs = require('fs');
const path = require('path');
const os = require('os');
const { stdin, stdout, exit } = require('process');

const textFile = path.join(__dirname, 'text.txt');
const output = fs.createWriteStream(textFile, 'utf-8');

stdout.write('Hello! Enter your text from a new line:' + os.EOL);

stdin.on('data', (chunk) => {
  if (chunk.toString().trim() === 'exit') {
    goodbye();
  }
  output.write(chunk);
});

stdin.on('error', (error) => console.log('Error', error.message));

process.on('SIGINT', goodbye);

function goodbye() {
  stdout.write('Goodbye!');
  exit();
}
