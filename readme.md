# @twreporter/gsx2json

Use command line to get spreadsheet data, sanitize it and save the result as a JSON file to google cloud storage.

We use this tool to update [about us page](https://www.twreporter.org/about-us).

## Install

```
// intsall globally
$ npm i -g @twreporter/gsx2json
```

## Usage

1. Make sure the target spreadsheet is publishly viewable to the web, using `File -> Publish To Web` in your Google Spreadsheet.
2. This package need google sheet api key & google cloud storage admin service account key file for auth.
  - get google sheet api key from [credentail page](https://console.cloud.google.com/apis/credentials)
  - store api key in .env file with key name API_KEY
  - get service account key file in GCP console
  - store key file path in .env file with key name GOOGLE_APPLICATION_CREDENTIALS
  - you can also auth cloud storage with other [methods](https://cloud.google.com/docs/authentication/getting-started)

### Update about-us page 

#### Command Line Help
```
// --help
$ about-us --help

```

```
Options:
  --id <spreadsheet>  google spreadsheet id (default: "16CVkhaSw5sxwjlSt1c0nLzxG7qzEmeO2gCymVsSY6PE"), required
  --sheetName <name>  target sheet name (default: "test"), required
  --section <index>   section index number (default: "5"), required
  --branch <branch>   git branch (one of "master", "staging", "release") (default: "master")
  -h, --help          display help for command
```

#### More about --section parameter

--section index will be used in two place:
- determine whether to group data or not (config-regulater)
- upload filename: section<section index>.<branch>.json

--section parameter should be corresbond with --sheetName parameter

#### Example: update section2 config for master branch (only for development)

```
$ about-us --section 2 --sheetName section-2 --branch master
```

When it is done, a new config file `section2.master.json` will be uploaded to gcs and replace the old one.
This file is required by [about us page](https://www.twreporter.org/about-us).

#### Example: update section3 config for release branch

```
$ about-us --section 3 --sheetName section-3 --branch release
```

When it is done, a new config file `section3.release.json` will be uploaded to gcs and replace the old one.

## Example data structure after sanitizing

There are one section to the returned data: Rows (containing each row of data as an object.)

```
{
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
