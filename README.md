# 口袋48成员直播抓取+多开客户端

## 软件下载链接
进入到[https://github.com/duan602728596/document/tree/master/48](https://github.com/duan602728596/document/tree/master/48)下载

## 功能
* 成员直播录源
* 成员直播多开

## 编译命令
* 输入命令 `$ npm start` 运行开发环境。
* 输入命令 `$ npm build` 编译到文件夹。
* 输入命令 `$ npm run devdll` 编译开发环境dll文件。
* 输入命令 `$ npm run prodll` 编译生产环境编译dll文件。
* 输入命令 `$ npm run npmi` 或 `$ yarn run yarni` 安装生产环境依赖。

## nwjs中文文档
[https://wizardforcel.gitbooks.io/nwjs-doc/content/wiki/index.html](https://wizardforcel.gitbooks.io/nwjs-doc/content/wiki/index.html)

## 谷歌扩展
* 教程参考：[http://www.ituring.com.cn/book/1421](http://www.ituring.com.cn/book/1421)
* api文档：[https://developer.chrome.com/extensions/api_index](https://developer.chrome.com/extensions/api_index)

## 文件夹结构
* nwjs: nwjs SDK
  * app: 源代码
  * dependent: 依赖的文件存储目录
    * ffmpeg: ffmpeg
  * output: 视频文件的输出目录

## 关于dll
无论是开发环境还是生产环境，首先要编译dll文件，将公共模块提取出来。

## 关于node-sass
node-sass如果安装失败，可以先到[https://github.com/sass/node-sass/releases](https://github.com/sass/node-sass/releases)下载binding.node文件，然后将该文件添加到SASS_BINARY_PATH环境变量内。

## video无法观看的解决办法
请到[https://github.com/iteufel/nwjs-ffmpeg-prebuilt/releases](https://github.com/iteufel/nwjs-ffmpeg-prebuilt/releases)地址下载对应的ffmpeg.dll并覆盖到源目录中

## 源代码托管地址
[https://github.com/duan602728596/koudai48LiveCatch](https://github.com/duan602728596/koudai48LiveCatch)

## 源文件编译方法
[https://github.com/duan602728596/48tools/tree/use](https://github.com/duan602728596/48tools/tree/use)