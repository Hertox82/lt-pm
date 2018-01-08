

export class AbstractPack {
    protected _name: string;
    protected _vendor: string;
    protected _version: string;
    protected _dirName: string;
    protected _cwd: string;

    major: string;
    minor: string;
    patch: string;
    
    constructor(vendor?: string, name?: string, version?: string) {
        this._name = ( name != undefined) ? name : '';
        this._vendor = ( vendor != undefined) ? vendor : '';
        this._version = ( version != undefined) ? version : '';

        this.splitVersion();
    }

    /**
     * This set name
     * @param theName string
     */
    set name(theName: string) {
        this._name = theName;
    }

    /**
     * this get name
     * @return string
     */
    get name() {
        return this._name; 
    }

    /**
     * This set vendor
     * @param theVendor string
     */
    set vendor(theVendor: string) {
        this._vendor = theVendor;
    }
    /**
     * This get vendor
     */
    get vendor() {
        return this._vendor;
    }
    /**
     * This set version
     * @param theVersion string
     */
    set version(theVersion: string) {
        this._version = theVersion;
    }

    /**
     * This get version
     */
    get version() {
        return this._version;
    }

    /**
     * This set cwd
     * @param theCwd string
     */
    set cwd(theCwd: string) {
        this._cwd = theCwd;
    }

    /**
     * This get cwd
     */
    get cwd() {
        return this._cwd;
    }

    /**
     * This set dirName
     * @param theDirName string
     */
    set dirName(theDirName: string) {
        this._dirName = theDirName;
    }

    /**
     * This get dirName
     */
    get dirName() {
        return this._dirName;
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