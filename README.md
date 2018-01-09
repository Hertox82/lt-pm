# lt-pm

This is a Lortom Package Manager and allows to manage all package of Lortom CMS.

Please read the [documentation](https://github.com/Hertox82/lt-pm/wiki)

## Delete Template from Repo

this is an example to delete a template from repo

```typescript
import * as path from 'path';
import {PackageManager, Template} from 'lt-pm';

const cwd = path.resolve(__dirname+'/../test/plugins');      // <- Folder to take the Template Source
const compr = path.resolve(__dirname+'/../test/compressed'); // <- Folder to put Compressed template
const depl = path.resolve(__dirname+'/../test/toDeploy');    // <- Folder to Decompress Template

const pm = new PackageManager(compr,cwd,depl);
//this info passed by third party
const listOfInstalled =[
    new Template('vendor1','nameTemplate','1.0.0')
];

// Passing to PackageManager the list of Installed Plugin
pm.setListTemplateInstalled(listOfInstalled);

// Get the list of avaiable Plugin into the Repo
let listTemplateRepo = pm.getLatestTemplateRepo();

let randomIndex = Math.floor(Math.random() * listTemplateRepo.length);
pm.deleteTemplate(listTemplateRepo[randomIndex]);
listTemplateRepo = pm.getLatestTemplateRepo();
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
