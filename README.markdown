# animas-diasend-data

parser for animas pump, cbg

## Install
[![Build Status](https://travis-ci.org/tidepool-org/animas-diasend-data.png?branch=master)](https://travis-ci.org/tidepool-org/animas-diasend-data)
[![Coverage Status](https://coveralls.io/repos/tidepool-org/animas-diasend-data/badge.png)](https://coveralls.io/r/tidepool-org/animas-diasend-data)
[![Code Climate](https://codeclimate.com/github/tidepool-org/animas-diasend-data.png)](https://codeclimate.com/github/tidepool-org/animas-diasend-data)
[![browser support](https://ci.testling.com/tidepool-org/animas-diasend-data.png)](https://ci.testling.com/tidepool-org/animas-diasend-data)

```bash
npm install animas-diasend-data
make test
```

## Usage
### CLI Commands

#### `animas-dump-json`
Print json version of Diasend spreadsheet.

```bash
$ ./bin/animas-dump-json <incoming.xls>
```


#### `download-diasend`
Download recent xls from diasend.
```bash
node ./bin/download-diasend [opts] <out.xls>

Options:
  -u, --username  Diasend username (or environment $DIASEND_USERNAME)
  -p, --password  Diasend password (or environment $DIASEND_PASSWORD)
  -d, --days      Number of recent days to fetch                       [default: 14]

```

Enable tab completion with: 
```bash
$ . <(download-diasend completion)
```

#### `sunder-csv`
Split binary spreadsheet into separate plain text csv files.
```bash
node ./bin/sunder-csv [opts] <incoming.xls>

Options:
  -s, --stdout  Print everything to stdout  [default: false]
  -p, --prefix  Prefix to store csv files   [default: ""]

```
Enable tab completion with: 
```bash
$ . <(sunder-csv completion)
```

