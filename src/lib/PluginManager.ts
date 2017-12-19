import * as fs from 'fs';
import * as path from 'path';
import { Plugin } from './Plugin';

export class PluginManager {

    repo: string;
    _listOfPlugin: Plugin[];

    constructor(repositoryPath: string) {
        this.repo = repositoryPath;
        this._listOfPlugin = [];
    }

    /**
     * This function return a List of Latest Plugin avaiable
     */
    getListOfLatestPlugin(): Plugin[] {
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
       this._listOfPlugin = secondTempArray;
        
       return this._listOfPlugin;
    }

    /**
     * This function check if Plugins are installed
     * @param arrayInfo 
     */
    checkIfPluginsInstalled(arrayInfo: {vendor:string, name: string}[]): void {

        this._listOfPlugin.forEach((item) => {
            arrayInfo.forEach((it => {
                if(it.name === item.name && it.vendor === item.vendor) {
                    item.installed = true;
                }
            }))
        });
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
                arrayFile.push(Plugin.createPluginFromFile(item));
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