import { fileURLToPath } from'url';
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

  parseDirectoryList(files) {
    let returnList = [];
    for (let i = 0; i < files.length; i++) {
      const fileType = files[i].isDirectory() ? 'directory' : 'file';
      if (files[i].name.length > 25) {
        returnList = returnList.concat(this.splitLine(files[i].name, fileType));
      } else {
        returnList.push({ name: files[i].name, type: fileType });
      }
    }
    return returnList;
  }

  splitLine(line, type) {
    const fin = Math.floor(line.length/25);
    let retLine = [];
    for (let i = 0; i < line.length; i += 25) {
      if (i < 25) retLine.push({ name: line.slice(i, i+25), type });
      else retLine.push({ name: line.slice(i, i+25) });
    }
    return retLine;
  }

  async list() {
    try {
      const files = await fsPromises.readdir(this.currDir, { withFileTypes: true });
      this.parseDirectoryList(files)
      console.table(this.parseDirectoryList(files));
    } catch (error) {
      CustomOutput.logError(error.message);
    }
  }
}

export default DirMgmt;