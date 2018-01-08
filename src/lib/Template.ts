import { AbstractPack } from "./AbstractPack";
import * as chalk from 'chalk';
import * as tar from 'tar';
import * as fs from 'fs';
import * as path from 'path';

export class Template extends AbstractPack{
 
    packed: boolean = false;
    static createFromFile(path: string) {
        let regex =/_t/g ;

        if(regex.test(path)) {
            let multiPath = path.split('-',3);
            if(multiPath.length != 3) {
                console.error(chalk.default.red('the pack is not well formatted, please try again!'));
                return null;
            }
            const vendor = multiPath[0];
            const name = multiPath[1];
            let version = multiPath[2].replace('_t.tgz','');

            return new Template(vendor,name,version);
        }

        return null;
    }

    /**
     * this function return a name of Plugin compressed
     */
    public getPathToCompress(): string {
        return this._vendor+'-'+this.name+'-'+this._version+'_t.tgz';
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

    serialize() {
        let obj = {
            vendor: this._vendor,
            name: this._name,
            version: this._version,
            packed: this.packed
        };

        return obj;
    }
}