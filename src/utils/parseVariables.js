function ParseVariables(varArr, varName) {
  let finalName;
  varArr.forEach((arg) => {
    if (arg.startsWith(`--${varName}=`)) finalName = arg.split(`--${varName}=`)[1];
  })
  return finalName;
}

export default ParseVariables;