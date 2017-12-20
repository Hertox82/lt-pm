let path = require('path');

let obj = {
    cwd: path.resolve(__dirname,"./plugins"),
    repo: path.resolve(__dirname,"./compressed"),
    depl: path.resolve(__dirname,"./toDeploy")
}

console.log(JSON.stringify(obj));
