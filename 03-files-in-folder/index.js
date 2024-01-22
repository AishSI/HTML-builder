const { stdout } = require('process');
const os = require('os');
const fsPromises = require('fs/promises');
const path = require('path');
const secretFolder = path.join(__dirname, 'secret-folder');

async function getFilesInfo() {
  try {
    const allOfDir = await fsPromises.readdir(secretFolder, {
      withFileTypes: true,
    });
    const filesList = allOfDir.filter((item) => !item.isDirectory());

    filesList.forEach(async (file) => {
      const filePath = path.join(secretFolder, file.name);
      const fileParse = path.parse(filePath);
      const fileSize = await fsPromises.stat(filePath);

      stdout.write(
        `${fileParse.name} - ${fileParse.ext.slice(1)} - ${Number(
          fileSize.size,
        )}B${os.EOL}`,
      );
    });
  } catch (error) {
    stdout.write(`${error}${os.EOL}`);
  }
}

getFilesInfo();
