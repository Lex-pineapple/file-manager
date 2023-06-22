import CustomOutput from "../utils/CustomOutput.js";
import DirMgmt from "./dirMgmt.js";
import fs from 'fs';

class FileMgmt {
  async delegate(op, currPath) {
    switch (op.command) {
      case 'cat':
        await this.readFile(op.args[0], currPath);
        break;
      case 'add':
        break;
      case 'rn':
        break;
      case 'cp':
        break;
      case 'mv':
        break;
      case 'rm':
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


}

export default FileMgmt;