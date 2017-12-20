#!/usr/bin/env node
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var program = require("commander");
var child_process_1 = require("child_process");
var index_1 = require("../index");
program
    .version('1.0.0')
    .option('-h', '--help');
program
    .command('package <config> <pack>')
    .description('this command is to package a plugin')
    .action(function (config, pack) {
    var check = config.split('.', 2);
    if (check[1] === 'js') {
        child_process_1.exec('node ' + config, function (error, stdout, stderr) {
            if (stdout.length > 0) {
                var cf = JSON.parse(stdout);
                var pm = new index_1.PluginManager(cf.repo, cf.cwd, cf.depl);
                var plugin1 = index_1.Plugin.createPluginFromFile(pack);
                pm.packagePlugin(plugin1);
            }
        });
    }
});
program.parse(process.argv);
