const fs = require('fs');
const os = require('os');
const path = require('path');
const { stdout } = require('process');
const fsPromises = require('fs/promises');

const folderSourceStyle = path.join(__dirname, 'styles');
const folderSourceAssets = path.join(__dirname, 'assets');
const folderProjectDist = path.join(__dirname, 'project-dist');
const folderProjectDistAssets = path.join(folderProjectDist, 'assets');

async function copyDir(sourceFolder, copyFolder) {
  try {
    await fsPromises.rm(copyFolder, { recursive: true, force: true });
    await fsPromises.mkdir(copyFolder, { recursive: true });

    const sourceFiles = await fsPromises.readdir(sourceFolder, {
      withFileTypes: true,
    });

    sourceFiles.forEach(async (item) => {
      const sourceFile = path.join(sourceFolder, item.name);
      const destinationFile = path.join(copyFolder, item.name);
      if (item.isFile()) {
        await fsPromises.copyFile(sourceFile, destinationFile);
      } else if (item.isDirectory()) {
        await copyDir(sourceFile, destinationFile);
      }
    });
  } catch (error) {
    stdout.write(
      `The directory has not been copied!${os.EOL}${error}${os.EOL}`,
    );
  }
}

async function createBundle(styleFolder, styleBundleStream) {
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
    cssFiles.sort((a, b) => b - a);

    writeBundle(cssFiles, styleBundleStream);
  } catch (error) {
    stdout.write(`${error}${os.EOL}`);
  }
}

function writeBundle(cssFiles, styleBundleStream) {
  if (!cssFiles.length) {
    styleBundleStream.end();
    return;
  }
  let currentfile = cssFiles.shift();
  let stream = fs.createReadStream(currentfile);
  stream.pipe(styleBundleStream, { end: false });
  stream.on('end', function () {
    writeBundle(cssFiles, styleBundleStream);
  });
}

async function changeIndexHtml() {
  try {
    const templateHtml = path.join(__dirname, 'template.html');
    let templateHtmlDom = await fsPromises.readFile(templateHtml, {
      encoding: 'utf8',
    });

    const componentsFolder = path.join(__dirname, 'components');
    const componentsFiles = await fsPromises.readdir(componentsFolder, {
      withFileTypes: true,
    });

    let arrCompHtmlFiles = [];

    for (let item of componentsFiles) {
      if (item.isFile() && path.extname(item.name) === '.html') {
        let filePath = path.join(componentsFolder, item.name);
        let fileParse = path.parse(filePath);
        let tempHtmlDomComponents = await fsPromises.readFile(filePath, {
          encoding: 'utf8',
        });
        arrCompHtmlFiles.push([`{{${fileParse.name}}}`, tempHtmlDomComponents]);
      }
    }

    for (let item of arrCompHtmlFiles) {
      templateHtmlDom = templateHtmlDom.replace(item[0], item[1]);
    }

    const indexFilePath = path.join(folderProjectDist, 'index.html');
    await fsPromises.writeFile(indexFilePath, templateHtmlDom, {
      encoding: 'utf8',
    });
  } catch (error) {
    stdout.write(`${error}${os.EOL}`);
  }
}

async function assemblyDist() {
  try {
    await copyDir(folderSourceAssets, folderProjectDistAssets);

    const styleBundleStream = fs.createWriteStream(
      path.join(__dirname, 'project-dist', 'style.css'),
    ); // поток записи в итоговый файл стилей
    await createBundle(folderSourceStyle, styleBundleStream);

    changeIndexHtml();
  } catch (error) {
    stdout.write(`${error}${os.EOL}`);
  }
}

assemblyDist();
