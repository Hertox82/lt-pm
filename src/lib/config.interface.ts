
import * as fs from 'fs';
import * as process from 'process';

export interface ConfigFile {
    cwd: string,
    depl: string,
    repo: string,
    deplt?: string,
    cwdT?: string,
    template?: any,
    plugins?: any,

}

export function getConfigJSON(path: string): ConfigFile{
    let cf = JSON.parse(fs.readFileSync(path,'utf8'));
    cf.cwd = process.cwd()+'/'+cf.cwd;
    cf.repo = process.cwd()+'/'+cf.repo;
    cf.depl = process.cwd()+'/'+cf.depl;
    if(cf.deplt != null || cf.deplt != undefined) {
      cf.deplt = process.cwd()+'/'+cf.deplt;
    }
    if(cf.cwdT != null || cf.cwdT != undefined) {
      cf.cwdT = process.cwd()+'/'+cf.cwdT;
    }
    return cf as ConfigFile;
  }
  
 export function writeConfigJSON(path: string, content: ConfigFile) {
    content.cwd = content.cwd.replace(process.cwd()+'/','');
    content.repo = content.repo.replace(process.cwd()+'/','');
    content.depl = content.depl.replace(process.cwd()+'/','');
    if(content.deplt != null || content.deplt != undefined) {
      content.deplt = content.deplt.replace(process.cwd()+'/','');
    }
    if(content.cwdT != null || content.cwdT != undefined) {
      content.cwdT = content.cwdT.replace(process.cwd()+'/','');
    }
    const cf = JSON.stringify(content,null,4);
    fs.writeFileSync(path,cf,'utf8');
  }

  export function existFile(path: string): boolean {
    return fs.existsSync(path);
  }

  export function cwd(): string {
      return process.cwd();
  }


export function findMe(list: any,plug: any): number {
    let index = -1;
    for(let i=0; i<list.length; i++){
      if(list[i].vendor === plug.vendor && list[i].name === plug.name && list[i].version === plug.version) {
          index = i;
          break;
      }
    }
    return index;
  }