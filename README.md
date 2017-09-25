nodejs实现的前端工程化命令行

[![Build Status](https://travis-ci.org/elona2011/yamu-command.svg?branch=master)](https://travis-ci.org/elona2011/yamu-command)

# Features

* http server with auto reloading
* css file watching and compiling
* template
* produce a static website
* ts-node unit test

# Install

```
npm i -g yamu
yarn global add yamu
```

# config default setting

package.json

```
{
    ...
    "config": {
        "dir: "src/d3", //default server folder
        "product": {
            "from": "browser"
        }
    }
    ...
}
```

# Usage

server

```
yamu server 
yamu server -d <path>
```

pcss

```
yamu pcss -f path/to/file.pcss
yamu pcss -w path/to/file.pcss
```

npmrc

```
yamu npmrc
```