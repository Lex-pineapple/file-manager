import { fileURLToPath } from 'url';
import path from 'node:path';
import { constants } from 'buffer';
import fsPromises from 'fs/promises';
import os from 'os';
import CustomOutput from '../utils/CustomOutput.js';
import FileMgmt from './fileMgmt.js';
import commandSheet from '../constants/commandSheet.js';
import Hash from './hash.js';
import Archive from './archive.js';

class DirMgmt {
  constructor() {
    this._currDir = os.homedir();
    this.fileMgmt = new FileMgmt();
    this.hash = new Hash();
    this.archv = new Archive();
  }

  set currDir(path) {
    this._currDir = path.replace("/", "\\");
  }

  get currDir() {
    return this._currDir;
  }

  async delegate(op) {
    switch (commandSheet[op.command].op_cat) {
      case 'nav':
        await this.delegateNav(op);
        break;
      case 'fileOs':
        await this.fileMgmt.delegate(op, this.currDir);
        break;
      case 'hash':
        await this.hash.calcHash(op.args[0], this.currDir);
        break;
      case 'archv':
        await this.archv.delegate(op, this.currDir);
        break;
      default:
        break;
    }
  }

  async delegateNav(op) {
    switch (op.command) {
      case 'ls': 
        await this.list();
        break;
      case 'up':
        this.upDir();
        break;
      case 'cd':
        await this.browseDir(op.args[0]);
        break;
      default:
        break;
    }
  }

  static filename() {
    return fileURLToPath(import.meta.url);
  }

  upDir() {
    const currDirArr = this._currDir.split(path.sep);
    if (currDirArr.length > 1) {
      currDirArr.pop();
      this.currDir = DirMgmt.fixBackSlash(currDirArr);
    }
  }

  static fixBackSlash(currDirArr) {
    if (currDirArr[currDirArr.length - 1].charAt(currDirArr[currDirArr.length - 1].length - 1) === ':') return currDirArr[currDirArr.length - 1] + '\\';
    else return currDirArr.join(path.sep);
  }

  async browseDir(location) {
    try {
      const detDir = await DirMgmt.determinePath(this.currDir, location);
      const isDir = await this.isDir(detDir);
      if (isDir) this.currDir = detDir;
      else CustomOutput.logError('This is not an accessible directory');
    } catch (error) {
        if (error.code === 'WRONG_PATH' || error.code === 'EBUSY' || error.code === 'WRONG_EXT' ||  error.code === 'WRONG_NAME' || error.code === 'INV_INP') CustomOutput.logError(error.message);
        else CustomOutput.logError('Operation failed');
    }
  }

  static fixNewPath(currDir, location) {
    location = this.fixQuotes(location);
    return path.join(currDir, location);
  }

  static replaceBackslash(path) {
    return path.replace("/", "\\");
  }

  static fixRenamePath(detPath, newName) {
    detPath = this.fixQuotes(detPath);
    detPath = this.replaceBackslash(detPath);
    const newLocation = detPath.split('\\').length > 1 ? detPath.split('\\') : detPath.split(path.sep).length > 1 ? detPath.split(path.sep) : false;
    if (newLocation) {
      newLocation.pop();
      const joinedNewLocation = DirMgmt.fixBackSlash(newLocation);
      return path.join(joinedNewLocation, newName);
    }
    return newName;
  }

  static getFilename(location) {
    location = this.fixQuotes(location);
    const newLocation = location.split('/').length > 1 ? location.split('/') : location.split(path.sep).length > 1 ? location.split(path.sep) : false;
    if (newLocation) {
      const fileName = newLocation.pop(); 
      return fileName ? fileName : false;
    }
    return location;
  }

  static async determinePath(currDir, location) {
    if (currDir !== undefined && location !== undefined) {
      location = this.fixQuotes(location);
      location = this.replaceBackslash(location);
      if (location.split('\\').length > 1 || location.split(path.sep).length > 1) {
        const fullPathExists = await DirMgmt.validatePath(location);
        const pathExists = await DirMgmt.validatePath(path.join(currDir, location));
        if (pathExists) return path.join(currDir, location);
        else if (fullPathExists) return location;
        else {
          const err = new Error('The path is incorrect');
          err.code = 'WRONG_PATH';
          throw err;
        }
      } else {
        const newPath = path.join(currDir, location);
        const pathExists = await DirMgmt.validatePath(newPath);
        if (pathExists) return newPath;
        else {
          const err = new Error('The path is incorrect');
          err.code = 'WRONG_PATH';
          throw err;
        }
      }
    } else {
      const err = new Error('The path is incorrect');
      err.code = 'WRONG_PATH';
      throw err;
    }
  }

  static fixQuotes(location) {
    return location.replace(/['"]+/g, '');
  }

  static async validatePath(path) {
    return fsPromises.access(path, constants.F_OK).then(() => true).catch((err) => {
      if (err.code === 'EBUSY') throw err;
      else return false;
    });
  }

  parseDirectoryList(files) {
    let returnList = [];
    for (const item of files) {
      const fileType = this.determineFileType(item);
      if (fileType) returnList.push({ name: item.name , type: fileType })
    }
    returnList = this.sortList(returnList);
    returnList = this.splitLines(returnList);
    return returnList;
  }

  determineFileType(item) {
    if (item.isDirectory()) return 'directory';
    if (item.isFile()) return 'file';
    if (item.isSymbolicLink()) return false;
  }

  sortList(list) {
    const typeSorted = list.sort((a, b) => a.type > b.type ? 1 : -1 );
    const dirSort = list.sort((a, b) => {
      if (a.type == b.type) {
        return a.name.localeCompare(b.name);
      }
    })
    return dirSort;
  }

  splitLines(list) {
    let returnList = [];
    for (const item of list) {
      if (item.name.length > 25) {
        returnList = returnList.concat(this.splitLine(item));
      } else {
        returnList.push(item);
      }
    }
    return returnList;
  }

  splitLine(item) {
    let retLine = [];
    for (let i = 0; i < item.name.length; i += 25) {
      if (i < 25) retLine.push({ name: item.name.slice(i, i+25), type: item.type });
      else retLine.push({ name: item.name.slice(i, i+25) });
    }
    return retLine;
  }

  async isDir(path) {
    try {
      const stat = await fsPromises.lstat(path);
      if (stat.isDirectory()) return true;
      else return false;
    } catch (error) {
        if (error.code === 'WRONG_PATH' || error.code === 'EBUSY' || error.code === 'WRONG_EXT' ||  error.code === 'WRONG_NAME' || error.code === 'INV_INP') CustomOutput.logError(error.message);
        else CustomOutput.logError('Operation failed');
    }
  }

  async list() {
    try {
      const files = await fsPromises.readdir(this.currDir, { withFileTypes: true });
      const parsedDir = this.parseDirectoryList(files);
      if (parsedDir.length > 0) {
        console.table(parsedDir);
      } else process.stdout.write('The folder is empty\n');
    } catch (error) {
        if (error.code === 'WRONG_PATH' || error.code === 'EBUSY' || error.code === 'WRONG_EXT' ||  error.code === 'WRONG_NAME' || error.code === 'INV_INP') CustomOutput.logError(error.message);
        else CustomOutput.logError('Operation failed');
    }
  }
}

export default DirMgmt;