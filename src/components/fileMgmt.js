import CustomOutput from "../utils/CustomOutput.js";
import DirMgmt from "./dirMgmt.js";
import fs from 'fs';
import fsPromises from 'fs/promises';
import path from 'path';

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
      case 'cp':
        await this.moveFile(op.args[0], op.args[1], currPath, true);
        // await this.copyFile(op.args[0], op.args[1], currPath);
        break;
      case 'mv':
        await this.moveFile(op.args[0], op.args[1], currPath, false);
        break;
      case 'rm':
        await this.deleteFile(op.args[0], currPath);
        break;
      default:
        break;
    }
  }

  async readFile(pathToFile, currDir) {
    try {
      const detPath = await DirMgmt.determinePath(currDir, pathToFile);
      const rs = fs.createReadStream(detPath, 'utf-8');
      let data = '';
      rs.on('data', chunk => data += chunk);
      rs.on('end', () => process.stdout.write(data));
      // rs.on('error', error =())
    } catch (error) {
      CustomOutput.logError(error.message);
    }
  }

  async createFile(pathToFile, currDir) {
    const toCreatePath = await DirMgmt.fixNewPath(currDir, pathToFile);
    let fd;
    try {
      fd = await fsPromises.open(toCreatePath, 'wx');
    } catch (error) {
      if (error.code === 'EEXIST') CustomOutput.logError('File already exists');
      else CustomOutput.logError(err.message);
    } finally {
      if (fd !== undefined) await fd.close();
    }
  }

  async renameFile(pathToFile, currDir, newName) {
    const detFilePath = await DirMgmt.determinePath(currDir, pathToFile);
    const newNamePath = DirMgmt.fixRenamePath(detFilePath, newName);
    try {
      if (!newName || newName.split('/').length > 1 || newName.split(path.sep).length > 1) throw new Error('The new name is incorrect');
      await fsPromises.rename(detFilePath, newNamePath);
    } catch (error) {
      CustomOutput.logError(error.message);
    }
  }

  async moveFile(pathToFile, newPath, currDir, cp) {
    const detPathToFile = await DirMgmt.determinePath(currDir, pathToFile);
    // console.log('detPathToFile', detPathToFile);
    const detNewPath = await DirMgmt.determinePath(currDir, newPath);
    // console.log('detNewPath', detNewPath);
    const fileName = DirMgmt.getFilename(pathToFile);
    // console.log('fileName', fileName);
    const newPathExists = await DirMgmt.validatePath(path.join(detNewPath, fileName));

    const rs = fs.createReadStream(detPathToFile);
    rs.on("error", (err) => {
      console.error(err);
    });

    const ws = fs.createWriteStream(path.join(detNewPath, fileName));
    ws.on("error", (err) => {
      console.error(err);
    });
    ws.on("close", () => {
    });
    rs.pipe(ws);
  
    if (!cp) await this.deleteFile(detPathToFile, currDir);
  }

  async deleteFile(pathToFile, currDir) {
    const detFilePath = await DirMgmt.determinePath(currDir, pathToFile);
    try {
      await fsPromises.unlink(detFilePath);
    } catch (error) {
      CustomOutput.logError(error.message);
    }
  }

}

export default FileMgmt;