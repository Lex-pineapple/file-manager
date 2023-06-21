import readline from 'node:readline';
import SysInfo from './sysInfo.js'
import CustomOutput from '../utils/CustomOutput.js';
import DirMgmt from './dirMgmt.js';

class Input {
  constructor() {
    this.sysInfo = new SysInfo();
    this._username = null;
    this.dir = new DirMgmt();
  }

  /**
   * @param {string} name
   */
  set username(name) {
    this._username = name;
  }

  start() {
    // dir.currDir = DirMgmt.initDir();
    CustomOutput.logPath(this.dir.currDir);
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    })

    rl.on('line', (input) => {
      if (input === '.exit') {
        this.close(rl);
      } else {
        const uInput = this.parseInput(input);
        this.delegate(uInput);
        CustomOutput.logPath(this.dir.currDir);
      }
    });

    rl.on('SIGINT', () => {
      this.close(rl);
    })
  }

  close(rl) {
    if (this._username) {
      process.stdout.write(`Thank you for using File Manager, ${CustomOutput.coloredLine(this._username, 'green')}, goodbye!`);
    } else {
      process.stdout.write('Thank you for using File Manager, goodbye!');
    }
    rl.close();
  }

  parseInput(input) {
    const inputArr = input.split(' ');
    if (inputArr.length > 1) {
      return {
        command: inputArr[0],
        args: inputArr.slice(1)
      }
    }
    return {
      command: inputArr[0],
    }
  }

  delegate(op) {
    switch (op.command) {
      case 'os':
        this.sysInfo.getInfo(op.args);
        break;
      case 'ls':
        !op.args && this.dir.list();
      default:
        CustomOutput.logError('Invalid input');
        break;
    }
  }
}

export default Input;