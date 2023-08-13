const fs = require('fs');
const chalk=require('chalk')
const path = require('path');
const { promise } = require('ora');

const writeFile = (path, content) => {
  if (fs.existsSync(path)) {
    return new Promise((resolve, reject) => {
      reject(" 🐷 ERROR: the file already exists~")
    })
  }
  return fs.promises.writeFile(path, content);
}

const mkdirSync = (dirname) => {
  if (fs.existsSync(dirname)) {
    return true
  } else {
    // 不存在,判断父亲文件夹是否存在？
    if (mkdirSync(path.dirname(dirname))) {
      // 存在父亲文件，就直接新建该文件
      fs.mkdirSync(dirname)
      return true
    }
  }
}

module.exports = {
  writeFile,
  mkdirSync
}