import * as fs from 'fs';
import * as path from 'path';
import { Plugin } from './Plugin';

export class PluginManager {

    repo: string;
    cwd: string;
    depl: string;
    _latestPluginRepo: Plugin[];
    _listOfPluginInstalled: Plugin [];

    constructor(repositoryPath: string,cwd: string,depl: string) {
        // initialize all variable
        this.repo = repositoryPath;
        this.cwd = cwd;
        this.depl = depl;
        this._latestPluginRepo = [];
        this._listOfPluginInstalled = [];
    }

    /**
     * This function return a List of Latest Plugin avaiable
     * @param listOfInfo Plugin[]
     * @return Plugin[]
     */
    getLatestPluginRepo(installedPlugins : Plugin[] = []): Plugin[] {

        // if latest plugin repo is not undefined
        if(this._latestPluginRepo == undefined || this._latestPluginRepo.length == 0) {
            this._latestPluginRepo = this.populateList();
        }

        // check if installed Plugin list 
        if(installedPlugins.length != 0) {
            this.setListPluginInstalled(installedPlugins);
            this.checkIfPluginsRepoInstalled(installedPlugins);
            
        }

       return this._latestPluginRepo;
    }

    /**
     * This function return all Plugin Installed into CMS
     * @returns Plugin[]
     */
    getListPluginInstalled(): Plugin[] {
        return this._listOfPluginInstalled;
    }

    /**
     * This function set installed Plugin into CMS
     * @param installedPlugin Plugin[]
     */
    setListPluginInstalled(installedPlugin: Plugin[]) {
        this._listOfPluginInstalled = installedPlugin;
    }

    /**
     * This function populate list of Plugin
     * @return Plugin[]
     */
    protected populateList(): Plugin[] {
         //return Arrya from Folder
       let tempArray: Plugin[] = this.getArrayFromFolder();

       // clone the array of Plugin
      let secondTempArray = tempArray.slice();

      //Check for the Latest version
      for(let i = 0; i<tempArray.length; i++)
      {
          let item = tempArray[i];
          let number = i+1;
      
          if(number<tempArray.length)
          {
               for(number; number< tempArray.length; number++)
               {
                   let item2 = tempArray[number];
      
                   if(item2.vendor === item.vendor && item2.name === item.name)
                   {
                       this.compare(item,item2,secondTempArray);
                   }
               }
          }
      }
      
      return secondTempArray; 
    }

    /**
     * This function check if Plugins are installed
     * @param arrayInfo 
     */
    protected checkIfPluginsRepoInstalled(arrayInfo: Plugin[]): void {

        this._latestPluginRepo.forEach((item) => {
            arrayInfo.forEach((it => {
                if(it.name === item.name && it.vendor === item.vendor && it.version === item.version) {
                    item.installed = true;
                }
            }))
        });
    }

    /**
     * Only erase Plugins Folder and maintain the compressedFile
     * @param plugin Plugin
     */
    uninstallPlugin(plugin: Plugin){
        const dirPlug = this.depl+'/'+plugin.vendor+'/'+plugin.name;

        if(fs.existsSync(dirPlug)){
            let folderArray = fs.readdirSync(dirPlug);
            folderArray.forEach(
                (item)=>{
                    const dirItem = dirPlug+'/'+item;
                    let stat = fs.statSync(dirItem);
                    if(stat.isFile){
                        fs.unlinkSync(dirItem);
                    }
                    else if(stat.isDirectory){
                        this.eraseDirectory(dirItem);
                    }
                });
        }
        fs.rmdirSync(dirPlug);

        let folderVendor = fs.readdirSync(this.depl+'/'+plugin.vendor);
        if(folderVendor.length == 0) {
            fs.rmdirSync(this.depl+'/'+plugin.vendor);
        }
        //remove plugin into list of plugin installed
        this.removeItem(plugin,this._listOfPluginInstalled);

        //find index into the list of plugin repo
        let indexRepo = this._latestPluginRepo.indexOf(plugin);

        //if index exist, put the plugin installed to false
        if(indexRepo > -1) {
            this._latestPluginRepo[indexRepo].installed = false;
        }
    }
    /**
     * This Function
     * @param dirPath string
     */
    protected eraseDirectory(dirPath: string) {
        let folderArray = fs.readdirSync(dirPath);
        folderArray.forEach(
            (item) => {
                const dirItem = dirPath+'/'+item;
                const stat = fs.statSync(dirItem);
                if(stat.isFile){
                    fs.unlinkSync(dirItem);
                }
                else if(stat.isDirectory){
                    this.eraseDirectory(dirItem);
                }
            }
        );
        fs.rmdirSync(dirPath);
    }

    /**
     * Install the Plugin from Folder compressed
     * @param plugin Plugin
     */
    installPlugin(plugin: Plugin){
        plugin.decompress(this.depl,this.repo);

        this._listOfPluginInstalled.push(plugin);
        let index = this._latestPluginRepo.indexOf(plugin);

        if(index>-1) {
            this._latestPluginRepo[index].installed = true;
        }
    }

    /**
     * Compress the Plugin into folder compressed
     * @param plugin Plugin
     */
    packagePlugin(plugin: Plugin) {
        
        if(!fs.existsSync(this.repo))
        {
            fs.mkdirSync(this.repo);
        }
        plugin.cwd = this.cwd;
        plugin.dirName = plugin.vendor+'/'+plugin.name;
        plugin.compress(this.repo);

        let indexInstall = this._listOfPluginInstalled.indexOf(plugin);
        if(indexInstall > -1) {
           this._listOfPluginInstalled[indexInstall].packed = true;
        }
    }

    /**
     * Erase the compressed file
     * @param plugin Plugin
     */
    deletePlugin(plugin: Plugin) {
        //TODO
    }

    /**
     * This function update Plugin
     * @param pluginOld Plugin
     * @param pluginNew Plugin
     */
    updatePlugin(pluginOld: Plugin, pluginNew: Plugin) {
        //TODO
    }

    /**
     * This function return Info of all Plugin Installed
     * @returns {vendor: string, name: string}[]
     * @deprecated
     */
    getPluginInstalled(): {vendor: string, name: string}[] {
        let arrayPlug = fs.readdirSync(this.depl);
        let returnArray: {vendor: string, name: string}[] = [];

        if(arrayPlug.length > 0) {
            arrayPlug.forEach(
                (vendorPl)  => {
                    const statF = fs.statSync(vendorPl);
                    if(statF.isDirectory) {
                        const dirPath = this.depl+'/'+vendorPl;
                        const arrayName = fs.readdirSync(dirPath);
                        if(arrayName.length > 0 ) {
                            arrayName.forEach(
                                (namePlug) => {
                                    returnArray.push({vendor: vendorPl, name: namePlug});
                                }
                            );
                        }
                    }
                }
            );
        }
        return returnArray;
    }

    protected checkPluginIsPacked(plugin: Plugin) {
        return fs.existsSync(this.repo+'/'+plugin.getPathToCompress());
    }

    /**
     * This function return array from specific folder
     */
    protected getArrayFromFolder(): Plugin[] {
        let arrayFile: Plugin[] = [];
        //read the folder, and store the Array of File
        let file = fs.readdirSync(this.repo);
        //iterate over array and Save into the temp Array a list Of Plugins
        file.forEach(
            (item) => {
                if(item != '.DS_Store') {
                    let obj = Plugin.createPluginFromFile(item);
                    obj.packed = true;
                    arrayFile.push(obj);
                } else {
                    fs.unlinkSync(this.repo+'/'+item);
                }
            }
        );

        return arrayFile;
    }

    /**
     * This function compare two Plugin
     * @param a 
     * @param b 
     * @param array 
     */
    protected compare (a: Plugin, b: Plugin, array: Plugin[]): void
    {
        if(a.major === b.major) {
            if(a.minor === b.minor)
            {
                if(a.patch < b.patch)
                {
                    this.removeItem(a,array);
                }
                else if(a.patch > b.patch)
                {
                    this.removeItem(b,array);
                }
            }
            else if(a.minor < b.minor)
            {
                this.removeItem(a,array);
            }
            else {
                this.removeItem(b,array);
            }
        }
        else if(a.major < b.major) {
            this.removeItem(a,array);
        }
        else {
            this.removeItem(b,array);
        }
    }

    /**
     * This function remove Item from array
     * @param item 
     * @param array 
     */
    protected removeItem(item: Plugin, array: Plugin[]) {
        let index = array.indexOf(item);
        
            if (index> -1) {
                array.splice(index,1);
            }
    }
}