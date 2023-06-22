import { fileURLToPath } from 'url';
import path from 'node:path';
import { constants } from 'buffer';
import fsPromises from 'fs/promises';
import os from 'os';
import CustomOutput from '../utils/CustomOutput.js';

class DirMgmt {
  constructor() {
    this._currDir = os.homedir();
  }

  set currDir(path) {
    this._currDir = path;
  }

  get currDir() {
    return this._currDir;
  }

  static filename() {
    return fileURLToPath(import.meta.url);
  }

  upDir() {
    const currDirArr = this._currDir.split(path.sep);
    if (currDirArr.length > 1) {
      currDirArr.pop();
      if (currDirArr[currDirArr.length - 1].charAt(currDirArr[currDirArr.length - 1].length - 1) === ':') this.currDir = currDirArr[currDirArr.length - 1] + '\\';
      else this.currDir = currDirArr.join(path.sep);
    }
  }

  async browseDir(location) {
    try {
      if (!location || location.length > 1) throw new Error('The path is incorrect');
      if (location[0].split('/').length > 1 || location[0].split(path.sep).length > 1) {
        const fullPathExists = await this.validatePath(location[0]);
        const pathExists = await this.validatePath(path.join(this.currDir, location[0]));
        if (pathExists) this.currDir = path.join(this.currDir, location[0]);
        else if (fullPathExists) this.currDir = location[0];
        else throw new Error('The path is incorrect');
      } else {
        const newPath = path.join(this.currDir, location[0]);
        const pathExists = await this.validatePath(newPath);
        if (pathExists) this.currDir = newPath;
        else throw new Error('The path is incorrect');
      }
    } catch (error) {
      CustomOutput.logError(error.message)
    }
  }

  async validatePath(path) {
    return fsPromises.access(path, constants.R_OK).then(() => true).catch(() => false);
  }

  parseDirectoryList(files) {
    let returnList = [];
    for (const item of files) {
      const fileType = item.isDirectory() ? 'directory' : 'file';
      returnList.push({ name: item.name , type: fileType })
    }
    returnList = this.sortList(returnList);
    returnList = this.splitLines(returnList);
    return returnList;
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

  async list() {
    try {
      const files = await fsPromises.readdir(this.currDir, { withFileTypes: true });
      console.log('current directory to read', this.currDir);
      console.log('files', files);
      this.parseDirectoryList(files)
      console.table(this.parseDirectoryList(files));
    } catch (error) {
      CustomOutput.logError(error);
    }
  }
}

export default DirMgmt;