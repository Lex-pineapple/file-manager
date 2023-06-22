import CustomOutput from "../utils/CustomOutput.js";
import DirMgmt from "./dirMgmt.js";
import fs from 'fs';

class FileMgmt {
  async readFile(pathToFile) {
    try {
      console.log(pathToFile, pathToFile[0]);
      const detPath = DirMgmt.determinePath(pathToFile[0]);
      console.log(detPath);
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