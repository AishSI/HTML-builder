const { stdout } = require('process');
const os = require('os');
const fsPromises = require('fs/promises');

const path = require('path');
const secretFolder = path.join(__dirname, 'secret-folder');

fsPromises
  .readdir(secretFolder, { withFileTypes: true })
  .then((result) => {
    result.forEach((item) => {
      if (item.isFile()) {
        let filePath = path.join(secretFolder, item.name);
        let fileParse = path.parse(filePath);
        fsPromises.stat(filePath).then((result) => {
          stdout.write(
            `${fileParse.name} - ${fileParse.ext.slice(1)} - ${Number(
              result.size,
            )}B` + os.EOL,
          );
        });
      }
    });
  })
  .catch((err) => console.error(err));
