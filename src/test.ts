import * as path from 'path'; 
import * as fs from 'fs';
import {Plugin} from './lib/Plugin';

let decompress = false;

const cwd = path.resolve(__dirname+'/../');
console.log(cwd);
if(!decompress) {

const plugin = new Plugin('Website','Hardel','1.0.0');

plugin.cwd = cwd;
plugin.dirName = 'tozip';
plugin.compress(cwd);

} else {
    const plugin = Plugin.createPluginFromFile('Hardel-Website-1.0.0.tgz');
    plugin.decompress('folderToUnzip',cwd);
}