#!/usr/bin/env node
'use strict';

import * as program from 'commander';
import * as path from 'path';
import { PluginManager } from './lib/PluginManager';
import { Plugin } from './lib/Plugin';
import * as ltpr from './lib/config.interface';
import * as process from 'process';
import * as chalk from 'chalk';
import { ConfigFile } from './lib/config.interface';

const log = console.log;
program
.version('1.2.0')

program
.command('init')
.description('this command initialize ltpm.config.json')
.action(()=>{
  const fileConfigPath = ltpr.cwd()+'/ltpm.config.json';
  if(!ltpr.existFile(fileConfigPath)) {
    let cf: ConfigFile = {
      cwd: '',
      repo: '',
      depl: ''
    };

    ltpr.writeConfigJSON(fileConfigPath,cf);
  }
})

/* Package Command */
program
.command('package <pack>')
.description('this command is to package a plugin')
.action((pack)=>{
  log(chalk.default.green('initialize ltpm - Lortom Package Manager - '));
  const fileConfigPath = ltpr.cwd()+'/ltpm.config.json';
  if(ltpr.existFile(fileConfigPath)) {
    // take info from file
    log(chalk.default.yellow('reading configuration file ...'));
    const cf = ltpr.getConfigJSON(fileConfigPath);
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
});

/*Delete Package Command */
program
.command('delpack <pack>')
.description('this command is to delete package a plugin')
.action((pack)=>{
  log(chalk.default.green('initialize ltpm - Lortom Package Manager - '));
  const fileConfigPath = ltpr.cwd()+'/ltpm.config.json';
  if(ltpr.existFile(fileConfigPath)) {
    // take info from file
    log(chalk.default.yellow('reading configuration file ...'));
    const cf = ltpr.getConfigJSON(fileConfigPath);
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

});
/* Install Plugin Commnad */
program
.command('install <pack>')
.description('this command is to install a plugin')
.action((pack)=>{
  log(chalk.default.green('initialize ltpm - Lortom Package Manager - '));
  const fileConfigPath = ltpr.cwd()+'/ltpm.config.json';
  if(ltpr.existFile(fileConfigPath)) {
    // take info from file
    log(chalk.default.yellow('reading configuration file ...'));
    const cf = ltpr.getConfigJSON(fileConfigPath);
    const pm = new PluginManager(cf.repo,cf.cwd,cf.depl);
    const plugin1 = Plugin.createPluginFromFile(pack);
    if(plugin1) {
      log(chalk.default.yellow('Installing Plugin ..'));
      pm.installPlugin(plugin1);
      if(cf.plugins == undefined || cf.plugins == null) {
        cf.plugins = [];
      }
      cf.plugins.push(plugin1.serializeForConfig());
      log(chalk.default.yellow('writing file config ...'));
      ltpr.writeConfigJSON(fileConfigPath,cf);
      log(chalk.default.green('well done! Finish to install the Plugin'));
    }
  } else {
    log(chalk.default.red('Sorry!, but i can\'t find the ltpm.config.json, please provide to write it'));
  }

});
/* Uninstall Plugin Command */
program
.command('uninstall <pack>')
.description('this command is to install a plugin')
.action((pack)=>{
  log(chalk.default.green('initialize ltpm - Lortom Package Manager - '));
  const fileConfigPath = ltpr.cwd()+'/ltpm.config.json';
  if(ltpr.existFile(fileConfigPath)) {
    // take info from file
    log(chalk.default.yellow('reading configuration file ...'));
    let cf = ltpr.getConfigJSON(fileConfigPath);
    const pm = new PluginManager(cf.repo,cf.cwd,cf.depl);
    const plugin1 = Plugin.createPluginFromFile(pack);
    if(plugin1) {
      log(chalk.default.yellow('Uninstalling Plugin ..'));
      pm.uninstallPlugin(plugin1);
      const pl = plugin1.serializeForConfig();
     const index = ltpr.findMe(cf.plugins,pl);
      if(index > -1) {
        cf.plugins.splice(index,1);
      }
      
      if(cf.plugins.length === 0) {
        delete cf.plugins;
      }
      log(chalk.default.yellow('writing file config ...'));
      ltpr.writeConfigJSON(fileConfigPath,cf);
      log(chalk.default.green('well done! Finish to uninstall the Plugin'));
    }
  } else {
    log(chalk.default.red('Sorry!, but i can\'t find the ltpm.config.json, please provide to write it'));
  }

});
program
.command('latest')
.description('this command return all latest package inside of repo folder')
.action(() => {
  const fileConfigPath = ltpr.cwd()+'/ltpm.config.json';
  if(ltpr.existFile(fileConfigPath)) {
    const cf = ltpr.getConfigJSON(fileConfigPath);
    const pm = new PluginManager(cf.repo,cf.cwd,cf.depl);
    log(pm.serializeLatestPluginRepo(cf.plugins));
  } else {
    log('{"error": "configuration_file_not_found"}');
  }
});

program
.command('test')
.description('this command is only for testing process.cwd()')
.action(()=>{
  log(chalk.default.blueBright.bold(ltpr.cwd()));
})

program.parse(process.argv);