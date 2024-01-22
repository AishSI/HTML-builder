const { stdout } = require('process');
const os = require('os');
const fsPromises = require('fs/promises');

const path = require('path');
const sourceFolder = path.join(__dirname, 'files');
const copyFolder = path.join(__dirname, 'files-copy');

async function copyDir(sourceFolder, copyFolder) {
  try {
    await fsPromises.rm(copyFolder, { recursive: true, force: true });

    const createDir = await fsPromises.mkdir(copyFolder, { recursive: true });
    stdout.write(`created ${createDir}${os.EOL}`);

    const sourceFiles = await fsPromises.readdir(sourceFolder, {
      withFileTypes: true,
    });

    sourceFiles.forEach(async (item) => {
      const sourceFile = path.join(sourceFolder, item.name);
      const destinationFile = path.join(copyFolder, item.name);
      if (item.isFile()) {
        await fsPromises.copyFile(sourceFile, destinationFile);
      }
    });
  } catch (error) {
    stdout.write(
      `The directory has not been copied!${os.EOL}${error}${os.EOL}`,
    );
  }
}

copyDir(sourceFolder, copyFolder);
