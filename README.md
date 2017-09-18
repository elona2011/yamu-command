nodejs实现的前端工程化命令行

[![Build Status](https://travis-ci.org/elona2011/yamu-command.svg?branch=master)](https://travis-ci.org/elona2011/yamu-command)

# Features

* http server with auto reloading
* css file watching and compiling
* template
* produce a static website

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
    "scripts":{
        "pcss": "pcss",
        "tpl": "tpl",
        "server": "server",
        "product": "product"
    },
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

```
yamu server 
yamu server -d <path>
yamu product //生成静态网页
yamu npmrc 
```