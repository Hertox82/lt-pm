import * as path from 'path'; 
import * as fs from 'fs';
import {Plugin} from '../src/lib/Plugin';

let decompress = true;

const cwd = path.resolve(__dirname+'/../test/plugins');
const compr = path.resolve(__dirname+'/../test/compressed');
const depl = path.resolve(__dirname+'/../test/toDeploy');
console.log(cwd);
console.log(compr);
console.log(depl);

if(!decompress) {
const plugin1 = new Plugin('namePlugin','vendor1','1.0.0');
const plugin2 = new Plugin('namePlugin2','vendor1','1.0.0');

plugin1.cwd = cwd;
plugin1.dirName = 'vendor1/namePlugin';
plugin1.compress(compr);
plugin2.cwd = cwd;
plugin2.dirName = 'vendor1/namePlugin2';
plugin2.compress(compr);
} else {
    const plugin1 = Plugin.createPluginFromFile('vendor1-namePlugin-1.0.0.tgz');
    const plugin2 = Plugin.createPluginFromFile('vendor1-namePlugin2-1.0.0.tgz');

    plugin1.decompress(depl,compr);
    plugin2.decompress(depl,compr);
}
/*if(!decompress) {

const plugin = new Plugin('Website','Hardel','1.0.0');

plugin.cwd = cwd;
plugin.dirName = 'tozip';
plugin.compress(cwd);

} else {
    const plugin = Plugin.createPluginFromFile('Hardel-Website-1.0.0.tgz');
    plugin.decompress('folderToUnzip',cwd);
}*/