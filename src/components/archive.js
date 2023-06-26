import path from "node:path";
import DirMgmt from "./dirMgmt.js";
import fs from 'node:fs';
import fsPromises from 'node:fs/promises';
import zlib from 'zlib';
import CustomOutput from "../utils/CustomOutput.js";
import { pipeline } from 'node:stream';
import stream from 'stream';


class Archive {
  async delegate(op, currDir) {
    switch (op.command) {
      case 'compress':{
        const message = await this.compress(op.args[0], op.args[1], currDir);
        if (message) CustomOutput.logColoredMessage(message, 'cyan');
      }
        break;
      case 'decompress': {
        const message = await this.decompress(op.args[0], op.args[1], currDir);
        if (message) CustomOutput.logColoredMessage(message, 'cyan');
      }
        break;
      default:
        break;
    }
  }

  async getFileSize(pathToFile) {
    const stats = await fsPromises.stat(pathToFile);
    return stats.size;
  }


  printLoader() {
    process.stdout.write('*');
  }

  async compress(pathToFile, pathToDest, currDir) {
    const detPathToFile = await DirMgmt.determinePath(currDir, pathToFile);
    const detPathToDest = await DirMgmt.determinePath(currDir, pathToDest);
    const fileName = DirMgmt.getFilename(pathToFile);
    const archvFileName = 'compressed_' + fileName + '.br';

    return new Promise(async (res, rej) => {
      const brotli = zlib.createBrotliCompress();
  
      const rs = fs.createReadStream(detPathToFile);
      rs.on("error", (err) => {
        console.error(err);
        CustomOutput.logError('Operation failed');
      })
  
      const ws = fs.createWriteStream(path.join(detPathToDest, archvFileName));
      CustomOutput.logColoredMessage('Compression starting... please wait', 'cyan');
      pipeline(
        rs,
        brotli,
        ws,
        (err) => {
          if (err) rej(err)
          else res('Compression finished');
        }
      )
    })
  }

  async decompress(pathToFile, pathToDest, currDir) {
    const detPathToFile = await DirMgmt.determinePath(currDir, pathToFile);
    const detPathToDest = await DirMgmt.determinePath(currDir, pathToDest);
    const archvFileName = DirMgmt.getFilename(pathToFile);
    if (!archvFileName.endsWith('.br')) {
      const err = new Error('The chosen file is not an archive');
      err.code = 'WRONG_EXT';
      throw err;
    }
    let decomprFileName = archvFileName;
    if (decomprFileName.startsWith('compressed_')) decomprFileName = decomprFileName.replace('compressed_', '');
    if (decomprFileName.endsWith('.br')) decomprFileName = decomprFileName.replace(/.br$/g, '');

    return new Promise((res, rej) => {
      const brotli = zlib.createBrotliDecompress();
  
  
      const rs = fs.createReadStream(detPathToFile);
      rs.on("error", (err) => {
        CustomOutput.logError('Operation failed');
      })
  
      CustomOutput.logColoredMessage('Decompression starting...', 'cyan');
      const ws = fs.createWriteStream(path.join(detPathToDest, decomprFileName));
      pipeline(
        rs,
        brotli,
        ws,
        (err) => {
          if (err) rej(err);
          else res('Decompression finished');
        }
      )
    });
  }
}

export default Archive;