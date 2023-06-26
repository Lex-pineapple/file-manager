import ParseVariables from '../utils/parseVariables.js';
import CustomOutput from '../utils/CustomOutput.js';

class User {
  constructor() {
    this.username = ParseVariables(process.argv, 'username');
  }
  
  printUsername() {
    if (!this.username) {
      CustomOutput.logWarning('No username was provided');
      process.stdout.write('Welcome to the File Manager.\n');
    } else process.stdout.write(`Welcome to the File Manager, ${CustomOutput.coloredLine(this.username, 'green')}\n`);
  }
}

export default User;