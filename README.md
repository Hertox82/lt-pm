# lt-pm

This is a Lortom Package Manager and allows to manage all package of Lortom CMS.

- [API](#api)
- [Install Plugin](#install-plugin)
- [Uninstall Plugin](#uninstall-plugin)
- [Packing Plugin](#packing-plugin)
- [Delete Plugin](#delete-plugin-from-repo)



## API 
The `PluginManger` have this API method:

```typescript
    export declared class PluginManager {
        /**
         * This function return a List of Latest Plugin avaiable
         * @param listOfInfo Plugin[]
         * @return Plugin[]
         */
         public getLatestPluginRepo(): Plugin[];
        /**
         * This function return all Plugin Installed into CMS
         * @returns Plugin[]
         */
        public getListPluginInstalled(): Plugin[];

        /**
         * This function set installed Plugin into CMS
         * @param installedPlugin Plugin[]
         */
        public setListPluginInstalled(installedPlugin: Plugin[]);

        /**
         * Install the Plugin from Folder compressed
         * @param plugin Plugin
         */
        public installPlugin(plugin: Plugin);

        /**
         * Only erase Plugins Folder and maintain the compressedFile
         * @param plugin Plugin
         */
        public uninstallPlugin(plugin: Plugin);
        /**
         * Compress the Plugin into folder compressed
         * @param plugin Plugin
         */
        public packagePlugin(plugin: Plugin);

        /**
         * Erase the compressed file
         * @param plugin Plugin
         */
        public deletePlugin(plugin: Plugin);

        /**
         * This function update Plugin
         * @param pluginOld Plugin
         * @param pluginNew Plugin
         * @todo
         */
        public updatePlugin(pluginOld: Plugin, pluginNew: Plugin);
    }
```

## Install Plugin

this is an example to install a plugin

```typescript
import * as path from 'path';
import {PluginManger} from 'lt-pm';

const cwd = path.resolve(__dirname+'/../test/plugins');      // <- Folder to take the Plugins Source
const compr = path.resolve(__dirname+'/../test/compressed'); // <- Folder to put Compressed plugin
const depl = path.resolve(__dirname+'/../test/toDeploy');    // <- Folder to Decompress Plugin

const pm = new PluginManager(compr,cwd,depl);
//this info passed by third party
const listOfInstalled =[
    new Plugin('namePlugin','vendor1','1.0.0'),
    new Plugin('namePlugin2','vendor1','1.2.0');
];

// Passing to PluginManager the list of Installed Plugin
pm.setListPluginInstalled(listOfInstalled);

// Get the list of avaiable Plugin into the Repo
let listPluginRepo = pm.getLatestPluginRepo();

 listPluginRepo.forEach(
        (plugin) => {
            if(!plugin.installed) {
                pm.installPlugin(plugin);
            }
        }
    );
```

## Uninstall Plugin

this is an example to uninstall a plugin

```typescript
import * as path from 'path';
import {PluginManger} from 'lt-pm';

const cwd = path.resolve(__dirname+'/../test/plugins');      // <- Folder to take the Plugins Source
const compr = path.resolve(__dirname+'/../test/compressed'); // <- Folder to put Compressed plugin
const depl = path.resolve(__dirname+'/../test/toDeploy');    // <- Folder to Decompress Plugin

const pm = new PluginManager(compr,cwd,depl);
//this info passed by third party
const listOfInstalled =[
    new Plugin('namePlugin','vendor1','1.0.0'),
    new Plugin('namePlugin2','vendor1','1.2.0');
];

// Passing to PluginManager the list of Installed Plugin
pm.setListPluginInstalled(listOfInstalled);

// Get the list of avaiable Plugin into the Repo
let listPluginRepo = pm.getLatestPluginRepo();

this.listOfInstalled.forEach((pl)=>{
        if(pl.installed){
            pm.uninstallPlugin(pl);
        }
    });
this.listOfInstalled = pm.getListPluginInstalled();
```

## Packing Plugin

this is an example to packing a plugin

```typescript
import * as path from 'path';
import {PluginManger} from 'lt-pm';

const cwd = path.resolve(__dirname+'/../test/plugins');      // <- Folder to take the Plugins Source
const compr = path.resolve(__dirname+'/../test/compressed'); // <- Folder to put Compressed plugin
const depl = path.resolve(__dirname+'/../test/toDeploy');    // <- Folder to Decompress Plugin

const pm = new PluginManager(compr,cwd,depl);
//this info passed by third party
const listOfInstalled =[
    new Plugin('namePlugin','vendor1','1.0.0'),
    new Plugin('namePlugin2','vendor1','1.2.0');
];

// Passing to PluginManager the list of Installed Plugin
pm.setListPluginInstalled(listOfInstalled);

// Get the list of avaiable Plugin into the Repo
let listPluginRepo = pm.getLatestPluginRepo();

let listOfInstalled = pm.getListPluginInstalled();

    listOfInstalled.forEach((plug) => {
        if(!plug.compress) {
            pm.packagePlugin(plug);
        }
    });
```

## Delete Plugin from Repo

this is an example to delete a plugin from repo

```typescript
import * as path from 'path';
import {PluginManger} from 'lt-pm';

const cwd = path.resolve(__dirname+'/../test/plugins');      // <- Folder to take the Plugins Source
const compr = path.resolve(__dirname+'/../test/compressed'); // <- Folder to put Compressed plugin
const depl = path.resolve(__dirname+'/../test/toDeploy');    // <- Folder to Decompress Plugin

const pm = new PluginManager(compr,cwd,depl);
//this info passed by third party
const listOfInstalled =[
    new Plugin('namePlugin','vendor1','1.0.0'),
    new Plugin('namePlugin2','vendor1','1.2.0');
];

// Passing to PluginManager the list of Installed Plugin
pm.setListPluginInstalled(listOfInstalled);

// Get the list of avaiable Plugin into the Repo
let listPluginRepo = pm.getLatestPluginRepo();

let randomIndex = Math.floor(Math.random() * listPluginRepo.length);
pm.deletePlugin(listPluginRepo[randomIndex]);
listPluginRepo = pm.getLatestPluginRepo();
```


# TODO LIST

this is the List of Things To Do for the next time v 0.3.0
- [ ] PluginManger
    - [ ] Update Plugin



This feature will release on version 0.4.0
- [ ] Template Manager