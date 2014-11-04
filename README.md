# JamesBond 
![logo](media/logo.png)

A set if tools to manage deployment from github. Currently works only on local file system, but an [axon](https://github.com/tj/axon) based agent is also planned

## Hook events server
A web server that listens to hook events sent from github. Repository secret, remote url and branch can we added through the cli
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
TODO: 
automatically create webhook in github if we have permissions
add support for events
document parameters
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

