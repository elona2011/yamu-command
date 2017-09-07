nodejs实现的前端工程化命令行

# feature

* http server with auto reloading
* css file watching and compiling
* template
* produce a static website

# install

```
npm install yamu --save-dev
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
npm run server //=== npm run server -- -d src/d3
npm run server -- -d <path>
npm run product //生成静态网页
```