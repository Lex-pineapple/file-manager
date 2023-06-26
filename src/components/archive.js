import path from "node:path";
import DirMgmt from "./dirMgmt.js";
import fs from 'node:fs';
import zlib from 'zlib';
import CustomOutput from "../utils/CustomOutput.js";
import { pipeline } from 'node:stream';

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
    const detPathToDest = await DirMgmt.determinePath(currDir, pathToDest);
    const fileName = DirMgmt.getFilename(pathToFile);
    const archvFileName = 'compressed_' + fileName + '.br';
    const brotli = zlib.createBrotliCompress();

    const rs = fs.createReadStream(detPathToFile);
    rs.on("error", (err) => {
      CustomOutput.logError('Operation failed');
    })

    const ws = fs.createWriteStream(path.join(detPathToDest, archvFileName));

    pipeline(
      rs,
      brotli,
      ws,
      (err) => {
        if (err) CustomOutput.logError('Operation failed');
        else CustomOutput.logColoredMessage('Compression finished', 'cyan');
      }
    )
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
    const brotli = zlib.createBrotliDecompress();

    const rs = fs.createReadStream(detPathToFile);
    rs.on("error", (err) => {
      CustomOutput.logError('Operation failed');
    })

    const ws = fs.createWriteStream(path.join(detPathToDest, decomprFileName));
    pipeline(
      rs,
      brotli,
      ws,
      (err) => {
        if (err) CustomOutput.logError('Operation failed');
        else CustomOutput.logColoredMessage('Decompression finished', 'cyan');
      }
    )
  }
}

export default Archive;