## MarkSite - An ASP.NET based markdown CMS

#### Use GitHub as the way to edit the pages

[![Build status](https://ci.appveyor.com/api/projects/status/os59p2cm7s2wk3sr?svg=true)](https://ci.appveyor.com/project/madskristensen/marksite)

[![Deploy to Azure](http://azuredeploy.net/deploybutton.png)](https://azuredeploy.net/)

Live demo: [vwd.azurewebsites.net](http://vwd.azurewebsites.net)

#### Features

- Uses the folder structure to create the menu
- Convension based file/folder structure
- Each page has a link to `Edit this page on GitHub`
- Everything is configurable from `web.config`
- Each `.md` file has a configurable section for setting:
	- Title
	- Description
	- Slug
	- Keywords
- AppVeyor integration
	- Automatically validates any pull request
	- Checks for missing metadata

#### Getting started

The website itself is really simple. It only consist of a single `index.cshtml` file
