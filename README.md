nodejs实现的前端工程化命令行

# feature

* http server with auto reloading
* css file watching and compiling
* template
* produce a static website

# install

```
npm i -g yamu
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

# command line

```
yamu server 
yamu server -d <path>
yamu product //生成静态网页
yamu npmrc 
```