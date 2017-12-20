#!/usr/bin/env node
'use strict';

import * as program from 'commander';
import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';
import { PluginManager, Plugin } from '../index';

program
.version('1.0.0')
.option('-h','--help');

program
.command('package <config> <pack>')
.description('this command is to package a plugin')
.action((config,pack)=>{
  let check = config.split('.',2);
  if(check[1] === 'js') {
    exec('node '+config ,(error,stdout,stderr) =>{
     if(stdout.length > 0) {
       let cf = JSON.parse(stdout);
       const pm = new PluginManager(cf.repo,cf.cwd,cf.depl);
       const plugin1 = Plugin.createPluginFromFile(pack);
       pm.packagePlugin(plugin1);
     }
    })
  }
});

program.parse(process.argv);