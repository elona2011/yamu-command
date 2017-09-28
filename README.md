a simple nodejs scaffold

[![npm](https://img.shields.io/npm/v/yamu.svg)](https://www.npmjs.com/package/yamu)
[![Build Status](https://travis-ci.org/elona2011/yamu-command.svg?branch=master)](https://travis-ci.org/elona2011/yamu-command)
[![Coverage Status](https://coveralls.io/repos/github/elona2011/yamu-command/badge.svg?branch=master)](https://coveralls.io/github/elona2011/yamu-command?branch=master)

# Features

* http server with auto reloading
* file watching and compiling
* support typescript
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

## server

```
yamu server 
yamu server <path>
```

## built

### built default folder (/src to /built)

```
yamu built
```

If package.json has key ``npm_package_config_product_from`` and ``npm_package_config_product_to``,it will be built from ``npm_package_config_product_from`` to ``npm_package_config_product_to``.

### built custom folder

```
yamu built [src] [dest]
```

This will change two keys in tsconfig.json file ('outDir' and 'include')

## postCss

pcss

```
yamu pcss -f path/to/file.pcss
yamu pcss -w path/to/file.pcss
```

## others

npmrc

```
yamu npmrc
```

version

```
yamu -V
yamu --version
```