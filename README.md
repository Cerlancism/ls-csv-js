# ls-csv-js
 Util to list files and output as CSV in NodeJS

## Usage
```
Usage: ls-csv-js [options]

Options:
  -v, --version            output the version number
  -p, --path <paths...>    Add target directory (default: ["."])
  -f, --filter <types...>  Filter files by mime types (default: [])
  -h, --help               display help for command
```

## Examples
Display list of files in date, name, size as CSV

`ls-csv`

```
2021-04-18 08:21:41.659, README.md, 60
2021-04-18 08:21:41.667, .gitignore, 1181
2021-04-18 08:21:41.707, .gitattributes, 66
2021-04-18 08:35:03.613, LICENSE, 725
2021-04-19 02:22:28.335, package-lock.json, 12580
2021-04-19 02:25:38.871, package.json, 665
2021-04-19 03:03:34.615, jsconfig.json, 183
2021-04-19 03:33:35.946, types.ts, 153
2021-04-19 03:34:23.821, index.js, 1822
```

### Paths and mime Types
Include current directory, home directory and filter by text and json files.

`ls-csv -p . -p ~ -f text -f json`
