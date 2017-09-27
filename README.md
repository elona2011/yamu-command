nodejs实现的前端工程化命令行

[![Build Status](https://travis-ci.org/elona2011/yamu-command.svg?branch=master)](https://travis-ci.org/elona2011/yamu-command)

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

built default folder (/src to /built)

```
yamu built
```

if package.json has key ``npm_package_config_product_from`` and ``npm_package_config_product_to``,it will be built from ``npm_package_config_product_from`` to ``npm_package_config_product_to``.

built custom folder

```
yamu built [src] [dest]
```

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