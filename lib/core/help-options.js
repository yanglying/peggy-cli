const { program } = require("commander");
const figlet =require('figlet')

//选项Options
function helpOptions() {
  program.name('peggy-cli').usage('<command> [options]')
  
  //动态获取版本
  const version = require("../../package.json").version;
  program.version(version, "-v, --version");
  
  //处理其他选项操作
  // program.option("-t  --type <type>", "file type");
  program.option("-d, --dest <dest>", "target directory  eg: -d src/pages, error example: /src/pages");
  
 program.on('--help',()=>{
  console.log(figlet.textSync('Peggy',{
    font: "Ghost",
    horizontalLayout: "default",
    verticalLayout: "default",
    width: 120,
    whitespaceBreak: true,
  }))
 })

  //commander解析输入
  program.parse(process.argv);

  //获取--时额外传递的参数
  let opts=program.opts()
  
}
module.exports=helpOptions