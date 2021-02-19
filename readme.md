# @twreporter/gsx2json

Use command line to get spreadsheet data, sanitize it and save the result as a JSON file to google cloud storage.

We use this tool to update [about us page](https://www.twreporter.org/about-us).

## Install

```
// intsall globally
$ npm i -g @twreporter/gsx2json
```

## Usage

First, make sure the target spreadsheet is published to the web, using `File -> Publish To Web` in your Google Spreadsheet.

### Update about-us page 

#### Command Line Help
```
// --help
$ about-us --help

```

```
Options:
  --id <spreadsheet>  google spreadsheet id (default: "16CVkhaSw5sxwjlSt1c0nLzxG7qzEmeO2gCymVsSY6PE")
  --section <index>   section index number (default: "2")
  --branch <branch>   git branch (one of "master", "staging", "release") (default: "master")
  -h, --help          display help for command
```

#### Example: update section2 config for master branch (only for development)

```
$ about-us --section 2 --branch master
```

When it is done, a new config file `section2.master.json` will be uploaded to gcs and replace the old one.
This file is required by [about us page](https://www.twreporter.org/about-us).

#### Example: update section3 config for release branch

```
$ about-us --section 3 --branch release
```

When it is done, a new config file `section3.release.json` will be uploaded to gcs and replace the old one.

## Example data structure after sanitizing

There are two sections to the returned data - Columns (containing the names of each column), and Rows (containing each row of data as an object.

```
{
	columns: [
		"Name",
		"Age"
	],
	rows: [
		{
		name: "Nick",
		age: "21"
		},
		{
		name: "Chris ",
		age: "27"
		},
		{
		name: "Barry",
		age: "67"
		}
	]
}

```
