//Node.js 的子进程 (child_process) 模块下有一 spawn 函数，可以用于调用系统上的命令
const { spawn } = require("child_process");
//开启一个子进程
function execCommand(...args) {
  return new Promise((resolve) => {
    //而在 Windows 上， .cmd, .bat 批处理是无法脱离 cmd.exe 这一解释器而单独运行的。因此，我们需要显式地调用 cmd
    // spawn("cmd", ["/c", "pnpm"], {
    //   stdio: "inherit",
    // });
    //调用spawn函数，开启一个子进程
    const childProcess = spawn(...args);

    //子进程输出的东西,放到当前进程中去
    childProcess.stdout.pipe(process.stdout);
    //若当前子进程发生错误，也放到当前子进程中
    childProcess.stderr.pipe(process.stderr);

    //监听子进程执行结束，关闭掉
    childProcess.on("close", () => {
      resolve();
    });
  });
}
module.exports = {
  execCommand,
};
