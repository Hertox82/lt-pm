#!/usr/bin/env node
'use strict';

import * as program from 'commander';
import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';
import { PluginManager } from './lib/PluginManager';
import { Plugin } from './lib/Plugin';
import * as process from 'process';
import * as chalk from 'chalk';

function getConfigJS(options): Promise<string|Buffer> {
  let check = options.split('.',2);
  if(check[1] === 'js') {
    return new Promise( (resolve,reject) => {
      let child = exec('node '+options);
      child.stdout.on('data', resolve);
      child.stderr.on('data',reject)
    } );
  }
}


function getConfigJSON(path: string): {cwd: string, repo: string, depl: string} {
  let cf = JSON.parse(fs.readFileSync(path,'utf8'));
  cf.cwd = process.cwd()+'/'+cf.cwd;
  cf.repo = process.cwd()+'/'+cf.repo;
  cf.depl = process.cwd()+'/'+cf.depl;
  return cf;
}


const log = console.log;
program
.version('1.1.0')
.option('-c, --config <path>','pass the js in order to achieve the goal');

/* Package Command */
program
.command('package <pack>')
.description('this command is to package a plugin')
.action((pack,path)=>{
  log(chalk.default.green('initialize ltpm - Lortom Package Manager - '));
  if (path.parent.config != undefined) {
    const options = path.parent.config;
    log(chalk.default.yellow('reading configuration file ...'));
    const cf = getConfigJS(options).then(
      (data) => {
        const cf = JSON.parse(data as string);
        const pm = new PluginManager(cf.repo,cf.cwd,cf.depl);
        const plugin1 = Plugin.createPluginFromFile(pack);
        if(plugin1) {
          log(chalk.default.yellow('Compressing file into the folder'));
          pm.packagePlugin(plugin1);
          log(chalk.default.green('well done! Finish to pack your Plugin'));
        }
      }
    );
} else {
    const fileConfigPath = process.cwd()+'/ltpm.config.json';
    if(fs.existsSync(fileConfigPath)) {
      // take info from file
      log(chalk.default.yellow('reading configuration file ...'));
      const cf = getConfigJSON(fileConfigPath);
      const pm = new PluginManager(cf.repo,cf.cwd,cf.depl);
      const plugin1 = Plugin.createPluginFromFile(pack);
      if(plugin1) {
        log(chalk.default.yellow('Compressing file into the folder'));
        pm.packagePlugin(plugin1);
        log(chalk.default.green('well done! Finish to pack your Plugin'));
      }
    } else {
      log(chalk.default.red('Sorry!, but i can\'t find the ltpm.config.json, please provide to write it'));
    }
}
});

/*Delete Package Command */
program
.command('delpack <pack>')
.description('this command is to delete package a plugin')
.action((pack,path)=>{
  log(chalk.default.green('initialize ltpm - Lortom Package Manager - '));
  if (path.parent.config != undefined) {
    const options = path.parent.config;
    log(chalk.default.yellow('reading configuration file ...'));
    const cf = getConfigJS(options).then(
      (data) => {
        const cf = JSON.parse(data as string);
        const pm = new PluginManager(cf.repo,cf.cwd,cf.depl);
        const plugin1 = Plugin.createPluginFromFile(pack);
        if(plugin1) {
          log(chalk.default.yellow('Deleting package'));
          pm.deletePlugin(plugin1);
          log(chalk.default.green('well done! Finish to delete your Plugin packed'));
        }
      }
    );
} else {
    const fileConfigPath = process.cwd()+'/ltpm.config.json';
    if(fs.existsSync(fileConfigPath)) {
      // take info from file
      log(chalk.default.yellow('reading configuration file ...'));
      const cf = getConfigJSON(fileConfigPath);
      const pm = new PluginManager(cf.repo,cf.cwd,cf.depl);
      const plugin1 = Plugin.createPluginFromFile(pack);
      if(plugin1) {
        log(chalk.default.yellow('Deleting package'));
        pm.deletePlugin(plugin1);
        log(chalk.default.green('well done! Finish to delete your Plugin packed'));
      }
    } else {
      log(chalk.default.red('Sorry!, but i can\'t find the ltpm.config.json, please provide to write it'));
    }
}
});
/* Install Plugin Commnad */
program
.command('install <pack>')
.description('this command is to install a plugin')
.action((pack,path)=>{
  log(chalk.default.green('initialize ltpm - Lortom Package Manager - '));
  if (path.parent.config != undefined) {
    const options = path.parent.config;
    log(chalk.default.yellow('reading configuration file ...'));
    const cf = getConfigJS(options).then(
      (data) => {
        const cf = JSON.parse(data as string);
        const pm = new PluginManager(cf.repo,cf.cwd,cf.depl);
        const plugin1 = Plugin.createPluginFromFile(pack);
        if(plugin1) {
          log(chalk.default.yellow('Installing Plugin ..'));
          pm.installPlugin(plugin1);
          log(chalk.default.green('well done! Finish to install the Plugin'));
        }
      }
    );
} else {
    const fileConfigPath = process.cwd()+'/ltpm.config.json';
    if(fs.existsSync(fileConfigPath)) {
      // take info from file
      log(chalk.default.yellow('reading configuration file ...'));
      const cf = getConfigJSON(fileConfigPath);
      const pm = new PluginManager(cf.repo,cf.cwd,cf.depl);
      const plugin1 = Plugin.createPluginFromFile(pack);
      if(plugin1) {
        log(chalk.default.yellow('Installing Plugin ..'));
        pm.installPlugin(plugin1);
        log(chalk.default.green('well done! Finish to install the Plugin'));
      }
    } else {
      log(chalk.default.red('Sorry!, but i can\'t find the ltpm.config.json, please provide to write it'));
    }
}
});
/* Uninstall Plugin Command */
program
.command('uninstall <pack>')
.description('this command is to install a plugin')
.action((pack,path)=>{
  log(chalk.default.green('initialize ltpm - Lortom Package Manager - '));
  if (path.parent.config != undefined) {
    const options = path.parent.config;
    log(chalk.default.yellow('reading configuration file ...'));
    const cf = getConfigJS(options).then(
      (data) => {
        const cf = JSON.parse(data as string);
        const pm = new PluginManager(cf.repo,cf.cwd,cf.depl);
        const plugin1 = Plugin.createPluginFromFile(pack);
        if(plugin1) {
          log(chalk.default.yellow('Uninstalling Plugin ..'));
          pm.uninstallPlugin(plugin1);
          log(chalk.default.green('well done! Finish to uninstall the Plugin'));
        }
      }
    );
} else {
    const fileConfigPath = process.cwd()+'/ltpm.config.json';
    if(fs.existsSync(fileConfigPath)) {
      // take info from file
      log(chalk.default.yellow('reading configuration file ...'));
      const cf = getConfigJSON(fileConfigPath);
      const pm = new PluginManager(cf.repo,cf.cwd,cf.depl);
      const plugin1 = Plugin.createPluginFromFile(pack);
      if(plugin1) {
        log(chalk.default.yellow('Uninstalling Plugin ..'));
        pm.uninstallPlugin(plugin1);
        log(chalk.default.green('well done! Finish to uninstall the Plugin'));
      }
    } else {
      log(chalk.default.red('Sorry!, but i can\'t find the ltpm.config.json, please provide to write it'));
    }
}
});

program.parse(process.argv);