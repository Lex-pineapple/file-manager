import { createHash } from "crypto";
import CustomOutput from "../utils/CustomOutput.js";
import DirMgmt from "./dirMgmt.js";
import fsPromises from 'fs/promises';

class Hash {
  async calcHash(pathToFile, currDir) {
    const detPathToFile = await DirMgmt.determinePath(currDir, pathToFile);
    try {
      const file = await fsPromises.readFile(detPathToFile);
      const hash = createHash('sha256').update(file).digest('hex');
      CustomOutput.logInfoMessage('Calculated hash', hash);
    } catch (err) {
      CustomOutput.logError('Operation failed');
    }
  }
}

export default Hash;