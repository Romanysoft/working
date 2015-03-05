/**
 * Created by Ian on 2014/8/10.
 * 优化
 */

;(function(factory){
    "use strict";
    if (typeof define === "function" && define.amd){
        define("BS.b$", ["jquery"], function(){
            return factory(jQuery || $)
        })
    }else{
        factory(jQuery || $);
    }

    if ( typeof module === "object" && typeof module.exports === "object" ) {
        module.exports = factory(jQuery || $)
    }

}(function($){
    "use strict";

    (function(){
        window['BS'] = window['BS'] || {};
        window.BS.b$ = window.BS.b$ || {};
    })();

    (function($) {
        $.toJSON = $.toJSON || JSON.stringify;
        var b$ = {};
        b$ = $.extend(window.BS.b$,{});
        b$.pN = b$.pNative = (typeof maccocojs !== 'undefined') && (maccocojs); // 本地引擎

        // 定义临时回调处理函数定义接口
        b$._ncb_idx = 0;
        b$._get_callback = function(func, noDelete){
            window._nativeCallback = window._nativeCallback || {};
            var _nativeCallback = window._nativeCallback;
            var r = 'ncb' + b$._ncb_idx++;
            _nativeCallback[r] = function(){
                try {
                    if (!noDelete) {
                        delete _nativeCallback[r];
                    }
                }catch(e){console.error(e)}
                func && func.apply(null, arguments);
            };
            return '_nativeCallback.' + r;
        };

        b$.cb_execTaskUpdateInfo = null; //执行任务的回调
        b$.pCorePlugin = { //核心处理引导插件部分,尽量不要修改
            useThread: true,
            passBack:"BS.b$.cb_execTaskUpdateInfo",
            packageMode: 'bundle',
            taskToolPath: "/Plugins/extendLoader.bundle",
            bundleClassName: "LibCommonInterface"
        };

        b$.pIAPPlugin = {
            path:"/plugin.iap.bundle"
        };

        // IAP 功能封装
        b$.cb_handleIAPCallback = null; // IAP的回调函数
        b$.IAP = {
            enableIAP : function(parms){
                if(b$.pN){
                    try{
                        //注册IAP回调
                        b$.pN.iap.regeditIAPCallbackJs(parms.cb_IAP_js || "BS.b$.cb_handleIAPCallback");

                        //注册IAPBundle
                        b$.pN.iap.regeditIAPCore($.toJSON({
                            path:b$.getAppPluginDir() + b$.pIAPPlugin.path
                        }));

                        //看看是否可以起诉购买
                        if(b$.pN.iap.canMakePayments()){
                            //启动服务
                            b$.pN.iap.startIAPService();

                            //发送商品请求
                            b$.pN.iap.requestProducts($.toJSON({
                                productIdentifiers:parms.productIds ||[]
                            }));
                        }
                    }catch(e){
                        console.error(e);
                    }

                }
            },

            restore:function(){
                if(b$.pN){
                    //发送购买请求
                    b$.pN.iap.restoreIAP();
                }
            },

            buyProduct:function(parms){
                if(b$.pN){
                    //发送购买请求
                    b$.pN.iap.buyProduct($.toJSON({
                        identifier:parms.productIdentifier,
                        quantity:parms.quantity || 1
                    }));
                }
            },

            getPrice:function(productIdentifier){
                if(b$.pN){
                    return b$.pN.iap.getPrice(productIdentifier);
                }

                return "";
            },

            getUseableProductCount: function(productIdentifier){
                if(b$.pN){
                    return b$.pN.iap.getUseableProductCount(productIdentifier);
                }

                return 0;
            },

            setUseableProductCount:function(jsonObj){
                if(b$.pN){
                    var params = {
                        identifier: jsonObj.productIdentifier || '',
                        quantity: jsonObj.quantity || 1
                    };
                    return b$.pN.iap.setUseableProductCount($.toJSON(params));
                }

                return 0;
            },

            add1Useable : function(productIdentifier){
                if(b$.pN){
                    return b$.pN.iap.add1Useable(productIdentifier);
                }

                return 0;
            },

            sub1Useable : function(productIdentifier){
                if(b$.pN){
                    return b$.pN.iap.sub1Useable(productIdentifier);
                }

                return 0;
            }
        };

        /**
         * Notice 内容封装
         */
        b$.Notice = {
            alert:function(jsonObj){
                if(b$.pN){
                    var params = {
                        message: jsonObj.message || 'Tip',
                        title: jsonObj.title || 'title',
                        buttons: jsonObj.buttons || ['Ok'],
                        alertType: jsonObj.alertType || 'Alert'
                    };

                    return b$.pN.notice.alert($.toJSON(params));
                }else{
                    alert(jsonObj.message);
                }
            }
        };

        /**
         * App 内容封装
         */
        b$.App = {
            appName:null,
            getAppName:function(){
                if(b$.pN){
                    var t = this;
                    if(t.appName) return t.appName;
                    t.appName = b$.pN.app.getAppName();
                    return t.appName;
                }
                return "AppName";
            },

            appVersion:null,
            getAppVersion:function(){
                if(b$.pN){
                    var t = this;
                    if(t.appVersion) return t.appVersion;
                    t.appVersion = b$.pN.app.getAppVersion();
                    return t.appVersion;
                }
                return "4.5.6";
            },

            appId:null,
            getAppId:function(){
                if(b$.pN){
                    var t = this;
                    if(t.appId) return t.appId;
                    t.appId = b$.pN.app.getAppIdentifier();
                    return t.appId;
                }
                return "AppID";
            },

            getSandboxEnable:function(){
                if(b$.pN){
                    var sandboxEnable = b$.pN.app.getSandboxEnable();
                    return sandboxEnable;
                }
                return false;
            },

            getRegInfoJSONString:function(){
                if(b$.pN){
                    var str = b$.pN.app.getRegInfoJSONString();
                    return str;
                }
                return "";
            },

            getSerialNumber:function(){
                if(b$.pN){
                    var str = b$.pN.app.getStringSerialNumber();
                    return str;
                }
                return "";
            },

            getLocalIP:function(){
                if(b$.pN){
                    var str = b$.pN.app.getLocalIP();
                    return str;
                }
                return "";
            },

            open:function(data){
                if(b$.pN){
                    return b$.pN.app.open(data);
                }else{
                    try{
                        window.open(data);
                    }catch(e){}

                }
            },

            //{开启启动部分}
            isStartAtLogin:function(){
                if(b$.pN){
                    return b$.pN.app.isStartAtLogin();
                }

                return false;
            },

            setStartAtLogin:function(enable){
                if(b$.pN){
                    return b$.pN.app.setStartAtLogin(enable); //备注：沙盒状态下无效
                }
            },

            //{NSUserDefaults}
            setInfoToUserDefaults:function(jsonObj){
                if(b$.pN){
                    var obj = jsonObj || {callback: 'console.log', key:'', value:''};
                    b$.pN.window.setInfoToUserDefaults($.toJSON(obj));
                }
            },
            getInfoFromUserDefaults:function(jsonObj){
                if(b$.pN){
                    var obj = jsonObj || {callback: 'console.log', key:''};
                    b$.pN.window.getInfoFromUserDefaults($.toJSON(obj));
                }
            },
            removeItemFromUserDefaults:function(jsonObj){
                if(b$.pN){
                    var obj = jsonObj || {callback: 'console.log', key:''};
                    b$.pN.window.removeItemFromUserDefaults($.toJSON(obj));
                }
            },

            ///{方便函数，设置评价App功能是否开启}
            setOptions_RateAppClose:function(enable){
                b$.App.setInfoToUserDefaults({key:'RateApp_CLOSE', value:enable});
            },


            ///{获取开通的服务器端口}
            getServerPort:function(){
                if(b$.pN){
                    return b$.pN.app.getHttpServerPort();
                }

                return 8888;
            },

            /// 获得App的插件目录
            getAppPluginDir: b$.getAppPluginDir = function(){
                if(b$.pN){
                    return b$.pN.path.appPluginDirPath();
                }
                return "";
            },

            /// 获得Public目录
            getAppResourcePublicDir:b$.getAppResourcePublicDir = function(){
                if(b$.pN){
                    return b$.pN.path.resource() + "/public";
                }
                return "";
            },

            /// 检测路径是否存在
            checkPathIsExist: b$.pathIsExist = function(path){
                if(b$.pN){
                    return b$.pN.path.pathIsExist(path);
                }

                return false;
            },

            ///文件是否为0Byte
            checkFileIsZero: b$.checkFileIsZeroSize = function(file_path){
                if(b$.pN){
                    return b$.pN.path.fileIsZeroSize(file_path);
                }

                return false;
            },

            ///路径是否可以写
            checkPathIsWritable: b$.checkPathIsWritable = function(path){
                if(b$.pN){
                    return b$.pN.path.checkPathIsWritable(path);
                }

                return false;
            },

            ///创建空文件
            createEmptyFile: b$.createEmptyFile = function(file_path){
                if(b$.pN){
                    return b$.pN.window.createEmptyFile($.toJSON({path:file_path}));
                }
            },

            ///创建目录
            createDir: b$.createDir = function(dir_path, atts){
                if(b$.pN){
                    try{
                        var parms = {};
                        //限制内部属性：
                        parms['callback'] = parms['callback'] || b$._get_callback(function(obj){}, true);
                        parms['path'] = dir_path || "";
                        if(atts)  parms['atts'] = atts || {};

                        b$.pN.window.removeDir($.toJSON(parms));
                    }catch(e){
                        console.error(e);
                    }
                }
            },

            ///删除文件
            removeFile: b$.removeFile = function(file_path){
                if(b$.pN){
                    return b$.pN.window.removeFile($.toJSON({path:file_path}));
                }
            },

            ///删除目录
            removeDir: b$.removeDir = function(dir_path){
                if(b$.pN){
                    try{
                        var parms = {};
                        //限制内部属性：
                        parms['callback'] = parms['callback'] || b$._get_callback(function(obj){}, true);
                        parms['path'] = dir_path || "";


                        b$.pN.window.removeDir($.toJSON(parms));
                    }catch(e){
                        console.error(e);
                    }
                }
            },

            ///拷贝文件
            copyFile: b$.copyFile = function(parms){
                if(b$.pN){
                    try{
                        parms = parms || {};
                        //限制内部属性：
                        parms['callback'] = parms['callback'] || b$._get_callback(function(obj){}, true);
                        parms['src'] = parms['src'] || "";
                        parms['dest'] = parms['dest'] || "";

                        b$.pN.window.copyFile($.toJSON(parms));
                    }catch(e){
                        console.error(e);
                    }
                }
            },

            ///拷贝目录
            copyDir: b$.copyDir = function(parms){
                if(b$.pN){
                    try{
                        parms = parms || {};
                        //限制内部属性：
                        parms['callback'] = parms['callback'] || b$._get_callback(function(obj){}, true);
                        parms['src'] = parms['src'] || "";
                        parms['dest'] = parms['dest'] || "";

                        b$.pN.window.copyFile($.toJSON(parms));
                    }catch(e){
                        console.error(e);
                    }
                }
            },

            ///移动文件
            moveFile: b$.moveFile = function(parms){
                if(b$.pN){
                    try{
                        parms = parms || {};
                        //限制内部属性：
                        parms['callback'] = parms['callback'] || b$._get_callback(function(obj){}, true);
                        parms['src'] = parms['src'] || "";
                        parms['dest'] = parms['dest'] || "";

                        b$.pN.window.moveFile($.toJSON(parms));
                    }catch(e){
                        console.error(e);
                    }
                }
            },

            ///移动目录
            moveDir: b$.moveDir = function(parms){
                if(b$.pN){
                    try{
                        parms = parms || {};
                        //限制内部属性：
                        parms['callback'] = parms['callback'] || b$._get_callback(function(obj){}, true);
                        parms['src'] = parms['src'] || "";
                        parms['dest'] = parms['dest'] || "";

                        b$.pN.window.moveDir($.toJSON(parms));
                    }catch(e){
                        console.error(e);
                    }
                }
            },

            ///查找文件是否在此目录中存在
            findFile: b$.findFile = function(dir, fileName){
                if(b$.pN){
                    return b$.pN.window.findFile($.toJSON({dir:dir, fileName:fileName}));
                }
                return null;
            },

            ///判断路径是否可读
            checkPathIsReadable:function(path){
                if(b$.pN){
                    return b$.pN.path.checkPathIsReadable(path);
                }

                return false;
            },

            ///判断路径是否可运行
            checkPathIsExecutable:function(path){
                if(b$.pN){
                    return b$.pN.path.checkPathIsExecutable(path);
                }

                return false;
            },

            ///判断路径是否可删除
            checkPathIsDeletable:function(path){
                if(b$.pN){
                    return b$.pN.path.checkPathIsDeletable(path);
                }

                return false;
            },


            ///判断是否为文件
            checkPathIsFile:function(path){
                if(b$.pN){
                    return b$.pN.path.checkPathIsFile(path);
                }

                return false;
            },

            ///判断是否为目录
            checkPathIsDir:function(path){
                if(b$.pN){
                    return b$.pN.path.checkPathIsDir(path);
                }

                return false;
            },

            ///获取文件扩展名
            getFileExt:function(path){
                if(b$.pN){
                    return b$.pN.path.getFileExt(path);
                }

                return "";
            },

            ///获取路径上一级目录路径
            getPathParentPath:function(path){
                if(b$.pN){
                    return b$.pN.path.getPathParentPath(path);
                }

                return "";
            },


            ///获取文件的基本属性
            getFilePropertyJSONString:function(path){
                if(b$.pN){
                    return b$.pN.path.getFilePropertyJSONString(path);
                }

                return "";
            },


            ///获得文件/目录size(实际字节数 1024)
            fileSizeAtPath:function(path){
                if(b$.pN){
                    return b$.pN.app.fileSizeAtPath(path);
                }

                return "";
            },

            ///获得文件/目录占用磁盘(字节数 1000)
            diskSizeAtPath:function(path){
                if(b$.pN){
                    return b$.pN.app.diskSizeAtPath(path);
                }

                return "";
            },

            ///获得字符串的md5值
            md5Digest:function(str){
                if(b$.pN){
                    return b$.pN.app.md5Digest(str);
                }

                return "";
            },


            ///获得当前苹果操作系统本地的语言
            getAppleLanguage:function(){
                if(b$.pN){
                    return b$.pN.app.curAppleLanguage();
                }

                return "en-US";
            },


            ///获得兼容浏览器的语言标识, 发起者，为Native
            getCompatibleWebkitLanguageList:function(_getType){

                var getType = _getType || 'Native2Webkit'; // 获取类型，默认是获取兼容WebKit的语言标识数组

                var defaultLanguage = 'en';
                //本地对应浏览器的语言标识
                var NativeApple2WebKit_LanguageMap = {
                    'Unknown':['']
                    ,'en':['en','en-US','en-us']                    // 英语
                    ,'fr':['fr', 'fr-FR', 'fr-fr']                  // French (fr) 法语
                    ,'de':['de', 'de-DE', 'de-de']                  // German (de) 德语
                    ,'zh-Hans':['zh', 'zh-CN', 'zh-cn', 'zh-Hans']  // Chinese (Simplified) (zh-Hans) 中文简体
                    ,'zh-Hant':['zh-TW', 'zh-tw', 'zh-Hant']        // Chinese (Traditional) (zh-Hant) 中文繁体
                    ,'ja':['ja', 'ja-JP', 'ja-jp']                  // Japanese (ja) 日语
                    ,'es':['es', 'es-ES', 'es-es']                  // Spanish (es) 西班牙语
                    ,'es-MX':['es-MX', 'es-XL', 'es-xl']            // Spanish (Mexico) (es-MX) 西班牙语（墨西哥）
                    ,'it':['it', 'it-IT', 'it-it']                  // Italian (it) 意大利语
                    ,'nl':['nl', 'nl-NL', 'nl-nl']                  // Dutch (nl) 荷兰语
                    ,'ko':['ko', 'ko-KR', 'ko-kr']                  // Korean (ko) 韩语
                    ,'pt':['pt', 'pt-BR', 'pt-br']                  // Portuguese (pt) 葡萄牙语
                    ,'pt-PT':['pt-PT','pt-pt']                      // Portuguese (Portugal) (pt) 葡萄牙语（葡萄牙）
                    ,'da':['da', 'da-DK', 'da-da']                  // Danish (da) 丹麦语
                    ,'fi':['fi', 'fi-FI', 'fi-fi']                  // Finnish (fi) 芬兰语
                    ,'nb':['nb', 'nb-NO', 'nb-no']                  // Norwegian Bokmal (nb) 挪威语
                    ,'sv':['sv', 'sv-SE', 'sv-se']                  // Swedish (sv) 瑞典语
                    ,'ru':['ru', 'ru-RU', 'ru-ru']                  // Russian (ru) 俄语
                    ,'pl':['pl', 'pl-PL', 'pl-pl']                  // Polish (pl) 波兰语
                    ,'tr':['tr', 'tr-TR', 'tr-tr']                  // Turkish (tr) 土耳其语
                    ,'ar':['ar', 'AR']                              // Arabic (ar) 阿拉伯语
                    ,'th':['th', 'th-TH', 'th-th']                  // Thai (th) 泰语
                    ,'cs':['cs', 'cs-CZ', 'cs-cz']                  // Czech (cs) 捷克语
                    ,'hu':['hu', 'hu-HU', 'hu-hu']                  // Hungarian (hu) 匈牙利语
                    ,'ca':['ca', 'ca-ES', 'ca-es']                  // Catalan (ca) 加泰罗尼亚语
                    ,'hr':['hr', 'hr-HR', 'hr-hr']                  // Croatian (hr) 克罗地亚语
                    ,'el':['el', 'el-GR', 'el-gr']                  // Greek (el) 希腊语
                    ,'he':['he', 'he-IL', 'he-il']                  // Hebrew (he) 希伯来语
                    ,'ro':['ro', 'ro-RO', 'ro-ro']                  // Romanian (ro) 罗马尼亚语
                    ,'sk':['sk', 'sk-SK', 'sk-sk']                  // Slovak (sk) 斯洛伐克语
                    ,'uk':['uk', 'uk-UA', 'uk-ua']                  // Ukrainian (uk) 乌克兰语
                    ,'id':['id', 'ID', 'id-ID', 'id-id']            // Indonesian (id) 印尼语
                    ,'ms':['ms', 'MS', 'ms-MS', 'ms-ms']            // Malay (ms) 马来西亚语
                    ,'vi':['vi', 'vi-VN', 'vi-vn']                  // Vietnamese (vi) 越南语
                };

                if(getType === 'Native2Webkit'){ // 先获取Native的语言，然后查找Map
                    var apple_lng = 'en-US';
                    if(b$.pN){
                        apple_lng = b$.pN.app.getAppleLanguage();
                    }

                    if(NativeApple2WebKit_LanguageMap.hasOwnProperty(apple_lng)){
                        return NativeApple2WebKit_LanguageMap[apple_lng];
                    }

                    return NativeApple2WebKit_LanguageMap[defaultLanguage];
                }else if(getType === 'webkitCompatible'){
                    var mapValue = null, webLanguage = navigator.language || 'en';

                    var inArray = function(value, array){
                        if (Array.prototype.indexOf) {
                            return array.indexOf(value);
                        } else {
                            for (var i = 0; i < array.length; i++) {
                                if (array[i] === value) return i;
                            }
                            return -1;
                        }
                    };

                    for(var key in NativeApple2WebKit_LanguageMap){
                        if(NativeApple2WebKit_LanguageMap.hasOwnProperty(key)){
                            var languageArray = NativeApple2WebKit_LanguageMap[key];
                            if(inArray(webLanguage, languageArray) > -1){
                                mapValue = languageArray;
                                break;
                            }
                        }
                    }

                    return mapValue;
                }

                return console.error('调用方式不正确，需要的参数为:Native2Webkit 或者webkitCompatible');
            },

            ///截屏[整个屏幕]
            captureFull:function(parms){
                if(b$.pN){
                    try{
                        parms = parms || {};
                        //限制内部属性：
                        parms['callback'] = parms['callback'] || b$._get_callback(function(obj){}, true);
                        parms['filePath'] = parms['filePath'] || ""; // 保存文件


                        b$.pN.window.capture($.toJSON(parms));
                    }catch(e){
                        console.error(e);
                    }
                }
            }

        };

        /**
         * 窗体的设置
         * @type {{minimize: Function, maximize: Function, toggleFullScreen: Function, restore: Function, isMaximized: Function, move: Function, resize: Function, setMinSize: Function, setMaxSize: Function}}
         */
        b$.Window = {
            minimize:function(){
                if (b$.pN) b$.pN.window.minimize();
            },
            maximize:function(){
                if (b$.pN) b$.pN.window.maximize();
            },
            toggleFullScreen:function(){
                if (b$.pN) b$.pN.window.toggleFullscreen();
            },
            restore:function(){
                if (b$.pN) b$.pN.window.restore();
            },
            isMaximized:function(){
                if (b$.pN){
                    return b$.pN.window.isMaximized();
                }

                return false;
            },
            move:function(parms){
                if(b$.pN){
                    try{
                        parms = parms || {};
                        //限制内部属性：
                        parms['x'] = parms['x'] || 0.0;
                        parms['y'] = parms['y'] || 0.0;

                        b$.pN.window.move($.toJSON(parms));
                    }catch(e){
                        console.error(e);
                    }
                }else{
                    alert('启动窗体移动!')
                }
            },
            resize:function(parms){
                if(b$.pN){
                    try{
                        parms = parms || {};
                        //限制内部属性：
                        parms['width'] = parms['width'] || 600;
                        parms['height'] = parms['height'] || 400;

                        b$.pN.window.resize($.toJSON(parms));
                    }catch(e){
                        console.error(e);
                    }
                }else{
                    alert('启动窗体重置大小!')
                }
            },
            setMinSize:function(parms){
                if(b$.pN){
                    try{
                        parms = parms || {};
                        //限制内部属性：
                        parms['width'] = parms['width'] || 600;
                        parms['height'] = parms['height'] || 400;

                        b$.pN.window.setMinsize($.toJSON(parms));
                    }catch(e){
                        console.error(e);
                    }
                }else{
                    alert('启动窗体设置最小尺寸!')
                }
            },
            setMaxSize:function(parms){
                if(b$.pN){
                    try{
                        parms = parms || {};
                        //限制内部属性：
                        parms['width'] = parms['width'] || 600;
                        parms['height'] = parms['height'] || 400;

                        b$.pN.window.setMaxsize($.toJSON(parms));
                    }catch(e){
                        console.error(e);
                    }
                }else{
                    alert('启动窗体设置最大尺寸!')
                }
            }

        };


        b$.SystemMenus = {
            setMenuProperty:function(parms){
                if(b$.pN){
                    try{
                        parms = parms || {};
                        //限制内部属性：
                        parms['callback'] = parms['callback'] || b$._get_callback(function(obj){}, true);
                        parms['menuTag'] = parms['menuTag'] || 999;
                        parms['hideMenu'] = parms['hideMenu'] || false;
                        parms['title'] = parms['title'] || "MenuTitle";
                        parms['action'] = parms['action'] || b$._get_callback(function(obj){}, true);

                        b$.pN.window.setMenuProperty($.toJSON(parms));
                    }catch(e){
                        console.error(e);
                    }
                }else{
                    alert('启动系统菜单控制!')
                }
            },
            maxRecentDocumentCount:function(){
                if(b$.pN){
                    return b$.pN.window.maxRecentDocumentCount();
                }

                return 0;
            },
            addRecentDocument:function(parms){
                if(b$.pN){
                    try{
                        parms = parms || {};
                        //限制内部属性：
                        parms['url'] = parms['url'] || "";
                        parms['mustWritable'] = parms['mustWritable'] || false;

                        b$.pN.window.addRecentDocument($.toJSON(parms));
                    }catch(e){
                        console.error(e);
                    }
                }else{
                    alert('启动添加最近使用文档功能')
                }
            },
            clearAllRecentDocuments:function(){
                if(b$.pN) b$.pN.window.clearAllRecentDocuments();
            }


        };

        /**
         * 剪贴板操作
         * @type {{copy: Function, paste: Function}}
         */
        b$.Clipboard = {
            copy:function(stringText){
                if(b$.pN){
                    b$.pN.clipboard.copy(stringText);
                }
            },
            paste:function(){
                if(b$.pN){
                    b$.pN.clipboard.paste();
                }
            }
        };


        /**
         * Dock 浮动图标上的设置内容
         * @type {{setBadge: Function, getBadge: Function}}
         */
        b$.Dock = {
            setBadge:function(text){
                if(b$.pN){
                    b$.pN.dock.setBadge(text);
                }
            },
            getBadge:function(){
                if(b$.pN){
                    return b$.pN.dock.badge();
                }

                return "dock";
            }
        };




        // 启动核心插件功能
        b$.enablePluginCore = function(pluginList){
            if(b$.pN){
                try{
                    var org_pluginArray = pluginList || []; // 插件信息数组
                    var pluginArray = [];

                    //过滤调用方式非'call' 的插件
                    for(var i = 0; i < org_pluginArray.length; ++i){
                        var plugin = org_pluginArray[i];
                        if(plugin["callMethod"] === 'call'){
                            pluginArray.push(plugin);
                        }
                    }

                    var extendObj = $.objClone(b$.pCorePlugin);
                    extendObj["callMethod"] = "initCore";
                    extendObj["arguments"] = [
                        true,
                        pluginArray
                    ];

                    b$.pN.window.execTask($.toJSON(extendObj));

                }catch (e){
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
        b$.enableDragDropFeature = function(parms){
            if(b$.pN){
                try{
                    parms = parms || {};
                    parms["callback"] = parms["callback"] || "BS.b$.cb_dragdrop";
                    parms["enableDir"] = parms["enableDir"] || false;
                    parms["enableFile"] = parms["enableFile"] || true;
                    parms["fileTypes"] = parms["fileTypes"] || ["*"];

                    b$.pN.window.setDragDropConfig($.toJSON(parms));
                }catch(e){
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
        b$.createTask = function(callMethod, taskId, args, cbFuncName){
            if(b$.pN){
                try{
                    var extendObj = $.objClone(b$.pCorePlugin);
                    extendObj["passBack"] = cbFuncName || extendObj["passBack"];
                    extendObj["callMethod"] = callMethod;
                    extendObj["arguments"] = [taskId, args];

                    b$.pN.window.execTask($.toJSON(extendObj));
                }catch(e){
                    console.error(e);
                }
            }
        };

        // 发送任务事件
        b$.sendQueueEvent = function(queueID, queueType, event){
            if(b$.pN){
                try{
                    var extendObj = $.objClone(b$.pCorePlugin);
                    extendObj["callMethod"] = "sendEvent";
                    extendObj["arguments"] = [event, queueType, queueID];

                    b$.pN.window.execTask($.toJSON(extendObj));
                }catch(e){
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
        b$.importFiles = function(parms){
            if(b$.pN){
                try{
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


                    b$.pN.window.openFile($.toJSON(parms));
                }catch(e){
                    console.error(e);
                }
            }else{
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
        b$.selectOutDir = function(parms){
            if(b$.pN){
                try{
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
                }catch(e){
                    console.error(e);
                }
            }else{
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
        b$.selectOutFile = function(parms){
            if(b$.pN){
                try{
                    parms = parms || {};
                    //限制内部属性：
                    parms['callback'] = parms['callback'] || "BS.b$.cb_selectOutFile";
                    parms['title'] = parms['title'] || "Save as";
                    parms['prompt'] = parms['prompt'] || "Save";

                    parms['allowOtherFileTypes'] = false;
                    parms['canCreateDir'] = parms['canCreateDir'] || true;
                    parms['fileName'] = parms['fileName'] || "untitled",
                        parms['types'] = parms['types'] || ['*'];

                    b$.pN.window.saveFile($.toJSON(parms));
                }catch(e){
                    console.error(e);
                }
            }else{
                alert('启动选择输出文件对话框!')
            }
        };

        // 定位文件
        b$.cb_revealInFinder = null; // 选择定位文件的回调
        b$.revealInFinder = function(path){
            if(b$.pN){
                try{
                    b$.pN.window.revealInFinder($.toJSON({
                        filePath:path
                    }));
                }catch(e){
                    console.error(e)
                }
            }
        };

        // 预览文件
        b$.previewFile = function(parms){
            if(b$.pN){
                try{
                    parms = parms || {};
                    //限制内部属性：
                    parms['callback'] = parms['callback'] || b$._get_callback(function(obj){}, true);
                    parms['filePath'] = parms['filePath'] || "";

                    b$.pN.window.preveiwFile($.toJSON(parms));
                }catch(e){
                    console.error(e);
                }
            }else{
                alert('启动内置预览文件功能')
            }
        };


        // 检测是否支持本地存储
        b$.check_supportHtml5Storage = function(){
            try{
                return 'localStorage' in window && window['localStorage'] != null;
            }catch(e){
                return false;
            }
        };

        // 初始化默认的Manifest文件, callback 必须定义才有效
        b$.defaultManifest_key = 'js_defaultManifest_key';
        b$.defaultManifest = {};

        // 保存默认Manifest对象
        b$.saveDefaultManifest = function(newManifest){
            if(!b$.check_supportHtml5Storage()) return false;
            var obj = {manifest: newManifest || b$.defaultManifest};
            var encoded = $.toJSON(obj);
            window.localStorage.setItem(b$.defaultManifest_key, encoded);
            return true;
        };

        // 还原默认Manifest对象
        b$.revertDefaultManifest = function(){
            if(!b$.check_supportHtml5Storage()) return false;
            var encoded = window.localStorage.getItem(b$.defaultManifest_key);
            if(encoded != null){
                var obj = $.secureEvalJSON(encoded);
                b$.defaultManifest = obj.manifest;
            }

            return true;
        };


        window.BS.b$ = $.extend(window.BS.b$,b$);

    }($));

    return window.BS.b$;
}));




