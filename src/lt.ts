#!/usr/bin/env node
'use strict';

import * as program from 'commander';
import { exec } from 'child_process';

program
.version('1.0.0')
.option('-h','--help');

program
.command('list')
.description('this command list a directory')
.action((req,option)=>{
    const cmd = 'ls';
let execCallback = (error,stdout,stderr) => {
    if (error) console.log("exec error: " + error);
    if (stdout) console.log("Result: \n" + stdout);
    if (stderr) console.log("shell error: " + stderr);
};
exec(cmd,execCallback);
});


program.parse(process.argv);