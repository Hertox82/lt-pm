# lt-pm

This is a Lortom Package Manager and allows to manage all package of Lortom CMS.

install this package globally:

```bash
npm install -g lt-pm
```

- [CLI](#cli)
- [API](#api)
- [Install Plugin](#install-plugin)
- [Uninstall Plugin](#uninstall-plugin)
- [Packing Plugin](#packing-plugin)
- [Delete Plugin](#delete-plugin-from-repo)

## CLI

Actually there is a CLI that pack, delete pack, install and uninstall a Plugin

```bash
 Usage: ltpm [options] [command]


  Options:

    -V, --version        output the version number
    -c, --config <path>  pass the js in order to achieve the goal
    -h, --help           output usage information


  Commands:

    package <pack>    this command is to package a plugin
    delpack <pack>    this command is to delete package a plugin
    install <pack>    this command is to install a plugin
    uninstall <pack>  this command is to uninstall a plugin
    test              this command is only for testing process.cwd()
```

## Configuration file

In order to use the ltpm CLI you have two option:

- Create file config.js
- Create file ltpm.config.json

### Create config.js

```bash
touch config.js
```

and this is an example of configuration file

```javascript
let path = require('path');

let obj = {
    cwd: path.resolve(__dirname,"./plugins"),     // <- Folder to take the Plugins Source
    repo: path.resolve(__dirname,"./compressed"), // <- Folder to put Compressed Plugin
    depl: path.resolve(__dirname,"./toDeploy")    // <- Folder to Decompress Plugin
}

console.log(JSON.stringify(obj));
```

after this every time that you would use a CLI you must type:

```bash
ltpm -c path/where/is/located/file/config.js <command> <packeFileName>
```

### Create ltpm.config.json

Creating this file the life is more easy!

this is an example of configuration file

```json
{
    "cwd" : "plugins",
    "depl": "toDeploy",
    "repo": "compressed"
}
```

place this at the root folder (in case of Lortom CMS, you'll find this into the angular-backend folder).

Now you can run the command in root folder without -c Option

```bash
ltpm <command> <packeFileName>
```

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
- [x] CLI 

in version 0.4.0
- [ ] PluginManger
    - [ ] Update Plugin

This feature will release on version 0.5.0
- [ ] Template Manager