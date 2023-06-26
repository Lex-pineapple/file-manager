class CmdValidator {
  static validateArgs(args, cmdSheedOp) {
    if (!args && cmdSheedOp.args_num === 0) {
      return true;
    }
    if (args && args.length == cmdSheedOp.args_num) {
      return true;
    }
    return false;
  }

  static deepValidateArgs(args, cmdSheedOp) {
    let valid = true;
    if ((!args && cmdSheedOp.args_num === 0) || (args && args.length <= cmdSheedOp.args_num)) {
      for (let i = 0; i < args.length; i++) {
        if (!cmdSheedOp.args.includes(args[i])) {
          valid = false;
          break;
        }
      }
    } else valid = false;
    return valid;
  }

  static validateInput(op, cmdSheet) {
    if (!(op.command in cmdSheet)) return false;
    if (cmdSheet[op.command].args_type == 'static') return this.deepValidateArgs(op.args, cmdSheet[op.command]);
    else return this.validateArgs(op.args, cmdSheet[op.command]);
  }
}

export default CmdValidator;