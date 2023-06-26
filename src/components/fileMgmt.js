import CustomOutput from "../utils/CustomOutput.js";
import DirMgmt from "./dirMgmt.js";
import fs from 'fs';
import fsPromises from 'fs/promises';
import path from 'path';
import { pipeline } from 'node:stream';


class FileMgmt {
  async delegate(op, currPath) {
    switch (op.command) {
      case 'cat':
        await this.readFile(op.args[0], currPath);
        break;
      case 'add':
        await this.createFile(op.args[0], currPath);
        break;
      case 'rn':
        await this.renameFile(op.args[0], currPath, op.args[1]);
        break;
      case 'cp': {
        const msg = await this.moveFile(op.args[0], op.args[1], currPath, true);
        if (msg) CustomOutput.logColoredMessage(msg, 'cyan');
      }
        break;
      case 'mv': {
        const msg = await this.moveFile(op.args[0], op.args[1], currPath, false);
        if (msg) CustomOutput.logColoredMessage(msg, 'cyan');
      }
        break;
      case 'rm':
        await this.deleteFile(op.args[0], currPath);
        break;
      default:
        break;
    }
  }

  async readFile(pathToFile, currDir) {
    return new Promise(async (res, rej) => {
      try {
        const detPath = await DirMgmt.determinePath(currDir, pathToFile);
        const rs = fs.createReadStream(detPath, 'utf-8');
        let data = '';
        rs.on('data', chunk => data += chunk);
        rs.on('error', (err) => {
          CustomOutput.logError('Operation failed');
        });
        rs.on('end', () => {
          process.stdout.write(data);
          process.stdout.write('\n');
          res();
        });
      } catch (error) {
          rej(error);
      }
    });
  }

  checkFilename(filename) {
    if (filename.includes('/') || filename.includes('\\')) return false;
    return true;
  }

  async createFile(pathToFile, currDir) {
    if (this.checkFilename(pathToFile)) {
      const toCreatePath = DirMgmt.fixNewPath(currDir, pathToFile);
      let fd;
      try {
        fd = await fsPromises.open(toCreatePath, 'wx');
        CustomOutput.logColoredMessage(`File '${toCreatePath}' has been created`, 'cyan');
      } catch (error) {
        if (error.code === 'WRONG_PATH' || error.code === 'EBUSY' || error.code === 'WRONG_EXT' ||  error.code === 'WRONG_NAME' || error.code === 'INV_INP') CustomOutput.logError(error.message);
        else if (error.code === 'EEXIST') CustomOutput.logError('File already exists');
        else CustomOutput.logError('Operation failed');
      } finally {
        if (fd !== undefined) await fd.close();
      }
    } else CustomOutput.logError("The filename cannot contain '\\' or '/'");
  }

  async renameFile(pathToFile, currDir, newName) {
    const detFilePath = await DirMgmt.determinePath(currDir, pathToFile);
    const newNamePath = DirMgmt.fixRenamePath(detFilePath, newName);
    try {
      if (!newName || newName.split('/').length > 1 || newName.split(path.sep).length > 1) {
        const err = new Error('The new name is incorrect');
        err.code = 'WRONG_NAME';
        throw err;
      } 
      await fsPromises.rename(detFilePath, newNamePath);
      CustomOutput.logColoredMessage(`File has been successfuly renamed`, 'cyan');
    } catch (error) {
        if (error.code === 'WRONG_PATH' || error.code === 'EBUSY' || error.code === 'WRONG_EXT' ||  error.code === 'WRONG_NAME' || error.code === 'INV_INP') CustomOutput.logError(error.message);
        else CustomOutput.logError('Operation failed');
    }
  }

  async moveFile(pathToFile, newPath, currDir, cp) {
    const detPathToFile = await DirMgmt.determinePath(currDir, pathToFile);
    const detNewPath = await DirMgmt.determinePath(currDir, newPath);
    let fileName = DirMgmt.getFilename(pathToFile);
    const newPathExists = await DirMgmt.validatePath(path.join(detNewPath, fileName));
  
    if (cp) fileName = 'copy_' + fileName;

    return new Promise(async (res, rej) => {
      const rs = fs.createReadStream(detPathToFile);
  
      const ws = fs.createWriteStream(path.join(detNewPath, fileName));
      CustomOutput.logColoredMessage(`Started ${cp ? 'copying' : 'moving'}...`, 'cyan');
      pipeline(
        rs,
        ws,
        (err) => {
          if (err) rej(err);
          else res(`File ${cp ? 'copied' : 'moved'} successfully`);
        }
      )
    
      if (!cp && !newPathExists) await this.deleteFile(detPathToFile, currDir);
    })

  }

  async deleteFile(pathToFile, currDir) {
    const detFilePath = await DirMgmt.determinePath(currDir, pathToFile);
    try {
      await fsPromises.unlink(detFilePath);
      CustomOutput.logColoredMessage(`File has been successfuly removed`, 'cyan');
    } catch (error) {
        if (error.code === 'WRONG_PATH' || error.code === 'EBUSY' || error.code === 'WRONG_EXT' ||  error.code === 'WRONG_NAME' || error.code === 'INV_INP') CustomOutput.logError(error.message);
        else CustomOutput.logError('Operation failed');
    }
  }

}

export default FileMgmt;