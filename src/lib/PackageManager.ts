import * as fs from 'fs';
import * as path from 'path';
import { Plugin } from './Plugin';
import { Template } from './Template';
import { AbstractPack } from './AbstractPack';

export class PackageManager {

    repo: string;
    cwd: string;
    cwdT?: string;
    depl: string;
    deplt?: string;
    _latestPluginRepo: Plugin[];
    _listOfPluginInstalled: Plugin [];
    _latestTemplateRepo: Template [];
    _listOfTemplateInstalled: Template [];

    constructor(repositoryPath: string,cwd: string,depl: string, deplt?: string, cwdT?: string) {
        // initialize all variable
        this.repo = repositoryPath;
        this.cwd = cwd;
        this.depl = depl;
        if(deplt != null || deplt != undefined) {
            this.deplt = deplt;
        }
        if(cwdT != null || cwdT != undefined) {
            this.cwdT = cwdT;
        }
        this._latestPluginRepo = [];
        this._listOfPluginInstalled = [];
        this._latestTemplateRepo = [];
        this._listOfTemplateInstalled = [];
    }

    /**
     * This function return a List of Latest Plugin avaiable
     * @param listOfInfo Plugin[]
     * @return Plugin[]
     */
    public getLatestPluginRepo(): Plugin[] {

        // if latest plugin repo is not undefined
        if(this._latestPluginRepo == undefined || this._latestPluginRepo.length == 0) {
            this._latestPluginRepo = this.populateList();
        }

        // check if installed Plugin list 
        if(this._listOfPluginInstalled.length != 0) {
            this.checkIfPluginsRepoInstalled(this._listOfPluginInstalled);
        }

       return this._latestPluginRepo;
    }

    /**
     * this function return the list of latest template
     * @return Template [] 
     */
    public getLatestTemplateRepo(): Template[] {
        
        if(this._latestTemplateRepo == undefined || this._latestTemplateRepo.length == 0) {
            this._latestTemplateRepo = this.popListTemplate();
        }

        //check if installed Template list
        if(this._listOfTemplateInstalled.length != 0) {
            this.checkIfTemplatesRepoInstalled(this._listOfTemplateInstalled);
        }
        return  this._latestTemplateRepo;
    }

    public  serializeLatestPackage(listOfPlugin?: any, listOfTemplate?: any): string {
        let listP = this.getLatestPluginToSerialize(listOfPlugin);
        let listT = this.getLatestTemplateToSerialize(listOfTemplate);

        let listToSerialize = {
            Plugins: listP,
            Templates: listT
        }

        return JSON.stringify(listToSerialize);
    }

    /**
     * this function return a list of latest template serialized
     * @return string
     */
    public serializeLatestTemplateRepo(listInstalled?: any): string {
        
        let listToSerialize = this.getLatestTemplateToSerialize(listInstalled);

        return JSON.stringify(listToSerialize);
    }


    /**
     * This function serialize the list of latest plugin
     * @param listInstalled 
     */
    public serializeLatestPluginRepo(listInstalled?: any): string {

       let listToSerialize = this.getLatestPluginToSerialize(listInstalled);

        return JSON.stringify(listToSerialize);
    }

    /**
     * This function return list of latest plugin
     * @param listInstalled 
     * @return any
     */
    protected getLatestPluginToSerialize(listInstalled?: any): any {

        if(listInstalled != undefined || listInstalled != null) {
            this.convertPluginCfToPlugin(listInstalled);
        }
        let listToSerialize = [];
        this.getLatestPluginRepo().forEach(
            (plugin) => {
                listToSerialize.push(plugin.serialize());
            }
        );

        return listToSerialize;
    }

     /**
     * This function return list of latest template
     * @param listInstalled 
     * @return any
     */
    protected getLatestTemplateToSerialize(listInstalled?: any): any {

        if(listInstalled != undefined || listInstalled != null) {
            this.convertTemplateCfToTemplate(listInstalled);
        }
        let listToSerialize = [];
        this.getLatestTemplateRepo().forEach(
            (template) => {
                listToSerialize.push(template.serialize());
            }
        );

        return listToSerialize;
    }

    /**
     * This function return all Plugin Installed into CMS
     * @returns Plugin[]
     */
    public getListPluginInstalled(): Plugin[] {
        return this._listOfPluginInstalled;
    }

    /**
     * This function return all Template Installed into CMS
     * @returns Template[]
     */
    public getListTemplateInstalled(): Template[] {
        return this._listOfTemplateInstalled;
    }

    /**
     * This function set installed Plugin into CMS
     * @param installedPlugin Plugin[]
     */
    public setListPluginInstalled(installedPlugin: Plugin[]) {
        installedPlugin.forEach((plug) => {
            plug.packed = this.checkPluginIsPacked(plug);
        });
        this._listOfPluginInstalled = installedPlugin;
    }

    /**
     * This function set installed Template into CMS
     * @param installedTemplate Template[]
     */
    public setListTemplateInstalled(installedTemplate: Template[]) {
        installedTemplate.forEach(
            (temp) => {
                temp.packed = this.checkTemplateIsPacked(temp);
            }
        );
        this._listOfTemplateInstalled = installedTemplate;
    }

    /**
     * Install the Plugin from Folder compressed
     * @param plugin Plugin
     */
    public installPlugin(plugin: Plugin){
        plugin.decompress(this.depl,this.repo);

        this._listOfPluginInstalled.push(plugin);
        let index = this._latestPluginRepo.indexOf(plugin);

        if(index>-1) {
            this._latestPluginRepo[index].installed = true;
        }
    }

    /**
     * This Install the Template from folder compressed
     * @param template 
     */
    public installTemplate(template: Template) {
        template.decompress(this.deplt,this.repo);
        
        this._listOfTemplateInstalled.push(template);
        let index = this._latestTemplateRepo.indexOf(template);

        if(index > -1 ) {
            this._latestTemplateRepo[index].installed = true;
        } 
    }

    /**
     * Only erase Plugins Folder and maintain the compressedFile
     * @param plugin Plugin
     */
    public uninstallPlugin(plugin: Plugin){
        const dirPlug = this.depl+'/'+plugin.vendor+'/'+plugin.name;

        if(fs.existsSync(dirPlug)){
            let folderArray = fs.readdirSync(dirPlug);
            folderArray.forEach(
                (item)=>{
                    const dirItem = dirPlug+'/'+item;
                    let stat = fs.statSync(dirItem);
                    if(stat.isFile()){
                        fs.unlinkSync(dirItem);
                    }
                    else if(stat.isDirectory){
                        this.eraseDirectory(dirItem);
                    }
                });
                fs.rmdirSync(dirPlug);
        }
        

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
     * Only erase Template Folder and maintain the compressedFile
     * @param template Template
     */
    public uninstallTemplate(template: Template) {
        const dirPlug = this.deplt+'/'+template.vendor+'/'+template.name;

        if(fs.existsSync(dirPlug)){
            let folderArray = fs.readdirSync(dirPlug);
            folderArray.forEach(
                (item)=>{
                    const dirItem = dirPlug+'/'+item;
                    let stat = fs.statSync(dirItem);
                    if(stat.isFile()){
                        fs.unlinkSync(dirItem);
                    }
                    else if(stat.isDirectory){
                        this.eraseDirectory(dirItem);
                    }
                });
                fs.rmdirSync(dirPlug);
        }
        

        let folderVendor = fs.readdirSync(this.deplt+'/'+template.vendor);
        if(folderVendor.length == 0) {
            fs.rmdirSync(this.deplt+'/'+template.vendor);
        }
        //remove plugin into list of plugin installed
        this.removeItem(template,this._listOfTemplateInstalled);

        //find index into the list of plugin repo
        let indexRepo = this._latestTemplateRepo.indexOf(template);

        //if index exist, put the plugin installed to false
        if(indexRepo > -1) {
            this._latestTemplateRepo[indexRepo].installed = false;
        }
    }

    /**
     * Compress the Plugin into folder compressed
     * @param plugin Plugin
     */
    public packagePlugin(plugin: Plugin) {
        
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
     * This compress the Template into the .tgz file
     * @param template Template
     */
    public packageTemplate(template: Template) {
        if(! fs.existsSync(this.repo)) {
            fs.mkdirSync(this.repo);
        }

        template.cwd = this.cwdT;
        template.dirName = template.vendor+'/'+template.name;
        template.compress(this.repo);

        let indexInstall = this._listOfTemplateInstalled.indexOf(template);
        if(indexInstall > -1) {
            this._listOfTemplateInstalled[indexInstall].packed = true;
        }
    }

    /**
     * Erase the compressed file
     * @param plugin Plugin
     */
    public deletePlugin(plugin: Plugin) {
        // check if in installed plugin exist
        let indexIns = this._listOfPluginInstalled.indexOf(plugin);
        if(indexIns > -1) {
            this._listOfPluginInstalled[indexIns].packed = false;
        }
        //erase the compressed file
        let pathFile = this.repo+'/'+plugin.getPathToCompress();

        if(fs.existsSync(pathFile)) {
            fs.unlinkSync(pathFile);
            this._latestPluginRepo = [];
            this.getLatestPluginRepo();
        }
    }

    /**
     * this function erase compressed file
     * @param template Template
     */
    public deleteTemplate(template: Template) {
        let indexIns = this._listOfTemplateInstalled.indexOf(template);
        if(indexIns > -1) {
            this._listOfTemplateInstalled[indexIns].packed = false;
        }
        let pathFile = this.repo+'/'+template.getPathToCompress();

        if(fs.existsSync(pathFile)) {
            fs.unlinkSync(pathFile);
            this._latestTemplateRepo = [];
            this.getLatestTemplateRepo();
        }
    }

    /**
     * This function update Plugin
     * @param pluginOld Plugin
     * @param pluginNew Plugin
     */
    public updatePlugin(pluginOld: Plugin, pluginNew: Plugin) {
        //TODO
    }

    protected convertPluginCfToPlugin(list: any): void {
        list.forEach(element => {
            this._listOfPluginInstalled.push(new Plugin(element.name,element.vendor,element.version));
        });
    }

    protected convertTemplateCfToTemplate(list: any): void {
        list.forEach(element => {
            this._listOfTemplateInstalled.push(new Template(element.vendor,element.name,element.version));
        });
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
     * This function check if Templates are installed
     * @param arrayInfo 
     */
    protected checkIfTemplatesRepoInstalled(arrayInfo: Template[]): void {
        this._latestTemplateRepo.forEach((item)=> {
            arrayInfo.forEach((it)=>{
                if(it.name === item.name && it.vendor === item.vendor && it.version === item.version) {
                    item.installed = true;
                }
            });
        });
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
     
     return this.iterateTempArray(tempArray,secondTempArray); 
   }

   /**
    * This function need to compare differents array
    * @param tempArray1 
    * @param tempArray2 
    * @return AbstractPack[] 
    */
   protected iterateTempArray(tempArray1: AbstractPack[], tempArray2: AbstractPack[]): any[] {
    
    for(let i = 0; i<tempArray1.length; i++)
    {
        let item = tempArray1[i];
        let number = i+1;
    
        if(number<tempArray1.length)
        {
             for(number; number< tempArray1.length; number++)
             {
                 let item2 = tempArray1[number];
    
                 if(item2.vendor === item.vendor && item2.name === item.name)
                 {
                     this.compare(item,item2,tempArray2);
                 }
             }
        }
    }
    
    return tempArray2; 
   }

   /**
    * this function populate List of latest Template
    * @return Template[]
    */
   protected popListTemplate(): Template [] {
      //return Arrya from Folder
      let tempArray: Template[] = this.getArrayTempFromFolder();

      // clone the array of Plugin
      let secondTempArray = tempArray.slice();
    
      //Check for the Latest version
      return this.iterateTempArray(tempArray,secondTempArray); 
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
     * This function check if Plugin is Packed or Not
     * @param plugin Plugin
     */
    protected checkPluginIsPacked(plugin: Plugin) {
        return fs.existsSync(this.repo+'/'+plugin.getPathToCompress());
    }

    /**
     * This function check if Plugin is Packed or Not
     * @param template Template
     */
    protected checkTemplateIsPacked(template: Template) {
        return fs.existsSync(this.repo+'/'+template.getPathToCompress());
    }

    /**
     * This function return array from specific folder
     * @return Plugin[]
     */
    protected getArrayFromFolder(): Plugin[] {
        let arrayFile: Plugin[] = [];
        //read the folder, and store the Array of File
        let file = fs.readdirSync(this.repo);
        //iterate over array and Save into the temp Array a list Of Plugins
        file.forEach(
            (item) => {
                if(item != '.DS_Store') {
                    let obj = Plugin.createFromFile(item);
                    if(obj) {
                        obj.packed = true;
                        arrayFile.push(obj);
                    }
                } else {
                    fs.unlinkSync(this.repo+'/'+item);
                }
            }
        );

        return arrayFile;
    }

    protected getArrayTempFromFolder() : Template[] {
        let arrayFile: Template[] = [];
        //read the folder, and store the Array of File
        let file = fs.readdirSync(this.repo);
        //iterate over array and Save into the temp Array a list Of Plugins
        file.forEach(
            (item) => {
                if(item != '.DS_Store') {
                    let obj = Template.createFromFile(item);

                    if(obj) {
                        obj.packed = true;
                        arrayFile.push(obj);
                    }
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
    protected compare (a: AbstractPack, b: AbstractPack, array: AbstractPack[]): void
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
    protected removeItem(item: AbstractPack, array: AbstractPack[]) {
        let index = array.indexOf(item);
        
            if (index> -1) {
                array.splice(index,1);
            }
    }
}
