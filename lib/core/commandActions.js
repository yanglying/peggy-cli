const path = require("path");
// const open = require('open');
const Fs = require("fs");
const fs = require("fs-extra");
const shell = require("shelljs");
const ora = require("ora");
const inquirer = require("inquirer");
const { execCommand } = require("../utils/exect-command");
const { program } = require("commander");
const { compileEjs } = require("../utils/compile-ejs");
const { mkdirSync, writeFile } = require("../utils/files");
const chalk = require("chalk");

const projectList = {
  "vue3&ts": "https://github.com/yanglying/Template-for-vue3Ts.git",
  vue3: "https://github.com/yanglying/Template-for-vue3.git",
  // "react&ts": "https://github.com/yanglying/Template-for-vue3Ts.git",
  // "vue3&ts": "https://github.com/yanglying/Template-for-vue3Ts.git",
};

let isTS;
async function createVueTmp(project) {
  try {
    //拿到命令的执行路径
    const targetPath = path.join(process.cwd(), project);

    //判断是否出现重名项目
    if (fs.existsSync(targetPath)) {
      const res = await inquirer.prompt([
        {
          type: "confirm",
          name: "overwrite",
          message: "😄🐷  您创建的项目名称重复，是否要需要覆盖之前文件夹？",
          default: true,
        },
      ]);

      if (res.overwrite === true) {
        fs.remove(targetPath, (err) => {
          if (err)
            return console.log(chalk.redBright("😄😄  删除失败 \n", err));
        });
      } else {
        return;
      }
    }
    //新建一个模板项目
    const answer = await inquirer.prompt([
      {
        type: "list",
        message: chalk.blackBright("🐷  请选择开发框架(vue3/react-基于vite)?"),
        name: "type",
        choices: [
          {
            name: "vue3",
            value: "vue3",
          },
          {
            name: "react",
            value: "react",
          },
        ],
      },
      {
        type: "list",
        message: chalk.blackBright("🐷  是否使用TypeScript?"),
        name: "ts",
        choices: [
          {
            name: "是",
            value: true,
          },
          {
            name: "否",
            value: false,
          },
        ],
      },
      {
        type: "list",
        message: chalk.blackBright("🐷  是否需要添加 Pinia 和 Router?"),
        name: "isAddPiniaStore",
        choices: [
          {
            name: "是",
            value: true,
          },
          {
            name: "否",
            value: false,
          },
        ],
      },
      {
        type: "list",
        message: chalk.blackBright("🐷  是否需要帮助安装依赖并启动项目？"),
        name: "isReady",
        choices: [
          {
            name: "是",
            value: true,
          },
          {
            name: "否",
            value: false,
          },
        ],
      },
    ]);
    const key = answer.type + (answer.ts ? "&ts" : "");
    const branch = answer.isAddPiniaStore ? "routerStore" : "main";

    Object.keys(projectList).forEach(async (item, index, arr) => {
      if (item == key) {
        let remotePath = `git clone -b ${branch}  ${projectList[item]}  ${project}`;
        const loading = ora("🐖🐖🐖...正在下载中....🐖🐖🐖  ").start();
        const { code } = shell.exec(remotePath);
        if (code === 0) {
          console.log(chalk.greenBright.bold("🎉🎉  项目模板拉取成功！"));
          loading.succeed(chalk.greenBright.bold("🐷  download successifily!"));
          try {
            //删除拉下来时的.git文件，不与本地的冲突
            await fs.remove(targetPath + ".git");
            if (answer.isReady) {
              const commandName =
                process.platform === "win32" ? "pnpm.cmd" : "pnpm";
              // shell.cd(project);//进入项目根目录
              //脚手架帮助执行 npm install,执行目录是在当前项目下
              await execCommand(commandName, ["install"], {
                cwd: `./${project}`,
              });
              await execCommand(commandName, ["run", "dev"], {
                cwd: `./${project}`,
              });
            }
          } catch (error) {
            console.log(chalk.red("🐷 delete .git error" + error));
          }
        } else {
          loading.fail(chalk.red("🐷  download failed! "));
        }
      }
    });
  } catch (error) {
    console.log(chalk.red("🐷  Error" + error));
  }
}

async function createCompTemp(componentName) {
  const result = await compileEjs("component.vue3.ejs", {
    name: componentName,
  });

  //获取到输入命令时--dest 后面跟的参数
  const dest = program.opts().dest ? program.opts().dest : "src/components";
  //若文件夹不存在，则创建文件夹
  mkdirSync(dest);
  writeFile(`${dest}/${componentName}.vue`, result)
    .then((res) => {
      console.log(chalk.greenBright.bold("🎉🎉 创建组件成功..."));
      console.log(
        chalk.greenBright.bold(`组件所在路径：${dest}/${componentName}.vue`)
      );
    })
    .catch((err) => {
      console.log(chalk.bgRedBright(err));
    });
}

async function createPageTemp(componentName) {
  //拿到模板
  const result = await compileEjs("component.vue3.ejs", {
    name: componentName,
  });

  //获取到输入命令时--dest 后面跟的参数
  const dest = program.opts().dest ? program.opts().dest : "src/views";
  //若文件夹不存在，则创建文件夹
  mkdirSync(`${dest}/${componentName}`);
  writeFile(`${dest}/${componentName}/index.vue`, result)
    .then((res) => {
      console.log(chalk.greenBright.bold("🎉🎉 页面创建成功..."));
      console.log(
        chalk.greenBright.bold(
          `页面所在路径：${dest}/${componentName}/index.vue`
        )
      );
    })
    .catch((err) => {
      console.log(chalk.bgRedBright.bold(err));
    });
  //若默认目录的话，才会去动态创建对应的路由目录文件
  let cpn = componentName + ".js";
  if (dest === "src/views") createRouterTemp(cpn);
}

async function createRouterTemp(routeName) {
  let routename = routeName.split(".");
  const dest = program.opts().dest ? program.opts().dest : "src/router";
  const cpnPath =
    dest.replace("router", "views").replace("src", "@") +
    `/${routename[0]}/index.vue`;
  const routePath =
    dest.replace("/router", "").replace("src", "") + "/" + routename[0];
  const result = await compileEjs("vue_router.js.ejs", {
    name: routename[0],
    routePath,
    cpnPath,
  });
  mkdirSync(`${dest}/${routename[0]}`);
  writeFile(`${dest}/${routename[0]}/${routeName}`, result)
    .then((res) => {
      console.log(chalk.greenBright.bold("🎉🎉 单路由文件创建成功..."));
      console.log(
        chalk.greenBright.bold(
          `路由所在路径：${dest}/${routename[0]}/${routeName}`
        )
      );
    })
    .catch((err) => {
      console.log(chalk.bgRedBright(err));
    });
}

async function createStoreTemp(storeName) {
  let storename = storeName.split(".");
  //还需要加是否为TS的判断
  const result = await compileEjs("vue_store.js.ejs", {
    storeName: storename[0],
  });
  const dest = program.opts().dest ? program.opts().dest : "src/store/module";
  mkdirSync(dest);
  writeFile(`${dest}/${storeName}`, result)
    .then((res) => {
      console.log(chalk.greenBright.bold("🎉🎉 单共享store文件创建成功..."));
      console.log(
        chalk.greenBright.bold(`store所在路径: ${dest}/${storeName}`)
      );
    })
    .catch((err) => {
      console.log(chalk.bgRedBright(err));
    });
}
async function routeInit() {
  //获取到src/router目录下所有的页面目录，
  let path = process.cwd() + "/src/router";
  let allRoutes = getFilesAndFoldersInDir(path);
  let res = [];
  allRoutes.forEach((route) => {
    let item = `"import  ${route}  from '@/router/${route}'"`;
    res.push(item);
  });
  const result = await compileEjs("vue_router_main.js.ejs", { routes: res });
}

function getFilesAndFoldersInDir(path) {
  const items = fs.readdirSync(path);
  const result = [];
  items.forEach((item) => {
    const itemPath = `${path}/${item}`;
    const stat = fs.statSync(itemPath);
    if (stat.isDirectory()) {
      result.push(item);
    }
  });
  return result;
}

module.exports = {
  createVueTmp,
  createPageTemp,
  createRouterTemp,
  createStoreTemp,
  createCompTemp,
  routeInit,
};
