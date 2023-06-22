import { fileURLToPath } from 'url';
import path from 'node:path';
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
      this.currDir = currDirArr.join(path.sep);
    }
  }

  browseDir(path) {

  }

  parseDirectoryList(files) {
    let returnList = [];
    for (const item of files) {
      const fileType = item.isDirectory() ? 'directory' : 'file';
      console.log(fileType);
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
      this.parseDirectoryList(files)
      console.table(this.parseDirectoryList(files));
    } catch (error) {
      CustomOutput.logError(error);
    }
  }
}

export default DirMgmt;