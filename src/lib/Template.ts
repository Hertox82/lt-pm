import { AbstractPack } from "./AbstractPack";
import * as chalk from 'chalk';
import * as tar from 'tar';
import * as fs from 'fs';
import * as path from 'path';

export class Template extends AbstractPack {

    protected _active: boolean;
    /**
     * This method instantiate a Template from a filename
     * @param path string
     */
    static createFromFile(path: string): Template {
        let regex = /_t/g;
    
        if (regex.test(path)) {
            let multiPath = path.split('-', 3);
            if (multiPath.length != 3) {
                console.error(chalk.default.red('the pack is not well formatted, please try again!'));
                return null;
            }
            const vendor = multiPath[0];
            const name = multiPath[1];
            let version = multiPath[2].replace('_t.tgz', '');

            return new Template(vendor, name, version);
        }
        return null;
    }

    /**
     * this function return a name of Template compressed
     * @returns string
     */
    public getPathToCompress(): string {
        return this._vendor + '-' + this.name + '-' + this._version + '_t.tgz';
    }

    /**
     * This function serialize Template for File Config
     * @returns {vendor: string, name: string, version: string}
     */
    serializeForConfig(): any {
        let obj = {
            vendor: this._vendor,
            name: this._name,
            version: this._version,
            active: this._active,
        };

        return obj;
    }

    /**
     * This function set Active false/true the Template
     * @param active 
     */
    public setActive(active: boolean) {
        this._active = active;
    }
}