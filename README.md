# lt-pm

This is a Lortom Package Manager and allows to manage all package of Lortom CMS.

Please read the [documentation](https://github.com/Hertox82/lt-pm/wiki)

| versione | Typescript Support |
| :-------------: |:-------------------------:|
|      ^2.x.x       |         ~2.3.3          |
|      ~3.0.x       |        ^2.4.2           |
|      ~3.1.x       |        ~2.9.2           |

## CHANGE LOG

**v 3.1.0**

- This version support typescript ~2.9.2
- Updated tar version ~4.4.13

**v 3.0.0**

- This version support typescript from ^2.4.2

**v 2.1.2**

- Fixed error when uninstall a template


**v 2.1.1**

- Fixed error when output the json on latest-plugin and latest-template

**v 2.1.0**

- Modified result of `latest` command, now the output is JSON with Plugins and Templates
- Added `latest-plugin` command, get the latest plugin packed.

**v 2.0.0**

- Changed into file configuration the Type of Template: Now is a List of Template and not more a Simple Object
- Added new commands `activate-t` and `deactivate-t` in order to Activate or Deactivate a Template

**v 1.0.0**

- Change class from PluginManager to PackageManager
- Implemented command to install Template
- Implemented command to uninstall Template
- Implemented command to package Template
- Implemented command to delete package of Template

**v 0.4.1**

- Fixed bug on Uninstall command

**v 0.4.0**

- Added new commands `latest` and `init`;
- Removed the `.js` file for configuration file
- Added function API for PluginManager `serializeLatestPluginRepo()`

## TODO LIST

- [x] Template Manager
- [ ]  PluginManger
  - [ ] Update Plugin







[Hernan Ariel De Luca](https://www.linkedin.com/in/hernan-ariel-de-luca-23842254/)
