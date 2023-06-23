import path from "node:path";
import DirMgmt from "./dirMgmt.js";
import fs from 'node:fs';
import zlib from 'zlib';
import CustomOutput from "../utils/CustomOutput.js";

class Archive {
  async delegate(op, currDir) {
    switch (op.command) {
      case 'compress':
        await this.compress(op.args[0], op.args[1], currDir);
        break;
      case 'decompress':
        await this.decompress(op.args[0], op.args[1], currDir);
        break;
      default:
        break;
    }
  }

  async compress(pathToFile, pathToDest, currDir) {
    const detPathToFile = await DirMgmt.determinePath(currDir, pathToFile);
    // console.log('detPathToFile', detPathToFile);
    const detPathToDest = await DirMgmt.determinePath(currDir, pathToDest);
    // console.log('detNewPath', detPathToDest);
    const fileName = DirMgmt.getFilename(pathToFile);
    // console.log('fileName', fileName);
    const archvFileName = 'compressed_' + fileName + '.br';
    const brotli = zlib.createBrotliCompress();

    const rs = fs.createReadStream(detPathToFile);
    rs.on("error", (err) => {
      console.error(err);
    })

    const ws = fs.createWriteStream(path.join(detPathToDest, archvFileName));
    ws.on('error', (err) => {
      console.error(err);
    })
    ws.on('finish', () => {
      CustomOutput.logColoredMessage('Compression finished', 'cyan');
    })

    const stream = rs.pipe(brotli).pipe(ws);
    // stream.on('finish', () => {
    //   CustomOutput.logColoredMessage('Compression finished', 'cyan');
    // });
  }

  async decompress(pathToFile, pathToDest, currDir) {
    const detPathToFile = await DirMgmt.determinePath(currDir, pathToFile);
    // console.log('detPathToFile', detPathToFile);
    const detPathToDest = await DirMgmt.determinePath(currDir, pathToDest);
    // console.log('detNewPath', detPathToDest);
    const archvFileName = DirMgmt.getFilename(pathToFile);
    // console.log('archvFileName', archvFileName);
    if (!archvFileName.endsWith('.br')) throw new Error('The chosen file is not an archive'); 
    let decomprFileName = archvFileName;
    if (decomprFileName.startsWith('compressed_')) decomprFileName = decomprFileName.replace('compressed_', '');
    if (decomprFileName.endsWith('.br')) decomprFileName = decomprFileName.replace(/.br$/g, '');
    console.log('decomprFileName', decomprFileName);
    const brotli = zlib.createBrotliDecompress();

    const rs = fs.createReadStream(detPathToFile);
    rs.on("error", (err) => {
      console.error(err);
    })

    const ws = fs.createWriteStream(path.join(detPathToDest, decomprFileName));
    ws.on('error', (err) => {
      console.error(err);
    })
    ws.on('finish', () => {
      CustomOutput.logColoredMessage('Decompression finished', 'cyan');
    })
    const stream = rs.pipe(brotli).pipe(ws);
    stream.on('error', (err) => {
      console.error(err);
    })
    
    // stream.on('finish', () => {
    //   CustomOutput.logColoredMessage('Decompression finished', 'cyan');
    // });
  }
}

export default Archive;