import readline from 'node:readline';
import SysInfo from './sysInfo.js'
import CustomOutput from '../utils/CustomOutput.js';
import DirMgmt from './dirMgmt.js';
import commandSheet from '../constants/commandSheet.js';
import CmdValidator from '../utils/CmdValidator.js';

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

    rl.on('line', async (input) => {
      if (input === '.exit') {
        this.close(rl);
      } else {
        const uInput = this.parseInput(input);
        await this.delegate(uInput);
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
    // const inputArr = input.split(' ');
    const inputArr = input.match(/(("|').*?("|')|[^"\s]+)+(?=\s*|\s*$)/g);
    if (!inputArr) return 0;
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

  async delegate(op) {
    try {
      if (CmdValidator.validateInput(op, commandSheet)) {
        if (commandSheet[op.command].op_cat === 'op') {
          this.sysInfo.getInfo(op.args);
        } else await this.dir.delegate(op);
      } else throw new Error('Invalid input');
    } catch (error) {
      CustomOutput.logError(error.message);
    }
  }
}

export default Input;