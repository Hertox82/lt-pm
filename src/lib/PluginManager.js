"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var Plugin_1 = require("./Plugin");
var PluginManager = /** @class */ (function () {
    function PluginManager(repositoryPath, cwd, depl) {
        // initialize all variable
        this.repo = repositoryPath;
        this.cwd = cwd;
        this.depl = depl;
        this._latestPluginRepo = [];
        this._listOfPluginInstalled = [];
    }
    /**
     * This function return a List of Latest Plugin avaiable
     * @param listOfInfo Plugin[]
     * @return Plugin[]
     */
    PluginManager.prototype.getLatestPluginRepo = function () {
        // if latest plugin repo is not undefined
        if (this._latestPluginRepo == undefined || this._latestPluginRepo.length == 0) {
            this._latestPluginRepo = this.populateList();
        }
        // check if installed Plugin list 
        if (this._listOfPluginInstalled.length != 0) {
            this.checkIfPluginsRepoInstalled(this._listOfPluginInstalled);
        }
        return this._latestPluginRepo;
    };
    /**
     * This function return all Plugin Installed into CMS
     * @returns Plugin[]
     */
    PluginManager.prototype.getListPluginInstalled = function () {
        return this._listOfPluginInstalled;
    };
    /**
     * This function set installed Plugin into CMS
     * @param installedPlugin Plugin[]
     */
    PluginManager.prototype.setListPluginInstalled = function (installedPlugin) {
        var _this = this;
        installedPlugin.forEach(function (plug) {
            plug.packed = _this.checkPluginIsPacked(plug);
        });
        this._listOfPluginInstalled = installedPlugin;
    };
    /**
     * Install the Plugin from Folder compressed
     * @param plugin Plugin
     */
    PluginManager.prototype.installPlugin = function (plugin) {
        plugin.decompress(this.depl, this.repo);
        this._listOfPluginInstalled.push(plugin);
        var index = this._latestPluginRepo.indexOf(plugin);
        if (index > -1) {
            this._latestPluginRepo[index].installed = true;
        }
    };
    /**
     * Only erase Plugins Folder and maintain the compressedFile
     * @param plugin Plugin
     */
    PluginManager.prototype.uninstallPlugin = function (plugin) {
        var _this = this;
        var dirPlug = this.depl + '/' + plugin.vendor + '/' + plugin.name;
        if (fs.existsSync(dirPlug)) {
            var folderArray = fs.readdirSync(dirPlug);
            folderArray.forEach(function (item) {
                var dirItem = dirPlug + '/' + item;
                var stat = fs.statSync(dirItem);
                if (stat.isFile) {
                    fs.unlinkSync(dirItem);
                }
                else if (stat.isDirectory) {
                    _this.eraseDirectory(dirItem);
                }
            });
        }
        fs.rmdirSync(dirPlug);
        var folderVendor = fs.readdirSync(this.depl + '/' + plugin.vendor);
        if (folderVendor.length == 0) {
            fs.rmdirSync(this.depl + '/' + plugin.vendor);
        }
        //remove plugin into list of plugin installed
        this.removeItem(plugin, this._listOfPluginInstalled);
        //find index into the list of plugin repo
        var indexRepo = this._latestPluginRepo.indexOf(plugin);
        //if index exist, put the plugin installed to false
        if (indexRepo > -1) {
            this._latestPluginRepo[indexRepo].installed = false;
        }
    };
    /**
     * Compress the Plugin into folder compressed
     * @param plugin Plugin
     */
    PluginManager.prototype.packagePlugin = function (plugin) {
        if (!fs.existsSync(this.repo)) {
            fs.mkdirSync(this.repo);
        }
        plugin.cwd = this.cwd;
        plugin.dirName = plugin.vendor + '/' + plugin.name;
        plugin.compress(this.repo);
        var indexInstall = this._listOfPluginInstalled.indexOf(plugin);
        if (indexInstall > -1) {
            this._listOfPluginInstalled[indexInstall].packed = true;
        }
    };
    /**
     * Erase the compressed file
     * @param plugin Plugin
     */
    PluginManager.prototype.deletePlugin = function (plugin) {
        // check if in installed plugin exist
        var indexIns = this._listOfPluginInstalled.indexOf(plugin);
        if (indexIns > -1) {
            this._listOfPluginInstalled[indexIns].packed = false;
        }
        //erase the compressed file
        var pathFile = this.repo + '/' + plugin.getPathToCompress();
        if (fs.existsSync(pathFile)) {
            fs.unlinkSync(pathFile);
            this._latestPluginRepo = [];
            this.getLatestPluginRepo();
        }
    };
    /**
     * This function update Plugin
     * @param pluginOld Plugin
     * @param pluginNew Plugin
     */
    PluginManager.prototype.updatePlugin = function (pluginOld, pluginNew) {
        //TODO
    };
    /**
     * This function check if Plugins are installed
     * @param arrayInfo
     */
    PluginManager.prototype.checkIfPluginsRepoInstalled = function (arrayInfo) {
        this._latestPluginRepo.forEach(function (item) {
            arrayInfo.forEach((function (it) {
                if (it.name === item.name && it.vendor === item.vendor && it.version === item.version) {
                    item.installed = true;
                }
            }));
        });
    };
    /**
     * This function populate list of Plugin
     * @return Plugin[]
     */
    PluginManager.prototype.populateList = function () {
        //return Arrya from Folder
        var tempArray = this.getArrayFromFolder();
        // clone the array of Plugin
        var secondTempArray = tempArray.slice();
        //Check for the Latest version
        for (var i = 0; i < tempArray.length; i++) {
            var item = tempArray[i];
            var number = i + 1;
            if (number < tempArray.length) {
                for (number; number < tempArray.length; number++) {
                    var item2 = tempArray[number];
                    if (item2.vendor === item.vendor && item2.name === item.name) {
                        this.compare(item, item2, secondTempArray);
                    }
                }
            }
        }
        return secondTempArray;
    };
    /**
     * This Function
     * @param dirPath string
     */
    PluginManager.prototype.eraseDirectory = function (dirPath) {
        var _this = this;
        var folderArray = fs.readdirSync(dirPath);
        folderArray.forEach(function (item) {
            var dirItem = dirPath + '/' + item;
            var stat = fs.statSync(dirItem);
            if (stat.isFile) {
                fs.unlinkSync(dirItem);
            }
            else if (stat.isDirectory) {
                _this.eraseDirectory(dirItem);
            }
        });
        fs.rmdirSync(dirPath);
    };
    /**
     * This function check if Plugin is Packed or Not
     * @param plugin Plugin
     */
    PluginManager.prototype.checkPluginIsPacked = function (plugin) {
        return fs.existsSync(this.repo + '/' + plugin.getPathToCompress());
    };
    /**
     * This function return array from specific folder
     * @return Plugin[]
     */
    PluginManager.prototype.getArrayFromFolder = function () {
        var _this = this;
        var arrayFile = [];
        //read the folder, and store the Array of File
        var file = fs.readdirSync(this.repo);
        //iterate over array and Save into the temp Array a list Of Plugins
        file.forEach(function (item) {
            if (item != '.DS_Store') {
                var obj = Plugin_1.Plugin.createPluginFromFile(item);
                obj.packed = true;
                arrayFile.push(obj);
            }
            else {
                fs.unlinkSync(_this.repo + '/' + item);
            }
        });
        return arrayFile;
    };
    /**
     * This function compare two Plugin
     * @param a
     * @param b
     * @param array
     */
    PluginManager.prototype.compare = function (a, b, array) {
        if (a.major === b.major) {
            if (a.minor === b.minor) {
                if (a.patch < b.patch) {
                    this.removeItem(a, array);
                }
                else if (a.patch > b.patch) {
                    this.removeItem(b, array);
                }
            }
            else if (a.minor < b.minor) {
                this.removeItem(a, array);
            }
            else {
                this.removeItem(b, array);
            }
        }
        else if (a.major < b.major) {
            this.removeItem(a, array);
        }
        else {
            this.removeItem(b, array);
        }
    };
    /**
     * This function remove Item from array
     * @param item
     * @param array
     */
    PluginManager.prototype.removeItem = function (item, array) {
        var index = array.indexOf(item);
        if (index > -1) {
            array.splice(index, 1);
        }
    };
    return PluginManager;
}());
exports.PluginManager = PluginManager;
