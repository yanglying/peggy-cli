const {
  createVueTmp,
  createPageTemp,
  createCompTemp,
  createRouterTemp,
  createStoreTemp,
} = require("../core/commandActions");
const { program } = require("commander");

module.exports = function initCommands() {
  // 声明命令create命令
  program
    .command("create <projectName> [...options]")
    .description("create a new vue project")
    .action(async function (projectName) {
      createVueTmp(projectName);
    });

  program
    .command("addComp <compNames> [...options]")
    .description(
      "create a new vue component  eg:Input:peggy-cli addComp cmp1  Output:src/component/cmp1.vue"
    )
    .action(function (compNames) {
      createCompTemp(compNames);
    });
    
  program
    .command("addPages <pageInit> [...options]")
    .description(
      "create a new view Page  eg:Input:peggy-cli addPages page1   Output:src/views/page1/index.vue \n  \t\t\t\t\t\t\t\t\t\t\t\t Output:src/router/page1/page1.js"
    )
    .action(function (pageInit) {
      createPageTemp(pageInit);
    });

  program
    .command("addRoute <routeName> [...options]")
    .description(
      "create a new vue Route  eg:Input peggy-cli addRoute route1.js  Output:src/router/route1/route1.js"
    )
    .action(function (routeName) {
      createRouterTemp(routeName);
    });

  program
    .command("addStore <storeName> [...options]")
    .description(
      "create a new vue Store  eg:Input peggy-cli addStore store1.ts  Output:src/store/module/store1.ts"
    )
    .action(function (storeName) {
      createStoreTemp(storeName);
    });
};
