const fs = require('fs');
const os = require('os');
const { stdout } = require('process');
const fsPromises = require('fs/promises');

const path = require('path');
const styleFolder = path.join(__dirname, 'styles');
const styleBundleFile = path.join(__dirname, 'project-dist', 'bundle.css');
const styleBundleStream = fs.createWriteStream(styleBundleFile);

async function createBundle(styleFolder) {
  try {
    const styleFiles = await fsPromises.readdir(styleFolder, {
      withFileTypes: true,
    });
    let cssFiles = [];
    styleFiles.forEach((item) => {
      if (item.isFile() && path.extname(item.name) === '.css') {
        cssFiles.push(path.join(styleFolder, item.name));
      }
    });
    cssFiles.sort((a, b) => a - b);
    writeBundle(cssFiles);
    stdout.write(`Created bundle:${os.EOL}${styleBundleFile}${os.EOL}`);
  } catch (error) {
    stdout.write(`${error} ${os.EOL}`);
  }
}

function writeBundle(cssFiles) {
  if (!cssFiles.length) {
    styleBundleStream.end();
    return;
  }
  const currentfile = cssFiles.shift();
  const stream = fs.createReadStream(currentfile);
  stream.pipe(styleBundleStream, { end: false });
  stream.on('end', function () {
    writeBundle(cssFiles);
  });
}

createBundle(styleFolder);
