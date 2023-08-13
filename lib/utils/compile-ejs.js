const path = require("path");
const ejs = require("ejs");
const chalk=require('chalk')
function compileEjs(templateName, data) {
  return new Promise((resolve, reject) => {
    //拿到当前模板的路径
    const tempPath = `../template/${templateName}`;
    const absolutePath = path.resolve(__dirname, tempPath);
    ejs.renderFile(absolutePath, data, (err, result) => {
      if (err) {
       console.log(chalk.redBright(err))
       reject(err)
        return;
      }
      resolve(result);
    });
  });
}
module.exports = {
  compileEjs,
};
