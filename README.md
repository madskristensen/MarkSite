## MarkSite - An ASP.NET based markdown CMS

### Use GitHub as the way to edit the pages

[![Build status](https://ci.appveyor.com/api/projects/status/os59p2cm7s2wk3sr?svg=true)](https://ci.appveyor.com/project/madskristensen/marksite)

[![Deploy to Azure](http://azuredeploy.net/deploybutton.png)](https://azuredeploy.net/)

Live demo: [vwd.azurewebsites.net](http://vwd.azurewebsites.net)

### Features

- Uses the folder structure to create the menu
- Convension based file/folder structure
- Each page has a link to `Edit this page on GitHub`
- Everything is configurable from `web.config`
- Semantic URLs
- Each `.md` file has a configurable section for setting:
	- Title
	- Description
	- Slug
	- Keywords
- AppVeyor integration
	- Automatically validates any pull request
	- Checks for missing metadata

### Getting started

The website itself is really simple. It only consist of a single
`index.cshtml` file. The entire site is build up around Markdown (`.md`) files
located inside the `pages` directory by default.

#### Folder structure

The folder structure determines how the menu is constructed as well as the
URLs to each page.

![Folder structure](https://raw.githubusercontent.com/madskristensen/MarkSite/master/art/folder-structure.png)

#### Metadata

Each `.md` file has a bit of metadata at the top that allows you to customize
various aspects of the file.

```HTML
<properties
	pageTitle="FTP"
	description="bla bla bla"
	slug="ftp"
	keywords="ftp, deploy"
/>

My markdown content goes here
```

__pageTitle__: The title of each page  
__description__: The description of each page  
__keywords__: A comma separated list of keywords  
__slug__: A Slug is what the URL should be

#### Validation

To help make sure that each pull request meets the requirements of the metadata,
the validator helps guide the contributors to write valid `.md` files for 
the MarkSite instance.

When using AppVeyor, each pull requests is automatically being build and the 
validator will automatically failed the build in case the pull request isn't
satisfying the validator.