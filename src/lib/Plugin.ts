
import * as fs from 'fs';
import * as path from 'path';
import * as tar from 'tar';

export class Plugin {
    protected name: string;
    protected vendor: string;
    protected version: string;
    private _dirName: string;
    private _cwd: string;

    constructor(_name?: string, _vendor?: string, _version?: string) {
        this.name = ( _name != undefined) ? _name : '';
        this.vendor = ( _vendor != undefined) ? _vendor : '';
        this.version = ( _version != undefined) ? _version : '';
    }

    /**
     * This function set the Path of Plugin
     * @param thePath
     */
    set dirName (thePath: string) {
        this._dirName = thePath;
    }

    /**
     * This function get the Path of Plugin
     */
    get dirName(): string {
        return this._dirName;
    }

    get cwd(): string {
        return this._cwd;
    }

    set cwd(theCwd: string) {
        this._cwd = theCwd;
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

        const fileToDecompress = folderFrom+this.getPathToCompress();
        fs.createReadStream(this.getPathToCompress()).pipe(
            tar.x({
                C: folderTo
            })
        );
    }
}