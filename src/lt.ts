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
import { Template } from './lib/Template';

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
.description('this command is to uninstall a plugin')
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
/* Latest Plugin */
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
/* Latest Template */
program
.command('latest-template')
.description('this command return all latest template inside of repo folder')
.action(() => {
  const fileConfigPath = ltpr.cwd()+'/ltpm.config.json';
  if(ltpr.existFile(fileConfigPath)) {
    const cf = ltpr.getConfigJSON(fileConfigPath);
    const pm = new PluginManager(cf.repo,cf.cwd,cf.depl);
    if(cf.deplt != undefined || cf.deplt != null) {
        pm.deplt = cf.deplt;
        if(cf.cwdT != undefined || cf.cwdT != null) {
          pm.cwdT = cf.cwdT;
          log(pm.serializeLatestTemplateRepo());
      }
      else {
        log(chalk.default.red('The work template directory isn\'t initialized, please write it into the config file '));
      }
    }
    else {
      log(chalk.default.red('The deploy template folder isn\'t initialized, please write it into the config file '));
    }
    
  }
});

program
.command('package-t <pack>')
.description('this command is to package a template')
.action((pack)=>{
  log(chalk.default.green('initialize ltpm - Lortom Package Manager - '));
  const fileConfigPath = ltpr.cwd()+'/ltpm.config.json';
  if(ltpr.existFile(fileConfigPath)) {
    // take info from file
    log(chalk.default.yellow('reading configuration file ...'));
    const cf = ltpr.getConfigJSON(fileConfigPath);
    const pm = new PluginManager(cf.repo,cf.cwd,cf.depl);
    if(cf.deplt != undefined || cf.deplt != null) {
      pm.deplt = cf.deplt;
        if(cf.cwdT != undefined || cf.cwdT != null) {
          pm.cwdT = cf.cwdT;
          const template1 = Template.createFromFile(pack);
            if(template1) {
              log(chalk.default.yellow('Compressing file into the folder'));
              pm.packageTemplate(template1);
              log(chalk.default.green('well done! Finish to pack your Plugin'));
            } 
        } else {
            log(chalk.default.red('The work template directory isn\'t initialized, please write it into the config file '));
          }
    } else {
    log(chalk.default.red('The deploy template folder isn\'t initialized, please write it into the config file '));
    }
  } else {
    log(chalk.default.red('Sorry!, but i can\'t find the ltpm.config.json, please provide to write it'));
  }
});

/*Delete Template Command */
program
.command('deltemp <pack>')
.description('this command is to delete packed template')
.action((pack)=>{
  log(chalk.default.green('initialize ltpm - Lortom Package Manager - '));
  const fileConfigPath = ltpr.cwd()+'/ltpm.config.json';
  if(ltpr.existFile(fileConfigPath)) {
    // take info from file
    log(chalk.default.yellow('reading configuration file ...'));
    const cf = ltpr.getConfigJSON(fileConfigPath);
    const pm = new PluginManager(cf.repo,cf.cwd,cf.depl);
    if(cf.deplt != undefined || cf.deplt != null) {
        pm.deplt = cf.deplt;
          if(cf.cwdT != undefined || cf.cwdT != null) {
            pm.cwdT = cf.cwdT;
            const template1 = Template.createFromFile(pack);
              if(template1) {
                log(chalk.default.yellow('Deleting package'));
                pm.deleteTemplate(template1);
                log(chalk.default.green('well done! Finish to delete your Template packed'));
              } 
          } else {
              log(chalk.default.red('The work template directory isn\'t initialized, please write it into the config file '));
            }
    } else {
    log(chalk.default.red('The deploy template folder isn\'t initialized, please write it into the config file '));
    }
  } else {
    log(chalk.default.red('Sorry!, but i can\'t find the ltpm.config.json, please provide to write it'));
  }
});

/* Install Template Command */
program
.command('install-t <pack>')
.description('this command is to install a template')
.action((pack)=>{
  log(chalk.default.green('initialize ltpm - Lortom Package Manager - '));
  const fileConfigPath = ltpr.cwd()+'/ltpm.config.json';
  if(ltpr.existFile(fileConfigPath)) {
    // take info from file
    log(chalk.default.yellow('reading configuration file ...'));
    const cf = ltpr.getConfigJSON(fileConfigPath);
    const pm = new PluginManager(cf.repo,cf.cwd,cf.depl);
    if(cf.deplt != undefined || cf.deplt != null) {
      pm.deplt = cf.deplt;
        if(cf.cwdT != undefined || cf.cwdT != null) {
          pm.cwdT = cf.cwdT;
          const template1 = Template.createFromFile(pack);
            if(template1) {
              log(chalk.default.yellow('Installing Template'));
              pm.installTemplate(template1);
              if(cf.template == undefined || cf.template == null) {
               cf.template = template1.serialize();
              }
              log(chalk.default.yellow('writing file config ...'));
               ltpr.writeConfigJSON(fileConfigPath,cf);
               log(chalk.default.green('well done! Finish to install the Template'));
            } 
        } else {
            log(chalk.default.red('The work template directory isn\'t initialized, please write it into the config file '));
          }
    } else {
    log(chalk.default.red('The deploy template folder isn\'t initialized, please write it into the config file '));
    }
  } else {
    log(chalk.default.red('Sorry!, but i can\'t find the ltpm.config.json, please provide to write it'));
  }

});

/* Uninstall Plugin Command  Per ora è da cambiare */
program
.command('uninstall-t <pack>')
.description('this command is to uninstall a template')
.action((pack)=>{
  log(chalk.default.green('initialize ltpm - Lortom Package Manager - '));
  const fileConfigPath = ltpr.cwd()+'/ltpm.config.json';
  if(ltpr.existFile(fileConfigPath)) {
    // take info from file
    log(chalk.default.yellow('reading configuration file ...'));
    let cf = ltpr.getConfigJSON(fileConfigPath);
    const pm = new PluginManager(cf.repo,cf.cwd,cf.depl);
    if(cf.deplt != undefined || cf.deplt != null) {
      pm.deplt = cf.deplt;
        if(cf.cwdT != undefined || cf.cwdT != null) {
          pm.cwdT = cf.cwdT;
          const template1 = Template.createFromFile(pack);
            if(template1) {
              log(chalk.default.yellow('Uninstalling Template ..'));
              pm.uninstallTemplate(template1);
              if(cf.template != undefined || cf.template != null) {
               delete cf.template;
              }
              log(chalk.default.yellow('writing file config ...'));
               ltpr.writeConfigJSON(fileConfigPath,cf);
               log(chalk.default.green('well done! Finish to uninstall the Template'));
            } 
        } else {
            log(chalk.default.red('The work template directory isn\'t initialized, please write it into the config file '));
          }
    } else {
    log(chalk.default.red('The deploy template folder isn\'t initialized, please write it into the config file '));
    }
  } else {
    log(chalk.default.red('Sorry!, but i can\'t find the ltpm.config.json, please provide to write it'));
  }

});

program
.command('test')
.description('this command is only for testing process.cwd()')
.action(()=>{
  log(chalk.default.blueBright.bold(ltpr.cwd()));
})

program.parse(process.argv);