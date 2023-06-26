class CustomOutput {
  static coloredMessage(message, contents, color) {
    return ` ${this.coloredLine(message + ':', color)} ${contents}\n`
  }

  static coloredLine(message, color) {
    switch (color) {
      case 'red': 
        return(`\x1b[31m${message}\x1b[0m`);
      case 'green': 
        return(`\x1b[32m${message}\x1b[0m`);
      case 'yellow': 
        return(`\x1b[33m${message}\x1b[0m`);
      case 'blue': 
        return(`\x1b[34m${message}\x1b[0m`);
      case 'magenta': 
        return(`\x1b[35m${message}\x1b[0m`);
      case 'cyan':
        return(`\x1b[36m${message}\x1b[0m`);
      case 'gray':
        return(`\x1b[90m${message}\x1b[0m`);
      default:
        return message;
    }
  }

  static logInfoMessage(message, contents) {
    process.stdout.write(this.coloredMessage(message, contents, 'yellow'));
  }

  static logColoredMessage(message, color) {
    process.stdout.write(this.coloredLine(message, color) + '\n');
  }

  static logWarning(message) {
    process.stdout.write(this.coloredLine(this._createWarning(message), 'gray') + '\n');
  }

  static logError(message) {
    process.stdout.write(this.coloredLine(message, 'red') + '\n');
  }

  static logPath(message) {
    process.stdout.write(`  You are currently in ${this.coloredLine(message, 'cyan')}\n`);
  }

  static _createWarning(message) {
    return `(${process.env.npm_package_name} ${process.env.npm_package_version}) Warning: ${message}`;
  }
}

export default CustomOutput;