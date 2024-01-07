#! /usr/bin/env node
//告诉操作系统用node进行执行
const { program } = require("commander");
const helpOptions = require("./core/help-options");
const initCommands=require("./core/createActions")


//配置所有的options
helpOptions();
initCommands()


//让commander解析process.argv参数,用于解析命令行输入,一定要写才能使这些命令生效
program.parse(process.argv);
