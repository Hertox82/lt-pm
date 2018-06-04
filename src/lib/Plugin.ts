

import * as chalk from 'chalk';
import { AbstractPack } from './AbstractPack';

export class Plugin extends AbstractPack {

    constructor(_name?: string, _vendor?: string, _version?: string) {
        super(_vendor, _name, _version);
        this.installed = false;
        this.packed = true;
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
        return this.vendor + '-' + this.name + '-' + this.version + '.tgz';
    }

    /**
     * This function return 
     * @param path 
     * @returns Plugin
     */
    static createFromFile(path: string): Plugin {
        let regex = /_t/g;

        if (!regex.test(path)) {
            let multiPath = path.split('-', 3);
            if (multiPath.length != 3) {
                console.error(chalk.default.red('the pack is not well formatted, please try again!'));
                return null;
            }
            const vendor = multiPath[0];
            const name = multiPath[1];
            let version = multiPath[2].replace('.tgz', '');

            return new Plugin(name, vendor, version);
        }
        else {
            return null;
        }
    }
}