import os from 'node:os';
import CustomOutput from '../utils/CustomOutput.js';

class SysInfo {
  constructor() {
    this.args = {
      '--EOL': Boolean,
      '--cpus': Boolean,
      '--homedir': Boolean,
      '--username': Boolean,
      '--architecture': Boolean
    }
  }

  validate(args) {
    if (!args) return false; 
    for (let i = 0; i < args.length; i++) {
      if (!(args[i] in this.args)) return false;
    }
    return true;
  }

  getInfo(args) {
    if (this.validate(args)) {
      for (let i = 0; i < args.length; i++) {
        this.printInfo(args[i]);
      }
    } else {
      CustomOutput.logError('Invalid input');
    }
  }

  printInfo(arg) {
    switch (arg) {
      case '--EOL':
        CustomOutput.logInfoMessage('Default system \'End-Of-Line\'', JSON.stringify(os.EOL));
        break;
      case '--cpus':
        CustomOutput.logInfoMessage('Host machine CPUS info', this.parseCPUinfo(os.cpus()));
        break;
      case '--homedir':
        CustomOutput.logInfoMessage('Home directory', os.homedir());
        break;
      case '--username':
        CustomOutput.logInfoMessage('Current system user name', os.userInfo().username);
        break;
      case '--architecture':
        CustomOutput.logInfoMessage('CPU architecture', os.arch());
      default:
        break;
    }
  }

  parseCPUinfo(cpuInfo) {
    const finalInfo = { cores: []};
    finalInfo.count = cpuInfo.length;
    for (const core of cpuInfo) {
      finalInfo.cores.push({ model: core.model, speed: core.speed/1000 });
    }
    return this.stringifyCPUinfp(finalInfo);
  }

  stringifyCPUinfp(cpuInfo) {
    let retStr = `Cores: ${cpuInfo.count}\n`;
    for (const core of cpuInfo.cores) {
      retStr += `  Model: ${core.model}\n  Speed: ${core.speed} GHz\n`
    }
    return retStr;
  }
}

export default SysInfo;