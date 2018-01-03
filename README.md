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
- [Change Log](#change-log)
- [Todo list](#todo-list)

## CLI

Actually there is a CLI that pack, delete pack, install and uninstall a Plugin

```bash
 Usage: ltpm [options] [command]


  Options:

    -V, --version  output the version number
    -h, --help     output usage information


  Commands:

    init              this command initialize ltpm.config.json
    package <pack>    this command is to package a plugin
    delpack <pack>    this command is to delete package a plugin
    install <pack>    this command is to install a plugin
    uninstall <pack>  this command is to install a plugin
    latest            this command return all latest package inside of repo folder
    test              this command is only for testing process.cwd()
```

## Configuration file

In order to use the ltpm CLI you have to create a ltpm.config.json into the root folder:


### Create ltpm.config.json

You type this command on root folder

```bash
ltpm init
```

and the CLI provide for you to create the ltpm.config.json. The file will be empty like this:

```json
{
    "cwd" : "",
    "depl": "",
    "repo": ""
}
```

remember to fill the option:

`cwd :` this is a folder where are located the source code for Plugin,

`depl :` this is a folder where are located the deployed Plugin,

`repo :` this is a folder where are located the compressed Plugin,

`plugins :` When you will install a Plugin, in this place you can find the Config of that Plugin

Now you able to type all command

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

        /**
         * This function serialize Plugin
         * @returns {vendor: string, name: string, version: string, installed: boolean, packed: boolean}
         */
        public serialize(): any ;

        /**
         * This function serialize Plugin for File Config
         * @returns {vendor: string, name: string, version: string}
         */
        serializeForConfig(): any;
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

## CHANGE LOG

**v 0.4.1**
- Fixed bug on Uninstall command

**v 0.4.0**

- Added new commands `latest` and `init`;
- Removed the `.js` file for configuration file
- Added function API for PluginManager `serializeLatestPluginRepo()`

## TODO LIST

- [ ]  PluginManger
  - [ ] Update Plugin
- [ ] Template Manager
