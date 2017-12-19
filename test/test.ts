import * as path from 'path'; 
import * as fs from 'fs';
import {Plugin} from '../src/lib/Plugin';
import {PluginManager} from '../src/lib/PluginManager';


enum Action {
    Nothing,
    Install,
    Uninstall,
    Delete,
    Package,
    Update
}

let decompress = true;
let plManager = true;

const cwd = path.resolve(__dirname+'/../test/plugins');
const compr = path.resolve(__dirname+'/../test/compressed');
const depl = path.resolve(__dirname+'/../test/toDeploy');

if(!plManager) {
    if(!decompress) {
        const plugin1 = new Plugin('namePlugin','vendor1','1.0.0');
        const plugin2 = new Plugin('namePlugin2','vendor1','1.0.0');

        plugin1.cwd = cwd;
        plugin1.dirName = 'vendor1/namePlugin';
        plugin1.compress(compr);
        plugin2.cwd = cwd;
        plugin2.dirName = 'vendor1/namePlugin2';
        plugin2.compress(compr);
    } else {
        const plugin1 = Plugin.createPluginFromFile('vendor1-namePlugin-1.0.0.tgz');
        const plugin2 = Plugin.createPluginFromFile('vendor1-namePlugin2-1.0.0.tgz');

        plugin1.decompress(depl,compr);
        plugin2.decompress(depl,compr);
    }
} else {
    const pm = new PluginManager(compr,cwd,depl);
    //this info passed by third party
    const listOfInfo =[];
    console.log(listOfInfo);
    const listPluginRepo = pm.getListOfLatestPlugin(listOfInfo);
    const action = Action.Nothing;

    switch(+action) {
        case Action.Nothing:
        break;

        case Action.Uninstall: 
        if(listPluginRepo[0].installed) {
            pm.uninstallPlugin(listPluginRepo[0]);
        }
    
        if(listPluginRepo[1].installed) {
            pm.uninstallPlugin(listPluginRepo[1]);
        }
        break;

        case Action.Install: 
            listPluginRepo.forEach( 
                (plugin) => {
                    if(!plugin.installed) {
                        pm.installPlugin(plugin);
                    }
                }
            );
        break;

        case Action.Package: 

        break;

        case Action.Delete: 

        break;
    }
    
}

