/**
 * Created by Ian on 2014/8/10.
 * 优化
 */

;
(function (factory) {
    "use strict";
    if (typeof define === "function" && define.amd) {
        define("BS.b$", ["jquery"], function () {
            return factory(jQuery || $)
        })
    } else {
        factory(jQuery || $);
    }

    if (typeof module === "object" && typeof module.exports === "object") {
        module.exports = factory(jQuery || $)
    }

}(function ($) {
    "use strict";

    (function () {
        window['BS'] = window['BS'] || {};
        window.BS.b$ = window.BS.b$ || {};
    })();

    (function ($) {
        $.toJSON = $.toJSON || JSON.stringify;
        var b$ = {};
        b$ = $.extend(window.BS.b$, {});
        b$.pN = b$.pNative = (typeof maccocojs !== 'undefined') && (maccocojs); // 本地引擎

        // 定义临时回调处理函数定义接口
        b$._ncb_idx = 0;
        b$._get_callback = function (func, noDelete) {
            window._nativeCallback = window._nativeCallback || {};
            var _nativeCallback = window._nativeCallback;
            var r = 'ncb' + b$._ncb_idx++;
            _nativeCallback[r] = function () {
                try {
                    if (!noDelete) {
                        delete _nativeCallback[r];
                    }
                } catch (e) {
                    console.error(e)
                }
                func && func.apply(null, arguments);
            };
            return '_nativeCallback.' + r;
        };

        b$.cb_execTaskUpdateInfo = null; //执行任务的回调
        b$.pCorePlugin = { //核心处理引导插件部分,尽量不要修改
            useThread: true,
            passBack: "BS.b$.cb_execTaskUpdateInfo",
            packageMode: 'bundle',
            taskToolPath: "/Plugins/extendLoader.bundle",
            bundleClassName: "LibCommonInterface"
        };

        b$.pIAPPlugin = {
            path: "/plugin.iap.bundle"
        };

        // IAP 功能封装
        b$.cb_handleIAPCallback = null; // IAP的回调函数
        b$.IAP = {
            enableIAP: function (parms) {
                if (b$.pN) {
                    try {
                        //注册IAP回调
                        b$.pN.iap.regeditIAPCallbackJs(parms.cb_IAP_js || "BS.b$.cb_handleIAPCallback");

                        //注册IAPBundle
                        b$.pN.iap.regeditIAPCore($.toJSON({
                            path: b$.getAppPluginDir() + b$.pIAPPlugin.path
                        }));

                        //看看是否可以购买
                        if (b$.pN.iap.canMakePayments()) {
                            //启动服务
                            b$.pN.iap.startIAPService();

                            //发送商品请求
                            b$.pN.iap.requestProducts($.toJSON({
                                productIdentifiers: parms.productIds || []
                            }));
                        }
                    } catch (e) {
                        console.error(e);
                    }

                }
            },

            restore: function () {
                if (b$.pN) {
                    //发送购买请求
                    b$.pN.iap.restoreIAP();
                }
            },

            buyProduct: function (parms) {
                if (b$.pN) {
                    //发送购买请求
                    b$.pN.iap.buyProduct($.toJSON({
                        identifier: parms.productIdentifier,
                        quantity: parms.quantity || 1
                    }));
                }
            },

            getPrice: function (productIdentifier) {
                if (b$.pN) {
                    return b$.pN.iap.getPrice(productIdentifier);
                }

                return "";
            },

            getUseableProductCount: function (productIdentifier) {
                if (b$.pN) {
                    return b$.pN.iap.getUseableProductCount(productIdentifier);
                }

                return 0;
            },

            setUseableProductCount: function (jsonObj) {
                if (b$.pN) {
                    var params = {
                        identifier: jsonObj.productIdentifier || '',
                        quantity: jsonObj.quantity || 1
                    };
                    return b$.pN.iap.setUseableProductCount($.toJSON(params));
                }

                return 0;
            },

            add1Useable: function (productIdentifier) {
                if (b$.pN) {
                    return b$.pN.iap.add1Useable(productIdentifier);
                }

                return 0;
            },

            sub1Useable: function (productIdentifier) {
                if (b$.pN) {
                    return b$.pN.iap.sub1Useable(productIdentifier);
                }

                return 0;
            }
        };

        /**
         * Notice 内容封装
         */
        b$.Notice = {
            alert: function (jsonObj) {
                if (b$.pN) {
                    var params = {
                        message: jsonObj.message || 'Tip',
                        title: jsonObj.title || 'title',
                        buttons: jsonObj.buttons || ['Ok'],
                        alertType: jsonObj.alertType || 'Alert'
                    };

                    return b$.pN.notice.alert($.toJSON(params));
                } else {
                    alert(jsonObj.message);
                }
            },

            notify:function(jsonObj){
                if(b$.pN){
                    var params = {
                        content: jsonObj.message || 'Tip',
                        title: jsonObj.title || 'title'
                    };

                    return b$.pN.notice.notify($.toJSON(params));
                }else{
                    alert(jsonObj.message);
                }
            },

            dockMessage:function(jsonObj){
                if(b$.pN){
                    var params = {
                        content: jsonObj.message || 'Tip',
                        title: jsonObj.title || 'title'
                    };

                    return b$.pN.growl.notify($.toJSON(params));
                }else{
                    alert(jsonObj.message);
                }
            }
        };

        /**
         * App 内容封装
         */
        b$.App = {

            /// 获得App的名称
            appName: null,
            getAppName: function () {
                if (b$.pN) {
                    var t = this;
                    if (t.appName) return t.appName;
                    t.appName = b$.pN.app.getAppName();
                    return t.appName;
                }
                return "AppName";
            },

            /// 获得产品的版本
            appVersion: null,
            getAppVersion: function () {
                if (b$.pN) {
                    var t = this;
                    if (t.appVersion) return t.appVersion;
                    t.appVersion = b$.pN.app.getAppVersion();
                    return t.appVersion;
                }
                return "4.5.6";
            },

            /// 获得产品的构建包的版本
            appBuildVersion:null,
            getAppBuildVersion:function(){
                if (b$.pN) {
                    var t = this;
                    if (t.appBuildVersion) return t.appBuildVersion;
                    t.appBuildVersion = b$.pN.app.getAppBuildVersion();
                    return t.appBuildVersion;
                }
                return "201506271454";
            },

            /// 获得产品的ID
            appId: null,
            getAppId: function () {
                if (b$.pN) {
                    var t = this;
                    if (t.appId) return t.appId;
                    t.appId = b$.pN.app.getAppIdentifier();
                    return t.appId;
                }
                return "AppID";
            },

            /// 获得App是否在沙盒内
            getSandboxEnable: function () {
                if (b$.pN) {
                    var sandboxEnable = b$.pN.app.getSandboxEnable();
                    return sandboxEnable;
                }
                return false;
            },

            /// 获取App内部注册信息
            getRegInfoJSONString: function () {
                if (b$.pN) {
                    var str = b$.pN.app.getRegInfoJSONString();
                    return str;
                }
                return "";
            },

            /// 获取App认证的内部序列号信息
            getSerialNumber: function () {
                if (b$.pN) {
                    var str = b$.pN.app.getStringSerialNumber();
                    return str;
                }
                return "";
            },

            /// 获取本地IP地址
            getLocalIP: function () {
                if (b$.pN) {
                    var str = b$.pN.app.getLocalIP();
                    return str;
                }
                return "";
            },


            /// 终止运行，退出系统
            terminate: function () {
                if (b$.pN) {
                    b$.pN.app.terminate();
                }
            },

            /// 激活自己
            activate: function () {
                if (b$.pN) {
                    b$.pN.app.activate();
                }
            },

            /// 隐藏自己
            hide: function () {
                if (b$.pN) {
                    b$.pN.app.hide();
                }
            },

            /// 取消隐藏自己
            unhide: function () {
                if (b$.pN) {
                    b$.pN.app.unhide();
                }
            },

            /// 发出beep声音
            beep: function () {
                if (b$.pN) {
                    b$.pN.app.beep();
                }
            },

            /// 激活Bounce事件
            bounce: function () {
                if (b$.pN) {
                    b$.pN.app.bounce();
                }
            },


            /// 打开链接地址
            open: function (data) {
                if (b$.pN) {
                    return b$.pN.app.open(data || "http://www.baidu.com");
                } else {
                    try {
                        window.open(data);
                    } catch (e) {
                    }

                }
            },


            /// 打开文件，使用系统默认行为
            openFileWithDefaultApp: function (filePath) {
                if (b$.pN) {
                    var _path = filePath || (b$.pN.path.tempDir() + "tmp.txt");
                    b$.pN.app.openFile(_path);
                }
            },


            /// 通过应用程序的名称，启动应用程序
            launchApplication: function (applicationName) {
                if (b$.pN) {
                    b$.pN.app.launch(applicationName || 'Safari'); //Safari.app
                }
            },

            /// 发送电子邮件
            sendEmail: function (parms) {
                if (b$.pN) {
                    try {
                        parms = parms || {};
                        //限制内部属性：
                        parms['sendAddress'] = parms['sendAddress'] || "admin@gmail.com";
                        parms['toAddress'] = parms['toAddress'] || "admin@gmail.com";
                        parms['subject'] = parms['subject'] || "Hello";
                        parms['body'] = parms['body'] || "Hello!!";


                        b$.pN.app.sendEmailWithMail($.toJSON(parms));
                    } catch (e) {
                        console.error(e);
                    }
                } else {
                    alert('启动发送邮件')
                }
            },


            //{开启启动部分}
            //是否开启自动启动{苹果商店App 无效}
            isStartAtLogin: function () {
                if (b$.pN) {
                    return b$.pN.app.isStartAtLogin();
                }

                return false;
            },

            //开启自动启动功能{苹果商店App 无效}
            setStartAtLogin: function (enable) {
                if (b$.pN) {
                    return b$.pN.app.setStartAtLogin(enable); //备注：沙盒状态下无效
                }
            },

            //{NSUserDefaults}
            //存储信息{key: value: }方式,Map方式
            setInfoToUserDefaults: function (jsonObj) {
                if (b$.pN) {
                    var obj = jsonObj || {callback: 'console.log', key: '', value: ''};
                    b$.pN.window.setInfoToUserDefaults($.toJSON(obj));
                }
            },
            //获取存储信息{key: value: }方式,Map方式
            getInfoFromUserDefaults: function (jsonObj) {
                if (b$.pN) {
                    var obj = jsonObj || {callback: 'console.log', key: ''};
                    b$.pN.window.getInfoFromUserDefaults($.toJSON(obj));
                }
            },
            //移除存储信息{key: value: }方式,Map方式
            removeItemFromUserDefaults: function (jsonObj) {
                if (b$.pN) {
                    var obj = jsonObj || {callback: 'console.log', key: ''};
                    b$.pN.window.removeItemFromUserDefaults($.toJSON(obj));
                }
            },

            ///{方便函数，设置评价App功能是否开启}
            setOptions_RateAppClose: function (enable) {
                b$.App.setInfoToUserDefaults({key: 'RateApp_CLOSE', value: enable});
            },


            ///{获取开通的服务器端口}
            getServerPort: function () {
                if (b$.pN) {
                    return b$.pN.app.getHttpServerPort();
                }

                return 8888;
            },

            /// 获得App的插件目录
            getAppPluginDir: b$.getAppPluginDir = function () {
                if (b$.pN) {
                    return b$.pN.path.appPluginDirPath();
                }
                return "";
            },

            /// 获得Application的Resource目录
            getAppResourceDir: b$.getAppResourceDir = function(){
                if (b$.pN) {
                    return b$.pN.path.resource();
                }
                return "";
            },

            /// 获得Public目录
            getAppResourcePublicDir: b$.getAppResourcePublicDir = function () {
                if (b$.pN) {
                    return b$.pN.path.resource() + "/public";
                }
                return "";
            },

            /// 获得App的包的目录
            getAppBundlePath: function () {
                if (b$.pN) {
                    return b$.pN.path.application();
                }
                return "";
            },

            /// 获得AppDataHomeDir
            getAppDataHomeDir: function () {
                if (b$.pN) {
                    return b$.pN.path.appDataHomeDir();
                }
                return "";
            },

            /// 获得Home Directory
            getHomeDir: function () {
                if (b$.pN) {
                    return b$.pN.path.homeDir();
                }
                return "";
            },

            /// 获得DocumentsDir
            getDocumentsDir: function () {
                if (b$.pN) {
                    return b$.pN.path.documentsDir();
                }
                return "";
            },

            /// 获得本地Documents目录
            getLocalDocumentsDir: function () {
                if (b$.pN) {
                    return b$.pN.path.localDocumentsDir();
                }
                return "";
            },

            /// 获得LibraryDir
            getLibraryDir: function () {
                if (b$.pN) {
                    return b$.pN.path.libraryDir();
                }
                return "";
            },

            /// 获得临时目录
            getTempDir: function () {
                if (b$.pN) {
                    return b$.pN.path.tempDir();
                }
                return "";
            },

            /// 获得Cache目录
            getCacheDir: function () {
                if (b$.pN) {
                    return b$.pN.path.cacheDir();
                }
                return "";
            },

            /// 获得Application目录
            getApplicationDir: function () {
                if (b$.pN) {
                    return b$.pN.path.applicationDir();
                }
                return "";
            },

            /// 获得DesktopDir，桌面路径
            getDesktopDir: function () {
                if (b$.pN) {
                    return b$.pN.path.desktopDir();
                }
                return "";
            },

            /// 获得downloadDir，下载目录路径
            getDownloadDir: function () {
                if (b$.pN) {
                    return b$.pN.path.downloadDir();
                }
                return "";
            },

            /// 获得本地download目录路径
            getLocalDownloadDir: function () {
                if (b$.pN) {
                    return b$.pN.path.localDownloadDir();
                }
                return "";
            },

            /// 获得Movies目录路径
            getMoviesDir: function () {
                if (b$.pN) {
                    return b$.pN.path.moviesDir();
                }
                return "";
            },

            /// 获得本地Movies目录路径
            getLocalMoviesDir: function () {
                if (b$.pN) {
                    return b$.pN.path.localMoviesDir();
                }
                return "";
            },

            /// 获得Music目录
            getMusicDir: function () {
                if (b$.pN) {
                    return b$.pN.path.musicDir();
                }
                return "";
            },

            /// 获得本地Music目录
            getLocalMusicDir: function () {
                if (b$.pN) {
                    return b$.pN.path.localMusicDir();
                }
                return "";
            },

            /// 获得本地Pictures目录
            getLocalPicturesDir: function () {
                if (b$.pN) {
                    return b$.pN.path.localPicturesDir();
                }
                return "";
            },

            /// 获得UserName
            getUserName: function () {
                if (b$.pN) {
                    return b$.pN.path.userName();
                }
                return "";
            },

            /// 获得User全名(UserFullName)
            getUserFullName: function () {
                if (b$.pN) {
                    return b$.pN.path.userFullName();
                }
                return "";
            },


            /// 检测路径是否存在
            checkPathIsExist: b$.pathIsExist = function (path) {
                if (b$.pN) {
                    var _path = path || b$.pN.path.tempDir();
                    return b$.pN.path.pathIsExist(_path);
                }

                return false;
            },

            ///文件是否为0Byte
            checkFileIsZero: b$.checkFileIsZeroSize = function (file_path) {
                if (b$.pN) {
                    var _path = file_path || b$.pN.path.tempDir();
                    return b$.pN.path.fileIsZeroSize(_path);
                }

                return false;
            },

            ///路径是否可以写
            checkPathIsWritable: b$.checkPathIsWritable = function (path) {
                if (b$.pN) {
                    var _path = path || b$.pN.path.tempDir();
                    return b$.pN.path.checkPathIsWritable(_path);
                }

                return false;
            },

            ///创建空文件
            createEmptyFile: b$.createEmptyFile = function (file_path) {
                if (b$.pN) {
                    var _path = file_path || (b$.pN.path.tempDir() + "tmp.txt");
                    return b$.pN.window.createEmptyFile($.toJSON({path: _path}));
                }
            },

            ///创建目录
            createDir: b$.createDir = function (dir_path, atts) {
                if (b$.pN) {
                    try {
                        var parms = {};
                        //限制内部属性：
                        parms['callback'] = parms['callback'] || b$._get_callback(function (obj) {
                            }, true);
                        parms['path'] = dir_path || (b$.pN.path.tempDir() + "tmp_dir001");
                        if (atts)  parms['atts'] = atts || {};

                        b$.pN.window.createDir($.toJSON(parms));
                    } catch (e) {
                        console.error(e);
                    }
                }
            },

            ///删除文件
            removeFile: b$.removeFile = function (file_path) {
                if (b$.pN) {
                    var _path = file_path || (b$.pN.path.tempDir() + "tmp.txt");
                    return b$.pN.window.removeFile($.toJSON({path: _path}));
                }
            },

            ///删除目录
            removeDir: b$.removeDir = function (dir_path) {
                if (b$.pN) {
                    try {
                        var parms = {};
                        //限制内部属性：
                        parms['callback'] = parms['callback'] || b$._get_callback(function (obj) {
                            }, true);
                        parms['path'] = dir_path || (b$.pN.path.tempDir() + "/tmp_dir001");


                        b$.pN.window.removeDir($.toJSON(parms));
                    } catch (e) {
                        console.error(e);
                    }
                }
            },

            ///拷贝文件
            copyFile: b$.copyFile = function (parms) {
                if (b$.pN) {
                    try {
                        parms = parms || {};
                        //限制内部属性：
                        parms['callback'] = parms['callback'] || b$._get_callback(function (obj) {
                            }, true);
                        parms['src'] = parms['src'] || "";
                        parms['dest'] = parms['dest'] || "";

                        b$.pN.window.copyFile($.toJSON(parms));
                    } catch (e) {
                        console.error(e);
                    }
                }
            },

            ///拷贝目录
            copyDir: b$.copyDir = function (parms) {
                if (b$.pN) {
                    try {
                        parms = parms || {};
                        //限制内部属性：
                        parms['callback'] = parms['callback'] || b$._get_callback(function (obj) {
                            }, true);
                        parms['src'] = parms['src'] || "";
                        parms['dest'] = parms['dest'] || "";

                        b$.pN.window.copyDir($.toJSON(parms));
                    } catch (e) {
                        console.error(e);
                    }
                }
            },

            ///移动文件
            moveFile: b$.moveFile = function (parms) {
                if (b$.pN) {
                    try {
                        parms = parms || {};
                        //限制内部属性：
                        parms['callback'] = parms['callback'] || b$._get_callback(function (obj) {
                            }, true);
                        parms['src'] = parms['src'] || "";
                        parms['dest'] = parms['dest'] || "";

                        b$.pN.window.moveFile($.toJSON(parms));
                    } catch (e) {
                        console.error(e);
                    }
                }
            },

            ///移动目录
            moveDir: b$.moveDir = function (parms) {
                if (b$.pN) {
                    try {
                        parms = parms || {};
                        //限制内部属性：
                        parms['callback'] = parms['callback'] || b$._get_callback(function (obj) {
                            }, true);
                        parms['src'] = parms['src'] || "";
                        parms['dest'] = parms['dest'] || "";

                        b$.pN.window.moveDir($.toJSON(parms));
                    } catch (e) {
                        console.error(e);
                    }
                }
            },

            ///查找文件是否在此目录中存在
            findFile: b$.findFile = function (dir, fileName, cb) {
                if (b$.pN) {
                    var _dir = dir || b$.pN.path.tempDir();
                    var _fileName = fileName || 'tmp.txt';

                    var parms = {
                        callback: cb || b$._get_callback(function (obj) {
                        }, true),
                        dir: _dir,
                        fileName: _fileName
                    }

                    return b$.pN.window.findFile($.toJSON(parms));
                }

                return null;
            },

            ///判断路径是否可读
            checkPathIsReadable: function (path) {
                if (b$.pN) {
                    var _path = path || b$.pN.path.tempDir();
                    return b$.pN.path.checkPathIsReadable(_path);
                }

                return false;
            },

            ///判断路径是否可运行
            checkPathIsExecutable: function (path) {
                if (b$.pN) {
                    var _path = path || b$.pN.path.tempDir();
                    return b$.pN.path.checkPathIsExecutable(_path);
                }

                return false;
            },

            ///判断路径是否可删除
            checkPathIsDeletable: function (path) {
                if (b$.pN) {
                    var _path = path || b$.pN.path.tempDir();
                    return b$.pN.path.checkPathIsDeletable(_path);
                }

                return false;
            },


            ///判断是否为文件
            checkPathIsFile: function (path) {
                if (b$.pN) {
                    var _path = path || b$.pN.path.tempDir();
                    return b$.pN.path.checkPathIsFile(_path);
                }

                return false;
            },

            ///判断是否为目录
            checkPathIsDir: function (path) {
                if (b$.pN) {
                    var _path = path || b$.pN.path.tempDir();
                    return b$.pN.path.checkPathIsDir(_path);
                }

                return false;
            },

            ///获取文件扩展名
            getFileExt: function (path) {
                if (b$.pN) {
                    var _path = path || (b$.pN.path.tempDir() + "tmp.txt");
                    return b$.pN.path.getFileExt(_path);
                }

                return "";
            },

            ///获取路径上一级目录路径
            getPathParentPath: function (path) {
                if (b$.pN) {
                    var _path = path || b$.pN.path.tempDir();
                    return b$.pN.path.getPathParentPath(_path);
                }

                return "";
            },


            ///获取文件的基本属性
            getFilePropertyJSONString: function (path) {
                if (b$.pN) {
                    var _path = path || (b$.pN.path.tempDir() + "tmp.txt");
                    return b$.pN.path.getFilePropertyJSONString(_path);
                }

                return "";
            },


            ///获得文件/目录size(实际字节数 1024)
            fileSizeAtPath: function (path) {
                if (b$.pN) {
                    var _path = path || (b$.pN.path.tempDir() + "tmp.txt");
                    return b$.pN.app.fileSizeAtPath(_path);
                }

                return "";
            },

            ///获得文件/目录占用磁盘(字节数 1000)
            diskSizeAtPath: function (path) {
                if (b$.pN) {
                    var _path = path || (b$.pN.path.tempDir() + "tmp.txt");
                    return b$.pN.app.diskSizeAtPath(_path);
                }

                return "";
            },

            ///获得字符串的md5值
            md5Digest: function (str) {
                if (b$.pN) {
                    return b$.pN.app.md5Digest(str || "testMd5");
                }

                return "";
            },


            ///获得当前苹果操作系统本地的语言
            getAppleLanguage: function () {
                if (b$.pN) {
                    return b$.pN.app.curAppleLanguage();
                }

                return "en-US";
            },


            ///获得兼容浏览器的语言标识, 发起者，为Native
            getCompatibleWebkitLanguageList: function (_getType) {

                var getType = _getType || 'Native2Webkit'; // 获取类型，默认是获取兼容WebKit的语言标识数组

                var defaultLanguage = 'en';
                //本地对应浏览器的语言标识
                var NativeApple2WebKit_LanguageMap = {
                    'Unknown': ['']
                    , 'en': ['en', 'en-US', 'en-us']                    // 英语
                    , 'fr': ['fr', 'fr-FR', 'fr-fr']                  // French (fr) 法语
                    , 'de': ['de', 'de-DE', 'de-de']                  // German (de) 德语
                    , 'zh-Hans': ['zh', 'zh-CN', 'zh-cn', 'zh-Hans']  // Chinese (Simplified) (zh-Hans) 中文简体
                    , 'zh-Hant': ['zh-TW', 'zh-tw', 'zh-Hant']        // Chinese (Traditional) (zh-Hant) 中文繁体
                    , 'ja': ['ja', 'ja-JP', 'ja-jp']                  // Japanese (ja) 日语
                    , 'es': ['es', 'es-ES', 'es-es']                  // Spanish (es) 西班牙语
                    , 'es-MX': ['es-MX', 'es-XL', 'es-xl']            // Spanish (Mexico) (es-MX) 西班牙语（墨西哥）
                    , 'it': ['it', 'it-IT', 'it-it']                  // Italian (it) 意大利语
                    , 'nl': ['nl', 'nl-NL', 'nl-nl']                  // Dutch (nl) 荷兰语
                    , 'ko': ['ko', 'ko-KR', 'ko-kr']                  // Korean (ko) 韩语
                    , 'pt': ['pt', 'pt-BR', 'pt-br']                  // Portuguese (pt) 葡萄牙语
                    , 'pt-PT': ['pt-PT', 'pt-pt']                      // Portuguese (Portugal) (pt) 葡萄牙语（葡萄牙）
                    , 'da': ['da', 'da-DK', 'da-da']                  // Danish (da) 丹麦语
                    , 'fi': ['fi', 'fi-FI', 'fi-fi']                  // Finnish (fi) 芬兰语
                    , 'nb': ['nb', 'nb-NO', 'nb-no']                  // Norwegian Bokmal (nb) 挪威语
                    , 'sv': ['sv', 'sv-SE', 'sv-se']                  // Swedish (sv) 瑞典语
                    , 'ru': ['ru', 'ru-RU', 'ru-ru']                  // Russian (ru) 俄语
                    , 'pl': ['pl', 'pl-PL', 'pl-pl']                  // Polish (pl) 波兰语
                    , 'tr': ['tr', 'tr-TR', 'tr-tr']                  // Turkish (tr) 土耳其语
                    , 'ar': ['ar', 'AR']                              // Arabic (ar) 阿拉伯语
                    , 'th': ['th', 'th-TH', 'th-th']                  // Thai (th) 泰语
                    , 'cs': ['cs', 'cs-CZ', 'cs-cz']                  // Czech (cs) 捷克语
                    , 'hu': ['hu', 'hu-HU', 'hu-hu']                  // Hungarian (hu) 匈牙利语
                    , 'ca': ['ca', 'ca-ES', 'ca-es']                  // Catalan (ca) 加泰罗尼亚语
                    , 'hr': ['hr', 'hr-HR', 'hr-hr']                  // Croatian (hr) 克罗地亚语
                    , 'el': ['el', 'el-GR', 'el-gr']                  // Greek (el) 希腊语
                    , 'he': ['he', 'he-IL', 'he-il']                  // Hebrew (he) 希伯来语
                    , 'ro': ['ro', 'ro-RO', 'ro-ro']                  // Romanian (ro) 罗马尼亚语
                    , 'sk': ['sk', 'sk-SK', 'sk-sk']                  // Slovak (sk) 斯洛伐克语
                    , 'uk': ['uk', 'uk-UA', 'uk-ua']                  // Ukrainian (uk) 乌克兰语
                    , 'id': ['id', 'ID', 'id-ID', 'id-id']            // Indonesian (id) 印尼语
                    , 'ms': ['ms', 'MS', 'ms-MS', 'ms-ms']            // Malay (ms) 马来西亚语
                    , 'vi': ['vi', 'vi-VN', 'vi-vn']                  // Vietnamese (vi) 越南语
                };

                if (getType === 'Native2Webkit') { // 先获取Native的语言，然后查找Map
                    var apple_lng = 'en-US';
                    if (b$.pN) {
                        apple_lng = b$.pN.app.getAppleLanguage();
                    }

                    if (NativeApple2WebKit_LanguageMap.hasOwnProperty(apple_lng)) {
                        return NativeApple2WebKit_LanguageMap[apple_lng];
                    }

                    return NativeApple2WebKit_LanguageMap[defaultLanguage];
                } else if (getType === 'webkitCompatible') {
                    var mapValue = null, webLanguage = navigator.language || 'en';

                    var inArray = function (value, array) {
                        if (Array.prototype.indexOf) {
                            return array.indexOf(value);
                        } else {
                            for (var i = 0; i < array.length; i++) {
                                if (array[i] === value) return i;
                            }
                            return -1;
                        }
                    };

                    for (var key in NativeApple2WebKit_LanguageMap) {
                        if (NativeApple2WebKit_LanguageMap.hasOwnProperty(key)) {
                            var languageArray = NativeApple2WebKit_LanguageMap[key];
                            if (inArray(webLanguage, languageArray) > -1) {
                                mapValue = languageArray;
                                break;
                            }
                        }
                    }

                    return mapValue;
                }

                return console.error('调用方式不正确，需要的参数为:Native2Webkit 或者webkitCompatible');
            },


            ///设置用户的语言
            setUserLanguage: function (language) {
                if (b$.pN) {
                    b$.pN.app.setUserLanguage(language || 'en-us');
                }
            },

            ///获取用户设置的语言
            getUserLanguage: function () {
                if (b$.pN) {
                    return b$.pN.app.curUserLanguage();
                }

                return "en-us";
            },

            ///截屏[整个屏幕]
            captureFull: function (jsonObj) {
                if (b$.pN) {
                    try {
                        var parms = jsonObj || {};
                        //限制内部属性：
                        parms['callback'] = parms['callback'] || b$._get_callback(function (obj) {
                            }, true);
                        parms['filePath'] = parms['filePath'] || (b$.pN.path.tempDir() + "cap_screen.png");// 保存文件


                        b$.pN.window.capture($.toJSON(parms));
                    } catch (e) {
                        console.error(e);
                    }
                }
            },

            /// 添加目录到变化监视器
            addDirPathToChangeWatcher:function(jsonObj){
                if (b$.pN){
                    try{
                        var parms = jsonObj || {};

                        parms['callback'] = parms['callback'] || b$._get_callback(function(obj){
                                //[Log] {"path":"/Users/Ian/Documents/New_1433573622398.md","flag":"FileWritten"} (app.js, line 270)
                                //[Log] {"path":"/Users/Ian/Documents/New_1433573622398.md","flag":"FileAttributesChanged"} (app.js, line 270)
                                //[Log] {"path":"/Users/Ian/Documents/New_1433573622398.md","flag":"FileSizeIncreased"} (app.js, line 270)
                                //[Log] {"path":"/Users/Ian/Documents/New_1433573622398.md","flag":"AccessWasRevoked"} (app.js, line 270)
                                //[Log] {"path":"/Users/Ian/Documents/New_1433573622398.md","flag":"LinkCountChanged"} (app.js, line 270)
                                //[Log] {"path":"/Users/Ian/Documents/New_1433573622398.md","flag":"FileRenamed"} (app.js, line 270)
                                //[Log] {"path":"/Users/Ian/Documents/New_1433573622398.md","flag":"FileDeleted"} (app.js, line 270)
                            },true);
                        parms['path'] = parms['path'] || (b$.pN.path.tempDir());

                        b$.pN.window.createDirChangeWatcher($.toJSON(parms));
                    }catch (e) {
                        console.error(e);
                    }
                }
            },

            /// 添加文件目录到变化监视器
            addFilePathToChangeWatcher:function(jsonObj){
                if (b$.pN){
                    try{
                        var parms = jsonObj || {};

                        parms['callback'] = parms['callback'] || b$._get_callback(function(obj){
                                //[Log] {"path":"/Users/Ian/Documents/New_1433573622398.md","flag":"FileWritten"} (app.js, line 270)
                                //[Log] {"path":"/Users/Ian/Documents/New_1433573622398.md","flag":"FileAttributesChanged"} (app.js, line 270)
                                //[Log] {"path":"/Users/Ian/Documents/New_1433573622398.md","flag":"FileSizeIncreased"} (app.js, line 270)
                                //[Log] {"path":"/Users/Ian/Documents/New_1433573622398.md","flag":"AccessWasRevoked"} (app.js, line 270)
                                //[Log] {"path":"/Users/Ian/Documents/New_1433573622398.md","flag":"LinkCountChanged"} (app.js, line 270)
                                //[Log] {"path":"/Users/Ian/Documents/New_1433573622398.md","flag":"FileRenamed"} (app.js, line 270)
                                //[Log] {"path":"/Users/Ian/Documents/New_1433573622398.md","flag":"FileDeleted"} (app.js, line 270)
                            },true);
                        parms['path'] = parms['path'] || (b$.pN.path.tempDir());

                        b$.pN.window.createFileChangeWatcher($.toJSON(parms));
                    }catch (e) {
                        console.error(e);
                    }
                }
            },

            /// 从变化监视器中移除
            removeFromChangeWatcher:function(jsonObj){
                if(b$.pN){
                    try{
                        var parms = jsonObj || {};
                        parms['path'] = parms['path'] || (b$.pN.path.tempDir());

                        return b$.pN.window.removeFromChangeWatcher($.toJSON(parms));
                    }catch (e) {
                        console.error(e);
                    }
                }

                return false;
            }

        };

        /**
         * XPC 内容封装
         * @type {{install: Function, unInstall: Function, find: Function, resume: Function, suspend: Function, invalidate: Function, sendMessage: Function}}
         */
        b$.XPC = {
            /**
             * 安装新的XPC关联
             * @param jsonObj
             * @returns {*}
             */
            install:function(jsonObj){
                if(b$.pN){
                    try{
                        var _jsonObj = jsonObj || {};
                        var params = {
                            key: jsonObj.xpc_key || "default",
                            id: jsonObj.bundleID   || "com.romanysoft.app.mac.xpc.AgentHelper"
                        };

                        return b$.pN.app.registerNewXPCService($.toJSON(params));
                    }catch(e){console.error(e)}
                }

                return false;
            },

            /**
             * 解除XPC的关联
             * @param xpc_key
             * @returns {*}
             */
            unInstall:function(xpc_key){
                if(b$.pN){
                    try{
                        return b$.pN.app.unRegisterXPCService(xpc_key);
                    }catch(e){console.error(e)}

                }

                return false;
            },

            /**
             * 查找XPC是否存在
             * @param xpc_key  xpc关联的Key的唯一标识
             * @returns {true/false}
             */
            find: function(xpc_key){
                if(b$.pN){
                    try{
                        return b$.pN.app.hasXPCService(xpc_key || "default");
                    }catch(e){console.error(e)}
                }

                return false;
            },

            /**
             * 恢复XPC服务
             * @param xpc_key
             */
            resume:function(xpc_key){
                if(b$.pN){
                    try{
                        b$.pN.app.resumeXPCService(xpc_key);
                    }catch(e){console.error(e)}

                }
            },

            /**
             * 挂起XPC服务
             * @param xpc_key
             */
            suspend:function(xpc_key){
                if(b$.pN){
                    try{
                        b$.pN.app.suspendXPCService(xpc_key);
                    }catch(e){console.error(e)}

                }
            },

            /**
             * 使XPC服务失效
             * @param xpc_key
             */
            invalidate:function(xpc_key){
                if(b$.pN){
                    try{
                        b$.pN.app.invalidateXPCService(xpc_key);
                    }catch(e){console.error(e)}

                }
            },

            /**
             * 向XPC发送消息
             * @param jsonObj 基础信息
             * @param cb 回调函数
             * @returns {*}
             */
            sendMessage:function(jsonObj, cb){
                if(b$.pN){
                    try{
                        var _json = jsonObj || {};
                        var params = {
                            xpc_key: _json.xpc_key || "default",
                            callback: _json.callback || b$._get_callback(function (obj) {
                                console.log($.obj2string(obj));
                                cb && cb(obj)
                            }, true),
                            messageDic:_json.messageDic
                        };

                        return b$.pN.app.sendMessageToXPCService($.toJSON(params));
                    }catch(e){console.error(e)}
                }
            }
        };

        /***
         * XPC Node Helper
         * @type {{exec: Function}}
         */
        b$.XPCNodeHelper = {
            /**
             * 获得默认的Node XPC Key
             * @returns {string}
             */
            getXPCKey:function(){
                return "g_romanysoft_node_xpc";
            },

            /**
             * 获得NodeHelper的关键字
             * @returns {string}
             */
            getHelperBundleID:function(){
                return "com.romanysoft.app.mac.xpc.NodeHelper";
            },

            /**
             * 执行Node命令
             * @param jsonObj
             * @param successCB 成功函数
             * @param failedCB  失败函数
             */
            exec:function(jsonObj, successCB, failedCB){
                var $t = this;

                var xpc_key = $t.getXPCKey();
                var helperID = $t.getHelperBundleID();

                var canExec = false;

                // 检查是否已经安装过
                if(false == b$.XPC.find(xpc_key)){
                    canExec = b$.XPC.install({xpc_key:xpc_key, bundleID:helperID});
                }else{
                    canExec = true;
                }

                // 根据是否可以执行来处理
                if(canExec){
                    var pluginDir = b$.App.getAppPluginDir();
                    var node_path = pluginDir + "/node";

                    var _json = jsonObj || {};

                    // 创建任务
                    var messageDic = {
                        "ms_type":"CALL_TASK",
                        "ms_obj":{
                            "taskAppPath":node_path,
                            "command":_json.command || ['-v'],
                            "currentDirectoryPath":_json.currentDirectoryPath || "",
                            "environmentDic":_json.environmentDic|| {},
                            "mainThread":_json.mainThread || false
                        }
                    };

                    // 发送消息
                    b$.XPC.sendMessage({
                        "xpc_key":xpc_key,
                        "messageDic":messageDic
                    },function(obj){
                        console.log("XPCNodeHelper log: " + $.obj2string(obj));
                        successCB && successCB(obj);
                    })

                }else{
                    console.error("XPCNodeHelper install failed.");
                    failedCB && failedCB();
                }

            }
        };


        b$.XPCPythonHelper = {
            /**
             * 获得默认的Node XPC Key
             * @returns {string}
             */
            getXPCKey:function(){
                return "g_romanysoft_python_xpc";
            },

            /**
             * 获得NodeHelper的关键字
             * @returns {string}
             */
            getHelperBundleID:function(){
                return "com.romanysoft.app.mac.xpc.PythonHelper";
            },

            /**
             * 通用执行Python命令
             * @param jsonObj
             * @param successCB
             * @param failedCB
             */
            common_exec:function(jsonObj, successCB, failedCB){
                var $t = this;

                var xpc_key = $t.getXPCKey();
                var helperID = $t.getHelperBundleID();

                var canExec = false;

                // 检查是否已经安装过
                if(false == b$.XPC.find(xpc_key)){
                    canExec = b$.XPC.install({xpc_key:xpc_key, bundleID:helperID});
                }else{
                    canExec = true;
                }

                // 根据是否可以执行来处理
                if(canExec){
                    var pluginDir = b$.App.getAppPluginDir();
                    var pythonCLI_path = pluginDir + "/pythonCLI";

                    var _json = jsonObj || {};

                    // 创建任务
                    var messageDic = {
                        "ms_type":"CALL_TASK",
                        "ms_obj":{
                            "taskAppPath":pythonCLI_path,
                            "command":_json.command || ['-v'],
                            "currentDirectoryPath":_json.currentDirectoryPath || "",
                            "environmentDic":_json.environmentDic|| {},
                            "mainThread":_json.mainThread || true
                        }
                    };

                    // 发送消息
                    b$.XPC.sendMessage({
                        "xpc_key":xpc_key,
                        "messageDic":messageDic
                    },function(obj){
                        console.log("XPCNodeHelper log: " + $.obj2string(obj));
                        successCB && successCB(obj);
                    })

                }else{
                    console.error("XPCNodeHelper install failed.");
                    failedCB && failedCB();
                }
            },

            _formatCommand:function(pythonCommand){
                if(typeof pythonCommand != "string"){
                    console.error('command must be string'); alert('command must be string');
                    return null;
                }

                // 构造基本的命令
                var workDir = b$.App.getAppResourceDir() + "/data/python";
                var resourceDir = b$.App.getAppDataHomeDir();
                var configFile = "Resources/config.plist";

                // 格式化
                var regCommand = '["-i","id.pythonCLI","-c","%config%","-r","%resourceDir%","-w","%workDir%","-m","%command%"]';
                var formatCommonStr = regCommand.replace(/%config%/g, configFile);
                formatCommonStr = formatCommonStr.replace(/%resourceDir%/g, resourceDir);
                formatCommonStr = formatCommonStr.replace(/%workDir%/g, workDir);
                formatCommonStr = formatCommonStr.replace(/%command%/g, pythonCommand);

                // 转换成标准的Command 数组
                var command = eval(formatCommonStr); // 转换成command

                return command;
            },

            /**
             * 内置的执行方式
             * @param jsonObj
             * @param successCB
             * @param failedCB
             */
            exec:function(jsonObj, successCB, failedCB){
                var $t = this;
                var _json = jsonObj || {};

                var pythonCommand = _json.command || ""; //{string}
                var command = $t._formatCommand(pythonCommand);

                // 传递参数
                var newJson = {
                    command: command || ['-v'],
                    currentDirectoryPath: _json.currentDirectoryPath || "",
                    "environmentDic":_json.environmentDic|| {},
                    "mainThread":_json.mainThread || true
                };

                $t.common_exec(newJson, successCB, failedCB);
            },

            /**
             * 启动Python假设的WebServer
             * @param jsonObj
             * @param successCB
             * @param failedCB
             */
            startWebServer:function(jsonObj, successCB, failedCB){
                var $t = this;

                var _json = jsonObj || {};

                // 传递参数
                var newJson = {
                    "command": " --port=" + b$.App.getServerPort(), // {要求string}
                    "currentDirectoryPath": _json.currentDirectoryPath || "",
                    "environmentDic":_json.environmentDic|| {},
                    "mainThread":_json.mainThread || true
                };

                $t.exec(newJson, successCB, failedCB);

            }

        };


        /**
         * 集成广告平台
         */
        b$.AD = {

            // AutoConfig
            /**
             * 自动配置
             * @param millisec setTimeout的毫秒
             * @param cb       回调函数
             */
            autoInit:function(millisec, cb){
                var $t = this;
                if(typeof $.getp == "undefined"){return alert("util.js init failed...")}

                setTimeout(function(){
                    // 自动发送请求
                    $.getp($.ConfigServer.getDomain()+'/services/get_ads_config',{},true,function(o){
                        console.log("get_ads_config:" + $.obj2string(o));
                        try{
                            var isEnableAds = o.isEnableAds;
                            if(isEnableAds == true){
                                //设置配置
                                var jsonObj = JSON.parse(o.configInfo);
                                $t.DesktopAD.config(jsonObj, cb);
                            }
                        }catch(e){console.error(e)}
                    });
                }, millisec || 5000);
            },

            // 参照：http://www.desktopad.com/
            DesktopAD:{
                /**
                 * 配置
                 * */
                enable:false, // 是否可用
                config:function(jsonObj, cb){
                    var t = this;
                    if(b$.pN){
                        try{
                            var params = {
                                callback: jsonObj.callback || b$._get_callback(function (obj) {
                                    console.log(obj);
                                    try{
                                        t.enable = obj.success;
                                        cb && cb();
                                    }catch(e){console.error(e)}
                                }, true),
                                DesktopAD:jsonObj.desktoADInfo || {
                                    appKey:jsonObj.appKey || "",
                                    appSecret:jsonObj.appSecret
                                }
                            };

                            b$.pN.app.configDesktopADInfo($.toJSON(params));
                        }catch(e){console.error(e)}
                    }
                },
                /**
                 * 显示所有广告
                 */
                showAD:function(){
                    var t = this;
                    if(b$.pN){
                        try{
                            t.enable && b$.pN.app.showDesktopAD();
                        }catch(e){console.error(e)}
                    }
                },
                /**
                 * 隐藏所有广告
                 */
                hideAD:function(){
                    var t = this;
                    if(b$.pN){
                        try{
                            t.enable && b$.pN.app.hideDesktopAD();
                        }catch(e){console.error(e)}
                    }
                }
            }
        };

        /**
         * 窗体的设置
         * @type {{minimize: Function, maximize: Function, toggleFullScreen: Function, restore: Function, isMaximized: Function, move: Function, resize: Function, setMinSize: Function, setMaxSize: Function}}
         */
        b$.Window = {

            // 最小化窗体
            minimize: function () {
                if (b$.pN) b$.pN.window.minimize();
            },

            // 最大化窗体
            maximize: function () {
                if (b$.pN) b$.pN.window.maximize();
            },

            // 全屏切换
            toggleFullScreen: function () {
                if (b$.pN) b$.pN.window.toggleFullscreen();
            },

            // 窗体状态恢复
            restore: function () {
                if (b$.pN) b$.pN.window.restore();
            },

            // 是否最大化
            isMaximized: function () {
                if (b$.pN) {
                    return b$.pN.window.isMaximized();
                }

                return false;
            },

            // 获取原点坐标
            getOrigin: function () {
                if (b$.pN) {
                    return JSON.parse(b$.pN.window.getOrigin());
                }
                return {x: 0, y: 0};
            },

            // 移动窗体
            move: function (parms) {
                if (b$.pN) {
                    try {
                        parms = parms || {};
                        //限制内部属性：
                        parms['x'] = parms['x'] || 0.0;
                        parms['y'] = parms['y'] || 0.0;

                        b$.pN.window.move($.toJSON(parms));
                    } catch (e) {
                        console.error(e);
                    }
                } else {
                    alert('启动窗体移动!')
                }
            },

            // 改变窗体大小
            resize: function (parms) {
                if (b$.pN) {
                    try {
                        parms = parms || {};
                        //限制内部属性：
                        parms['width'] = parms['width'] || 600;
                        parms['height'] = parms['height'] || 400;

                        b$.pN.window.resize($.toJSON(parms));
                    } catch (e) {
                        console.error(e);
                    }
                } else {
                    alert('启动窗体重置大小!')
                }
            },

            // 获取窗体尺寸最小值
            getMinSize: function () {
                if (b$.pN) {
                    return JSON.parse(b$.pN.window.getMinSize());
                }
                return {width: 600, height: 400};
            },

            // 设置窗体尺寸最小值
            setMinSize: function (parms) {
                if (b$.pN) {
                    try {
                        parms = parms || {};
                        //限制内部属性：
                        parms['width'] = parms['width'] || 600;
                        parms['height'] = parms['height'] || 400;

                        b$.pN.window.setMinsize($.toJSON(parms));
                    } catch (e) {
                        console.error(e);
                    }
                } else {
                    alert('启动窗体设置最小尺寸!')
                }
            },

            // 获取窗体最大值
            getMaxSize: function () {
                if (b$.pN) {
                    return JSON.parse(b$.pN.window.getMaxSize());
                }
                return {width: 600, height: 400};
            },

            // 设置窗体最大值
            setMaxSize: function (parms) {
                if (b$.pN) {
                    try {
                        parms = parms || {};
                        //限制内部属性：
                        parms['width'] = parms['width'] || 600;
                        parms['height'] = parms['height'] || 400;

                        b$.pN.window.setMaxsize($.toJSON(parms));
                    } catch (e) {
                        console.error(e);
                    }
                } else {
                    alert('启动窗体设置最大尺寸!')
                }
            },

            // 获取窗体当前尺寸
            getSize: function () {
                if (b$.pN) {
                    return JSON.parse(b$.pN.window.getSize());
                }

                return {width: 600, height: 400};
            },

            // 设置窗体当前尺寸
            setSize: function (parms) {
                b$.Window.resize(parms);
            }

        };


        /**
         * 系统菜单控制
         * @type {{setMenuProperty: Function, maxRecentDocumentCount: Function, addRecentDocument: Function, clearAllRecentDocuments: Function}}
         */
        b$.SystemMenus = {
            setMenuProperty: function (parms) {
                if (b$.pN) {
                    try {
                        parms = parms || {};
                        //限制内部属性：
                        parms['callback'] = parms['callback'] || b$._get_callback(function (obj) {
                            }, true);
                        parms['menuTag'] = parms['menuTag'] || 999;
                        parms['hideMenu'] = parms['hideMenu'] || false;
                        parms['title'] = parms['title'] || "MenuTitle";
                        parms['action'] = parms['action'] || b$._get_callback(function (obj) {
                            }, true);

                        b$.pN.window.setMenuProperty($.toJSON(parms));
                    } catch (e) {
                        console.error(e);
                    }
                } else {
                    alert('启动系统菜单控制!')
                }
            },
            maxRecentDocumentCount: function () {
                if (b$.pN) {
                    return b$.pN.window.maxRecentDocumentCount();
                }

                return 0;
            },
            addRecentDocument: function (parms) {
                if (b$.pN) {
                    try {
                        parms = parms || {};
                        //限制内部属性：
                        parms['url'] = parms['url'] || "";
                        parms['mustWritable'] = parms['mustWritable'] || false;

                        b$.pN.window.addRecentDocument($.toJSON(parms));
                    } catch (e) {
                        console.error(e);
                    }
                } else {
                    alert('启动添加最近使用文档功能')
                }
            },
            clearAllRecentDocuments: function () {
                if (b$.pN) b$.pN.window.clearAllRecentDocuments();
            }


        };

        /**
         * 剪贴板操作
         * @type {{copy: Function, paste: Function}}
         */
        b$.Clipboard = {
            copy: function (stringText) {
                if (b$.pN) {
                    b$.pN.clipboard.copy(stringText);
                }
            },
            paste: function () {
                if (b$.pN) {
                    return b$.pN.clipboard.paste();
                }
            }
        };


        /**
         * Dock 浮动图标上的设置内容
         * @type {{setBadge: Function, getBadge: Function}}
         */
        b$.Dock = {
            setBadge: function (text) {
                if (b$.pN) {
                    b$.pN.dock.setBadge(text);
                }
            },
            getBadge: function () {
                if (b$.pN) {
                    return b$.pN.dock.badge;
                }

                return "dock";
            }
        };

        /**
         * 二进制扩展
         * @type {{createBinaryFile: Function, createTextFile: Function, getUTF8TextContentFromFile: Function, base64ToFile: Function, base64ToImageFile: Function, imageFileConvertToOthers: Function}}
         */
        b$.Binary = {
            createBinaryFile: function (parms) {
                if (b$.pN) {
                    try {
                        parms = parms || {};
                        //限制内部属性：
                        parms['callback'] = parms['callback'] || b$._get_callback(function (obj) {
                            }, true);
                        parms['filePath'] = parms['filePath'] || "";
                        parms['data'] = parms['data'] || "";
                        parms['offset'] = parms['offset'] || 0;
                        parms['dataAppend'] = parms['dataAppend'] || false;

                        b$.pN.binaryFileWriter.writeBinaryArray($.toJSON(parms));
                    } catch (e) {
                        console.error(e);
                    }
                } else {
                    alert('创建二进制文件')
                }
            },

            createTextFile: function (parms) {
                if (b$.pN) {
                    try {
                        parms = parms || {};
                        //限制内部属性：
                        parms['callback'] = parms['callback'] || b$._get_callback(function (obj) {
                            }, true);
                        parms['filePath'] = parms['filePath'] || "";
                        parms['text'] = parms['text'] || "";
                        parms['offset'] = parms['offset'] || 0;
                        parms['dataAppend'] = parms['dataAppend'] || true;

                        b$.pN.binaryFileWriter.writeTextToFile($.toJSON(parms));
                    } catch (e) {
                        console.error(e);
                    }
                } else {
                    alert('创建文本文件')
                }
            },

            getUTF8TextContentFromFile: function (parms) {
                if (b$.pN) {
                    try {
                        parms = parms || {};
                        //限制内部属性：
                        parms['callback'] = parms['callback'] || b$._get_callback(function (obj) {
                                /**
                                 obj.success = true || false
                                 obj.content =  //内容
                                 obj.error =    //出错信息
                                 **/
                            }, true);
                        parms['filePath'] = parms['filePath'] || "";
                        parms['encode'] = parms['encode'] || 'utf8';
                        parms['async'] = parms['async'] || true;  // 异步的时候，回调函数有效，否则无效，直接返回内容值

                        /**
                         encode: 说明，不区分大小写
                         ASCII,NEXTSTEP,JapaneseEUC,UTF8,ISOLatin1,Symbol,NonLossyASCII,ShiftJIS,ISOLatin2,Unicode
                         WindowsCP1251,WindowsCP1252,WindowsCP1253,WindowsCP1254,WindowsCP1250,ISO2022JP,MacOSRoman
                         UTF16,UTF16BigEndian,UTF16LittleEndian
                         **/

                        b$.pN.binaryFileWriter.getTextFromFile($.toJSON(parms));  //使用非异步模式(async == false)，直接返回content内容
                    } catch (e) {
                        console.error(e);
                    }
                } else {
                    alert('获取文本文件中的内容（UTF8编码）')
                }
            },


            base64ToFile: function (parms) {
                if (b$.pN) {
                    try {
                        parms = parms || {};
                        //限制内部属性：
                        parms['callback'] = parms['callback'] || b$._get_callback(function (obj) {
                            }, true);
                        parms['filePath'] = parms['filePath'] || "";
                        parms['base64String'] = parms['base64String'] || "";
                        parms['dataAppend'] = parms['dataAppend'] || false;

                        b$.pN.binaryFileWriter.base64ToFile($.toJSON(parms));
                    } catch (e) {
                        console.error(e);
                    }
                } else {
                    alert('base64编码保存到文件中')
                }
            },

            base64ToImageFile: function (parms) {
                if (b$.pN) {
                    try {
                        parms = parms || {};
                        //限制内部属性：
                        parms['callback'] = parms['callback'] || b$._get_callback(function (obj) {
                            }, true);
                        parms['filePath'] = parms['filePath'] || "";
                        parms['base64String'] = parms['base64String'] || "";
                        parms['imageType'] = parms['imageType'] || 'jpeg'; //png,bmp

                        b$.pN.binaryFileWriter.base64ToImageFile($.toJSON(parms));
                    } catch (e) {
                        console.error(e);
                    }
                } else {
                    alert('base64编码保存到图片文件中')
                }
            },

            imageFileConvertToOthers: function (parms) {
                if (b$.pN) {
                    try {
                        parms = parms || {};
                        //限制内部属性：
                        parms['callback'] = parms['callback'] || b$._get_callback(function (obj) {
                            }, true);
                        parms['filePath'] = parms['filePath'] || ""; // 目标文件
                        parms['orgFilePath'] = parms['orgFilePath'] || ""; // 源文件
                        parms['imageType'] = parms['imageType'] || 'jpeg'; //png,bmp

                        b$.pN.binaryFileWriter.imageFileConvertToOthers($.toJSON(parms));
                    } catch (e) {
                        console.error(e);
                    }
                } else {
                    alert('图片格式转换')
                }
            },


            Sound: {
                playResourceSoundFile: function (fileUrl) {
                    if (b$.pN) b$.pN.sound.play(fileUrl);
                }
            },

            Video: {}

        };


        // 启动核心插件功能
        b$.enablePluginCore = function (pluginList, cbFuncName) {
            if (b$.pN) {
                try {
                    var org_pluginArray = pluginList || []; // 插件信息数组
                    var pluginArray = [];

                    //过滤调用方式非'call' 的插件
                    for (var i = 0; i < org_pluginArray.length; ++i) {
                        var plugin = org_pluginArray[i];
                        if (plugin["callMethod"] === 'call') {
                            pluginArray.push(plugin);
                        }
                    }

                    var extendObj = $.objClone(b$.pCorePlugin);
                    extendObj["callMethod"] = "initCore";
                    if (cbFuncName) extendObj["passBack"] = cbFuncName; // 取代默认回调函数
                    extendObj["arguments"] = [
                        true,
                        pluginArray
                    ];

                    b$.pN.window.execTask($.toJSON(extendObj));

                } catch (e) {
                    console.error(e);
                }
            }
        };

        // 启用拖拽功能
        b$.cb_dragdrop = null; // 启动
        /**
         *
         * @param parms 参数处理
         */
        b$.enableDragDropFeature = function (jsonObj) {
            if (b$.pN) {
                try {
                    var parms = jsonObj || {};
                    parms["callback"] = jsonObj["callback"] || "BS.b$.cb_dragdrop";
                    parms["enableDir"] = jsonObj["enableDir"] || false;
                    parms["enableFile"] = jsonObj["enableFile"] || true;
                    parms["fileTypes"] = jsonObj["fileTypes"] || ["*"];

                    b$.pN.window.setDragDropConfig($.toJSON(parms));
                } catch (e) {
                    console.error(e);
                }
            }
        };

        // 创建任务
        /**
         *
         * @param callMethod  调用方式：task，sendEvent，
         * @param taskId
         * @param args
         * @param cbFuncName callback 回调函数的名称
         */
        b$.createTask = function (callMethod, taskId, args, cbFuncName) {
            if (b$.pN) {
                try {
                    var extendObj = $.objClone(b$.pCorePlugin);
                    extendObj["passBack"] = cbFuncName || extendObj["passBack"];
                    extendObj["callMethod"] = callMethod;
                    extendObj["arguments"] = [taskId, args];

                    b$.pN.window.execTask($.toJSON(extendObj));
                } catch (e) {
                    console.error(e);
                }
            }
        };

        // 发送任务事件
        b$.sendQueueEvent = function (queueID, queueType, event) {
            if (b$.pN) {
                try {
                    var extendObj = $.objClone(b$.pCorePlugin);
                    extendObj["callMethod"] = "sendEvent";
                    extendObj["arguments"] = [event, queueType, queueID];

                    b$.pN.window.execTask($.toJSON(extendObj));
                } catch (e) {
                    console.error(e);
                }
            }
        };

        // 导入文件
        /**
         BS.b$.cb_importFiles({
         "success":true,
         "parentDir":"/Volumes/DiskShareUser/Users/ian/TestResource/xls",
         "filesCount":1,
         "filesArray":[
            {"isExecutable":true,
            "isDeletable":false,
            "fileNameWithoutExtension":"Book1",
            "fileName":"Book1.xls",
            "fileSize":7680,
            "fileSizeStr":"7.7KB",
            "fileUrl":"file:///Volumes/DiskShareUser/Users/ian/TestResource/xls/Book1.xls",
            "isReadable":true,
            "isWritable":true,
            "extension":"xls",
            "filePath":"/Volumes/DiskShareUser/Users/ian/TestResource/xls/Book1.xls"
            }
         ]
     });
         **/
        b$.cb_importFiles = null; // 导入文件的回调
        b$.importFiles = function (parms) {
            if (b$.pN) {
                try {
                    parms = parms || {};
                    //限制内部属性：
                    parms['callback'] = parms['callback'] || "BS.b$.cb_importFiles";
                    parms['title'] = parms['title'] || "Select a file";
                    parms['prompt'] = parms['prompt'] || "Open";

                    parms['allowOtherFileTypes'] = parms['allowOtherFileTypes'] || false;
                    parms['allowMulSelection'] = parms['allowMulSelection'] || false;
                    parms['canCreateDir'] = parms['canCreateDir'] || false;
                    parms['canChooseFiles'] = true;
                    parms['canChooseDir'] = false;
                    parms['types'] = parms['types'] || [];

                    //下拉文件类型选择处理
                    if ("enableFileFormatCombox" in parms) {
                        parms["enableFileFormatCombox"] = parms["enableFileFormatCombox"] || false;
                    }
                    if ("typesDescript" in parms) {
                        parms["typesDescript"] = parms["typesDescript"] || [];
                    }

                    if ("lable" in parms) {
                        parms["lable"] = parms["lable"] || "File Format:";
                    }
                    if ("label" in parms) {
                        parms["label"] = parms["label"] || "File Format:";
                    }

                    //[end]下拉文件类型选择处理


                    b$.pN.window.openFile($.toJSON(parms));
                } catch (e) {
                    console.error(e);
                }
            } else {
                alert('启动选择文件对话框!')
            }
        };

        // 选择输出目录
        /**
         * 选择目录传入的参数：
         * {
                callback: "BS.b$.cb_selectOutDir",
                allowOtherFileTypes: false,
                canCreateDir: true,
                canChooseDir: true,
                canChooseFiles: false, // 不可以选择文件
                title: "Select Directory",
                prompt: "Select",
                types: []              // 类型要为空
            }
         * @type {null}
         */
        b$.cb_selectOutDir = null; // 选择输出目录的回调
        b$.selectOutDir = function (parms) {
            if (b$.pN) {
                try {
                    parms = parms || {};
                    //限制内部属性：
                    parms['callback'] = parms['callback'] || "BS.b$.cb_selectOutDir";
                    parms['title'] = parms['title'] || "Select Directory";
                    parms['prompt'] = parms['prompt'] || "Select";

                    parms['allowOtherFileTypes'] = false;
                    parms['canCreateDir'] = parms['canCreateDir'] || true;
                    parms['canChooseDir'] = true;
                    parms['canChooseFiles'] = false; //不可以选择文件
                    parms['types'] = [];

                    b$.pN.window.openFile($.toJSON(parms));
                } catch (e) {
                    console.error(e);
                }
            } else {
                alert("启动选择目录对话框!");
            }
        };

        // 选择输出文件
        /*
         BS.b$.cb_selectOutFile({
         "success":true,
         "fileName":"untitled.csv",
         "fileUrl":"file:///Volumes/DiskShareUser/Users/ian/TestResource/xls/untitled.csv",
         "fileNameWithoutExtension":"untitled",
         "extension":"csv",
         "filePath":"/Volumes/DiskShareUser/Users/ian/TestResource/xls/untitled.csv"
         });
         */
        b$.cb_selectOutFile = null; // 选择输出文件的回调
        b$.selectOutFile = function (parms) {
            if (b$.pN) {
                try {
                    parms = parms || {};
                    //限制内部属性：
                    parms['callback'] = parms['callback'] || "BS.b$.cb_selectOutFile";
                    parms['title'] = parms['title'] || "Save as";
                    parms['prompt'] = parms['prompt'] || "Save";

                    parms['allowOtherFileTypes'] = false;
                    parms['canCreateDir'] = parms['canCreateDir'] || true;
                    parms['fileName'] = parms['fileName'] || "untitled";
                    parms['types'] = parms['types'] || ['*']; // 要求的数组

                    b$.pN.window.saveFile($.toJSON(parms));
                } catch (e) {
                    console.error(e);
                }
            } else {
                alert('启动选择输出文件对话框!')
            }
        };

        // 定位文件/目录
        b$.cb_revealInFinder = null; // 选择定位文件的回调
        b$.revealInFinder = function (path) {
            if (b$.pN) {
                try {
                    b$.pN.window.revealInFinder($.toJSON({
                        callback: "BS.b$.cb_revealInFinder",
                        filePath: path
                    }));
                } catch (e) {
                    console.error(e)
                }
            } else {
                alert('启动定位路径功能')
            }
        };

        // 预览文件
        b$.previewFile = function (parms) {
            if (b$.pN) {
                try {
                    parms = parms || {};
                    //限制内部属性：
                    parms['callback'] = parms['callback'] || b$._get_callback(function (obj) {
                        }, true);
                    parms['filePath'] = parms['filePath'] || "";

                    b$.pN.window.preveiwFile($.toJSON(parms));
                } catch (e) {
                    console.error(e);
                }
            } else {
                alert('启动内置预览文件功能')
            }
        };


        // 检测是否支持本地存储
        b$.check_supportHtml5Storage = function () {
            try {
                return 'localStorage' in window && window['localStorage'] != null;
            } catch (e) {
                return false;
            }
        };

        // 初始化默认的Manifest文件, callback 必须定义才有效
        b$.defaultManifest_key = 'js_defaultManifest_key';
        b$.defaultManifest = {};

        // 保存默认Manifest对象
        b$.saveDefaultManifest = function (newManifest) {
            if (!b$.check_supportHtml5Storage()) return false;
            var obj = {manifest: newManifest || b$.defaultManifest};
            var encoded = $.toJSON(obj);
            window.localStorage.setItem(b$.defaultManifest_key, encoded);
            return true;
        };

        // 还原默认Manifest对象
        b$.revertDefaultManifest = function () {
            if (!b$.check_supportHtml5Storage()) return false;
            var encoded = window.localStorage.getItem(b$.defaultManifest_key);
            if (encoded != null) {
                var obj = $.secureEvalJSON(encoded);
                b$.defaultManifest = obj.manifest;
            }

            return true;
        };


        window.BS.b$ = $.extend(window.BS.b$, b$);

    }($));

    return window.BS.b$;
}));




