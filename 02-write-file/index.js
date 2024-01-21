const fs = require('fs');
const path = require('path');
const os = require('os');
const readline = require('readline');
const { stdin, stdout, exit } = require('process');

const textFile = path.join(__dirname, 'text.txt');
const outputFile = fs.createWriteStream(textFile, 'utf-8');

const rl = readline.createInterface({ input: stdin, output: stdout });

rl.output.write('Hello! Enter your text from a new line:' + os.EOL);

rl.on('line', (chunk) => {
  if (chunk.toString().trim() === 'exit') {
    goodbye();
  }
  outputFile.write(chunk + os.EOL);
});

rl.on('SIGINT', goodbye);

function goodbye() {
  rl.output.write('Goodbye!');
  exit();
}
