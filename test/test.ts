import * as path from 'path'; 
import {Plugin} from '../src/lib/Plugin';
import {PackageManager} from '../src/lib/PackageManager';


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
let listOfInstalled = [];

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
        const plugin1 = Plugin.createFromFile('vendor1-namePlugin-1.0.0.tgz');
        const plugin2 = Plugin.createFromFile('vendor1-namePlugin2-1.0.0.tgz');

        plugin1.decompress(depl,compr);
        plugin2.decompress(depl,compr);
    }
} else {
    const pm = new PackageManager(compr,cwd,depl);
    //this info passed by third party
    //const listOfInstalled =[];
    pm.setListPluginInstalled(listOfInstalled);
    let listPluginRepo = pm.getLatestPluginRepo();
    const action = Action.Nothing;

    switch(+action) {
        case Action.Nothing:
            console.log(pm.serializeLatestPluginRepo());
        break;

        case Action.Uninstall: 
            listOfInstalled.forEach((pl)=>{
                if(pl.installed){
                    pm.uninstallPlugin(pl);
                }
            });
            listOfInstalled = pm.getListPluginInstalled();
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
            listOfInstalled = pm.getListPluginInstalled();
            listOfInstalled.forEach((plug) => {
                if(!plug.compress) {
                    pm.packagePlugin(plug);
                }
            });
        break;

        case Action.Delete: 
            let randomIndex = Math.floor(Math.random() * listPluginRepo.length);
            pm.deletePlugin(listPluginRepo[randomIndex]);
            listPluginRepo = pm.getLatestPluginRepo();
        break;
    }
    
}

