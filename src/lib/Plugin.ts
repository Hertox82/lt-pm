
import * as fs from 'fs';
import * as path from 'path';
import * as tar from 'tar';
import * as chalk from 'chalk';
import { AbstractPack } from './AbstractPack';

export class Plugin extends AbstractPack{
    installed: boolean;
    packed: boolean;

    constructor(_name?: string, _vendor?: string, _version?: string) {
        super();
        this.installed = false;
        this.packed = true;
    }

    /**
     * This function serialize Plugin
     * @returns string
     */
    serialize(): any {
        let obj = {
            vendor: this._vendor,
            name: this._name,
            version: this._version,
            packed: this.packed,
            installed: this.installed
        };

        return obj;
    }

    /**
     * This function serialize Plugin for File Config
     * @returns {vendor: string, name: string, version: string}
     */
    serializeForConfig(): any {
        let obj = {
            vendor: this._vendor,
            name: this._name,
            version: this._version
        };

        return obj;
    }
    /**
     * this function return a name of Plugin compressed
     */
    getPathToCompress(): string {
        return this.vendor+'-'+this.name+'-'+this.version+'.tgz';
    }

    /**
     * This function return 
     * @param path 
     * @returns Plugin
     */
    static createPluginFromFile(path: string) : Plugin {

        let multiPath = path.split('-',3);
        if(multiPath.length != 3) {
            console.error(chalk.default.red('the pack is not well formatted, please try again!'));
            return null;
        }
        const vendor = multiPath[0];
        const name = multiPath[1];
        let version = multiPath[2].replace('.tgz','');

        return new Plugin(name,vendor,version);
    }

    /**
     * This function compress the Plugin
     */
    compress(destPath: string): void {
        const fileName = this.getPathToCompress();

        const pathToSave = destPath+'/'+fileName;
        tar.create({
            gzip: true,
            C: this.cwd
        },[this.dirName]).pipe(fs.createWriteStream(pathToSave));
    }


    /**
     * This function decompress the Plugin into Specific folder
     * @param folderTo 
     * @param folderFrom 
     */
    decompress(folderTo: string,folderFrom: string): void {

        const fileToDecompress = folderFrom+'/'+this.getPathToCompress();
        fs.createReadStream(fileToDecompress).pipe(
            tar.x({
                C: folderTo
            })
        );
    }

    /**
     * This function split the Version into 3 chunk
     */
    protected splitVersion(){
        if (this._version.length > 0) {
            let v = this._version.split('.',3);
            this.major = v[0];
            this.minor = v[1];
            this.patch = v[2];
        }
        else {
            this.major = '';
            this.minor = '';
            this.patch = '';
        }
    }
}