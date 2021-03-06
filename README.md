# JamesBond
![logo](media/logo.png)
## Cat 007 to the rescue
A tool to manage deployments from github.
With this tool you can:
* automatically pull code from a predefined branch using webhooks. 
* stage initial deploy on a machine
* update several paths at the same time

This tool was developed for light/simple production or development environments, not as a replacement for heavier deployment tools.

## Getting started
```
$ npm install -g jamesbond
```
Then to initially deploy do
```
$ jamesbond app deploy [githubUser/reponame] (optionally you can add #branch too)
```
this action will add an entry in the database, clone the repository (it will ask you where to) and run npm install

Now install and start the hook service:
```
$ jamesbond service install && jamesbond service start
```

if ndm does not support your system or is causing trouble, try [pm2](https://github.com/Unitech/PM2):
```
pm2 start path/to/bin/jamesbond --output=jamesbond.log -- hookserver start
```
## Command line tool

### service 
```
$ jamesbond service install / uninstall / start / stop / restart / 
```
Installs jamesbond service to listens for github hook events.
### app
#### deploy
```
$ jamesbond app deploy [githubUser/reponame#branch]
```
Deploys an app, the cli will prompt for additional information like webhook secret and deployment path if the application is new. If the application was already deployed this tool will do a git pull. 
The branch part of the key is optional. If you dont specify it, jamesbond will ask for the branch. 
When getting hook events from github, jamesbond will first load the app by its githubUser/reponame key, if its not found jamesbond will search for githubUser/repo#branch app, doing nothing there isn't an app with this name. When two or more apps exist in the database: githubUser/repo and githubUser/repo#branch, jamesbond will try loading githubUser/repo first, compare branches between the local database and the hook event data from github. If they dont match jamesbond will try to load the second app: githubUser/repo#branch.

This is a little complex, so this behaviour might change in the future to something simpler.
#### add
```
$ jamesbond app add [githubUser/reponame#branch]
```
Creates a new app in the database, the cli will prompt for missing information.
#### get
```
$ jamesbond app get [githubUser/reponame#branch]
```
prints the content of an app on the local database
#### delete
```
$ jamesbond app delete [githubUser/reponame#branch]
```
delete an app from the database
#### list
```
$ jamesbond app list
```
list all apps in the database

## Configuration
Jamesbond config is using [rc](http://github.com/dominictarr/rc). 

The jamesbond service has the following configuration options, that should reside in .jamesbondrc at the usual locations
```
{
    "logLevel": "INFO",  
    "db": "/some/path/",
    "port": 9001
}
```
for more details on logging system see [yalla](https://github.com/kessler/node-yalla)

## Hook events service
Jamesbond service is a web server that listens to hook events sent from github. The webapp itself is on a separate module:  [jamesbond-hookwebapp](https://github.com/kessler/node-jamesbond-hookwebapp) and is also usable as a standalone web application.

Service functionality is based on [ndm](http://npmjs.org/package/ndm)

### TODO: 
* automatically create webhook in github if we have permissions when adding an application
* add support for specifying multiple events from cli prompt
* add support for specifying multiple path from cli prompt
* document parameters
* enhance and document programmatic usage
* implement an [axon](https://github.com/tj/axon) based agent