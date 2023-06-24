import CustomOutput from "./CustomOutput.js";

function CreateHelpMemo(commandSheet) {
  let helpString = '';
  let OptsObj = {};
  let CommObj = {}
  for (const [key, value] of Object.entries(commandSheet)) {
    if (value.args_type === 'static') {
      OptsObj = { ...OptsObj, ...value.details.args };
      CommObj = { ...CommObj, [`${key}  [options]`]: value.details.description };
    } else {
      let args = '';
        for (const key2 in value.details.args) {
          args += `[${key2}] `
        }
      CommObj = { ...CommObj, [`${key}  ${args}`]: value.details.description  }
    }
  }
  let maxLength = 0;
  for (const key in CommObj) {
    if (key.length > maxLength) maxLength = key.length;
  }
  helpString += 'Usage: [command] [options]\n\nOptions\n';
  helpString += createColumns(OptsObj, maxLength);
  helpString += 'Commands:\n';
  helpString += createColumns(CommObj, maxLength);
  return helpString;
}

function createColumns(obj, colLength) {
  let retStr = '';
  for (const [key, value] of Object.entries(obj)) {
    retStr += `    ${key.padEnd(colLength)}${value}\n`
  }
  return retStr;
}

function printHelpMemo(commandSheet) {
  CustomOutput.logColoredMessage(CreateHelpMemo(commandSheet), 'gray');
}

export { CreateHelpMemo, printHelpMemo };