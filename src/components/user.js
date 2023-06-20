import ParseVariables from '../utils/parseVariables.js';

class User {
  constructor() {
    this.username = ParseVariables(process.argv, 'username');
  }
  
  printUsername() {
    if (!this.username) process.stdout.write('(file-manager-v1.0.0) Warning: No username was provided.\nWelcome to the File Manager.')
    else process.stdout.write(`Welcome to the File Manager, ${this.username}`);
  }
}

export default User;