"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var tar = require("tar");
var Plugin = /** @class */ (function () {
    function Plugin(_name, _vendor, _version) {
        this._name = (_name != undefined) ? _name : '';
        this._vendor = (_vendor != undefined) ? _vendor : '';
        this._version = (_version != undefined) ? _version : '';
        this.installed = false;
        this.packed = true;
        this.splitVersion();
    }
    Object.defineProperty(Plugin.prototype, "dirName", {
        /**
         * This function get the Path of Plugin
         */
        get: function () {
            return this._dirName;
        },
        /**
         * This function set the Path of Plugin
         * @param thePath
         */
        set: function (thePath) {
            this._dirName = thePath;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Plugin.prototype, "cwd", {
        /**
         * This function return current working directory
         */
        get: function () {
            return this._cwd;
        },
        /**
         * This function set the current working directory
         * @param theCwd string
         */
        set: function (theCwd) {
            this._cwd = theCwd;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Plugin.prototype, "vendor", {
        /**
         *  This function get the Vendor
         */
        get: function () {
            return this._vendor;
        },
        /**
         * This function set the Vendor
         * @param theVendor
         */
        set: function (theVendor) {
            this._vendor = theVendor;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Plugin.prototype, "name", {
        /**
         * This function get the Name
         */
        get: function () {
            return this._name;
        },
        set: function (theName) {
            this._name = theName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Plugin.prototype, "version", {
        get: function () {
            return this._version;
        },
        set: function (theVersion) {
            this._version = theVersion;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * this function return a name of Plugin compressed
     */
    Plugin.prototype.getPathToCompress = function () {
        return this.vendor + '-' + this.name + '-' + this.version + '.tgz';
    };
    /**
     * This function return
     * @param path
     * @returns Plugin
     */
    Plugin.createPluginFromFile = function (path) {
        var multiPath = path.split('-', 3);
        var vendor = multiPath[0];
        var name = multiPath[1];
        var version = multiPath[2].replace('.tgz', '');
        return new Plugin(name, vendor, version);
    };
    /**
     * This function compress the Plugin
     */
    Plugin.prototype.compress = function (destPath) {
        var fileName = this.getPathToCompress();
        var pathToSave = destPath + '/' + fileName;
        tar.create({
            gzip: true,
            C: this.cwd
        }, [this.dirName]).pipe(fs.createWriteStream(pathToSave));
    };
    /**
     * This function decompress the Plugin into Specific folder
     * @param folderTo
     * @param folderFrom
     */
    Plugin.prototype.decompress = function (folderTo, folderFrom) {
        var fileToDecompress = folderFrom + '/' + this.getPathToCompress();
        fs.createReadStream(fileToDecompress).pipe(tar.x({
            C: folderTo
        }));
    };
    /**
     * This function split the Version into 3 chunk
     */
    Plugin.prototype.splitVersion = function () {
        if (this._version.length > 0) {
            var v = this._version.split('.', 3);
            this.major = v[0];
            this.minor = v[1];
            this.patch = v[2];
        }
        else {
            this.major = '';
            this.minor = '';
            this.patch = '';
        }
    };
    return Plugin;
}());
exports.Plugin = Plugin;
