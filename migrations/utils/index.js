const path = require('path');
const fs = require('fs');

function getFilesInDir(dir) {
  const subdirs = fs.readdirSync(dir);
  const files = subdirs.map((subdir) => {
    const res = path.resolve(dir, subdir);
    return fs.statSync(res).isDirectory() ? getFilesInDir(res) : res;
  });
  return files.reduce((a, f) => a.concat(f), []);
}

function getModulesConfig(modulePath) {
  const componentsPath = path.resolve(`./src/components/${modulePath}`);
  const modules = getFilesInDir(componentsPath)
    .map(filePath => {
      const fileName = filePath.split(path.sep).pop();
      if (fileName !== 'module.json') {
        return null;
      }
      const moduleJson = fs.readFileSync(filePath).toString();
      return JSON.parse(moduleJson);
    })
    .filter(Boolean)
  return modules;
}

module.exports = {
  getFilesInDir,
  getModulesConfig,
}
