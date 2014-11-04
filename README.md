# JamesBond (WIP)
![logo](media/logo.png)
## Cat 007 to the rescue
A tool to manage deployments from github.
With this tool you can:
* automatically pull code from a predefined branch using webhooks. 
* stage initial deploy on a machine
* update several paths at the same time

## Hook events server
A web server that listens to hook events sent from github. Repository secret, remote url and branch can we added through the cli
Also usable as a standalone web application, see [jamesbond-hookwebapp](https://github.com/kessler/node-jamesbond-hookwebapp)

## Command line tool

#### install service
```
$ jamesbond install service
```
Installs a web server that listens to github hook events.
#### deploy
```
$ jamesbond deploy [name]
```
Deploys an app, if it doesn't exist in the database, the cli will prompt for all the information needed and then clone it from github
#### add
```
$ jamesbond add [name]
```
Creates a new app in the database, the cli will prompt for missing information.
#### get
```
$ jamesbond get [name]
```
prints the content of an app on the local database
#### list
```
$ jamesbond list
```
list all apps in the database
#### delete
```
$ jamesbond delete [name]
```
delete an app from the database

### TODO: 
automatically create webhook in github if we have permissions when adding an application
add support for specifying multiple events from cli prompt
add support for specifying multiple path from cli prompt
document parameters
enhance and document programmatic usage
implement an [axon](https://github.com/tj/axon) based agent