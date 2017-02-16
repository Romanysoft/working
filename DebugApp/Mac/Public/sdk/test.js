/**
 * Created by Ian on 2016/12/8.
 */

;
(function (factory) {
    "use strict";
    if (typeof define === "function" && define.amd) {
        define("BS.util", ["jquery"], function () {
            return factory(jQuery || $)
        })
    } else {
        factory(jQuery || $);
    }

    if (typeof module === "object" && typeof module.exports === "object") {
        module.exports = factory(jQuery || $)
    }


}(function ($, undefined) {
    "use strict";

    (function ($) {
        window['$'] = $ || {};
        var b$ = {};
        if (window.BS) {
            if (window.BS.b$) {
                b$ = window.BS.b$;
            }
        }

        var _u = {};

        _u.IAP = {
            run: function () {
                var t$ = this;

                for (var key in t$){
                    if (t$.hasOwnProperty(key) && key.indexOf("test_") > -1){
                        if ($.RTYUtils.isFunction(t$[key])){
                            try{
                                console.log("Test:[" + key + "] begin....\n");
                                t$[key]();
                                console.log("Test:[" + key + "] end....\n\n\n");
                                console.log(".............................................");
                            }catch(e) {console.error(e);}

                        }
                    }
                }
            },

            test_getEnable: function () {
                var enable = b$.IAP.getEnable();
                console.assert(enable == true, "IAP不可用");
            },

            test_enableIAP: function(){
                // 先清理本地存储
                window.localStorage.removeItem(b$.IAP_SE_KEY);

                // 声明
                var cb = function (obj) {
                    console.log("object: %o", obj);
                };

                b$.IAP.enableIAP({
                    productIds:[
                        "product1",
                        "product2",
                        "product3"
                    ]
                }, cb);
            },

            test_first_buy: function () {
                console.log(
                    "用例：初步安装，第一次购买...."
                );


                // 先清理本地存储
                b$.IAP._rebuildInfo();

                // 声明
                var cb = function (obj) {
                    console.log("object: %o", obj);
                };

                b$.IAP.enableIAP({
                    productIds:[
                        "product1",
                        "product2",
                        "product3"
                    ]
                }, cb);


                //Step1：先测试价格
                var onePrice = b$.IAP.getPrice("product1");
                console.assert(onePrice == "$0.99", "价格返回不正常");
                console.log("product1 price: %s", onePrice);

                //Step2: 查询是否已经可以数量
                var count = b$.IAP.getUseableProductCount("product1");
                console.assert(count > -1, "应该为数字");
                console.log("product1 count: %d", count);

                //Step3: 开始执行购买测试
                b$.IAP.buyProduct({productIdentifier:"product1", quantity:1});

                //Step4: 检查购买产品的数量
                if (1){
                    var count = b$.IAP.getUseableProductCount("product1");
                    console.assert(count == 1, "商品数量应该为1");
                    console.log("product1 count: %d", count);
                }


                //Step5: 购买产品2, 检测每个产品的赛道
                b$.IAP.buyProduct({productIdentifier:"product2", quantity:5});
                if (1){
                    var count = 0;
                    count = b$.IAP.getUseableProductCount("product1");
                    console.assert(count == 1, "product1商品数量应该为1");
                    console.log("product1 count: %d", count);

                    count = b$.IAP.getUseableProductCount("product2");
                    console.assert(count == 5, "product1商品数量应该为5");
                    console.log("product2 count: %d", count);

                    count = b$.IAP.getUseableProductCount("product3");
                    console.assert(count == 0, "product1商品数量应该为0");
                    console.log("product3 count: %d", count);

                }

                //Step6：测试非法的商品ID
                b$.IAP.buyProduct({productIdentifier:"product_dfdfdsfs", quantity:5});

                //Step7：测试一下API
                if (1){
                    b$.IAP.setUseableProductCount({productIdentifier:"product3", quantity:17});
                    count = b$.IAP.getUseableProductCount("product3");
                    console.assert(count == 17, "product3商品数量应该为17");
                    console.log("product3 count: %d", count);

                    b$.IAP.add1Useable("product3");
                    count = b$.IAP.getUseableProductCount("product3");
                    console.assert(count == 18, "product3商品数量应该为18");
                    console.log("product3 count: %d", count);

                    b$.IAP.sub1Useable("product3");
                    count = b$.IAP.getUseableProductCount("product3");
                    console.assert(count == 17, "product3商品数量应该为17");
                    console.log("product3 count: %d", count);

                }


            },


            test_buy_callback: function () {
                console.log(
                    "用例：初步安装，第一次购买...."
                );


                // 先清理本地存储
                b$.IAP._rebuildInfo();

                // 声明
                var cb = function (obj) {
                    console.log("object: %o", obj);
                };

                b$.IAP.enableIAP({
                    productIds:[
                        "product1",
                        "product2",
                        "product3"
                    ]
                }, cb);


                //Step1：先测试价格
                var onePrice = b$.IAP.getPrice("product1");
                console.assert(onePrice == "$0.99", "价格返回不正常");
                console.log("product1 price: %s", onePrice);

                //Step2: 查询是否已经可以数量
                var count = b$.IAP.getUseableProductCount("product1");
                console.assert(count > -1, "应该为数字");
                console.log("product1 count: %d", count);

                //Step3: 开始执行购买测试
                b$.IAP.buyProduct({productIdentifier:"product1", quantity:1},function (id, obj) {
                    console.log("Buy Success = %s", id);
                    console.assert(id == "product1", "应该是 product1");
                }, function (id,obj) {

                });
                b$.IAP.buyProduct({productIdentifier:"product2", quantity:1});


            }

            ,test_complex_buy: function () {
                console.log(
                    "用例：初步安装，第一次购买...."
                );


                // 先清理本地存储
                b$.IAP._rebuildInfo();

                // 声明
                var cb = function (obj) {
                    console.log("object: %o", obj);
                };

                b$.IAP.enableIAP({
                    products:[
                        {
                            productIdentifier:"product1",
                            description: "xxx product1 description",
                            buyUrl:"xxxxx",
                            price: "$9.99"
                        },
                        {
                            productIdentifier:"product2",
                            description: "xxx product2 description",
                            buyUrl:"xxxxx",
                            price: "$6.99"
                        },
                        {
                            productIdentifier:"product3",
                            description: "xxx product3 description",
                            buyUrl:"xxxxx",
                            price: "$3.99"
                        }
                    ]
                }, cb);


                //Step1：先测试价格
                var onePrice = b$.IAP.getPrice("product1");
                console.assert(onePrice == "$0.99", "价格返回不正常");
                console.log("product1 price: %s", onePrice);

                //Step2: 查询是否已经可以数量
                var count = b$.IAP.getUseableProductCount("product1");
                console.assert(count > -1, "应该为数字");
                console.log("product1 count: %d", count);

                //Step3: 开始执行购买测试
                b$.IAP.buyProduct({productIdentifier:"product1", quantity:1});

                //Step4: 检查购买产品的数量
                if (1){
                    var count = b$.IAP.getUseableProductCount("product1");
                    console.assert(count == 1, "商品数量应该为1");
                    console.log("product1 count: %d", count);
                }


                //Step5: 购买产品2, 检测每个产品的赛道
                b$.IAP.buyProduct({productIdentifier:"product2", quantity:5});
                if (1){
                    var count = 0;
                    count = b$.IAP.getUseableProductCount("product1");
                    console.assert(count == 1, "product1商品数量应该为1");
                    console.log("product1 count: %d", count);

                    count = b$.IAP.getUseableProductCount("product2");
                    console.assert(count == 5, "product1商品数量应该为5");
                    console.log("product2 count: %d", count);

                    count = b$.IAP.getUseableProductCount("product3");
                    console.assert(count == 0, "product1商品数量应该为0");
                    console.log("product3 count: %d", count);

                }

                //Step6：测试非法的商品ID
                b$.IAP.buyProduct({productIdentifier:"product_dfdfdsfs", quantity:5});

                //Step7：测试一下API
                if (1){
                    b$.IAP.setUseableProductCount({productIdentifier:"product3", quantity:17});
                    count = b$.IAP.getUseableProductCount("product3");
                    console.assert(count == 17, "product3商品数量应该为17");
                    console.log("product3 count: %d", count);

                    b$.IAP.add1Useable("product3");
                    count = b$.IAP.getUseableProductCount("product3");
                    console.assert(count == 18, "product3商品数量应该为18");
                    console.log("product3 count: %d", count);

                    b$.IAP.sub1Useable("product3");
                    count = b$.IAP.getUseableProductCount("product3");
                    console.assert(count == 17, "product3商品数量应该为17");
                    console.log("product3 count: %d", count);

                }

                //Step8; 测试一下商品的属性
                if (1){
                    b$.IAP.setUseableProductCount({productIdentifier:"product3", quantity:17});
                    count = b$.IAP.getUseableProductCount("product3");
                    console.assert(count == 17, "product3商品数量应该为17");
                    console.log("product3 count: %d", count);
                }



            },



            /// {测试}
            TEST: {
                //弹出购买窗体
                showBuyDialog:function (productIdentifier) {
                    // 核查是否已经获取商品的请求核实数据
                    if (!(b$.IAP.data.isRegistered)){
                        var msg = "必须先调用 BS.b$.IAP.getEnable(),并且是可用状态 \n";
                        msg += "然后调用 BS.b$.IAP.enableIAP() 函数进行初始化";

                        alert(msg);
                        return;
                    }

                    // 弹出购买窗体
                    var allProductsPrice = '$9.99';
                    var curProductPrice =  b$.IAP.data.getPrice(productIdentifier) || '$0.99';
                    var message = {
                        title:"Unlock [" + productIdentifier + "] product",
                        message:"Only " + curProductPrice + " ,Do you want to unlock it. \nAlso all products only " + allProductsPrice + " you can buy all at times.",
                        buttons:["Buy","Cancel","Buy All"],
                        alertType:"Alert"
                    };

                    var result = b$.Notice.alert(message);
                    if(result == 0){      //购买单个
                        b$.IAP.buyProduct(productIdentifier);
                    }else if(result > 1){ //购买全部
                        alert("编写购买所有商品的处理方式，可以声明一个商品ID为所有商品的购买ID");
                    }
                }
            }

        };


        _u.Binary = {
            run: function () {
                var t$ = this;

                for (var key in t$){
                    if (t$.hasOwnProperty(key) && key.indexOf("test_") > -1){
                        if ($.RTYUtils.isFunction(t$[key])){
                            try{
                                console.log("Test:[" + key + "] begin....\n");
                                t$[key]();
                                console.log("Test:[" + key + "] end....\n\n\n");
                                console.log(".............................................");
                            }catch(e) {console.error(e);}

                        }
                    }
                }
            },

            test_write_and_get_text_file: function () {
                console.log(
                    "用例：测试写入Text文件...."
                );

                //判断文件是否存在
                var tmpFilePath = b$.App.getNewTempFilePath("__101TEST01.txt");
                console.assert(tmpFilePath.indexOf("__101TEST01.txt") > -1, "获取临时文件路径有问题");

                //先判断这个临时文件是否存在
                console.log("判断文件是否存在");
                var fileExist = b$.App.checkPathIsFile(tmpFilePath);
                console.assert(fileExist == false, "文件已经存在，这是错误的");

                //先尝试写入文件
                console.log("执行写入");
                b$.Binary.createTextFile({
                    filePath:tmpFilePath,
                    text: "TestContent"
                }, function(obj){
                    console.assert($.isPlainObject(obj) == true, "obj对象返回不能为null");
                    console.assert(obj.success == true, "写入不成功");
                })

                //判断读取文件时候有值
                console.log("执行读取");
                b$.Binary.getUTF8TextContentFromFile({
                    filePath: tmpFilePath
                }, function (obj) {
                    console.assert($.isPlainObject(obj) == true, "obj对象返回不能为null");
                    console.assert(obj.success == true, "读取不成功");

                    if (obj.success) {
                        console.assert(obj.content == "TestContent", "文件内容不正确");
                    }
                });


            },

            test_wirte_and_get_text_file_with_space: function() {
                console.log(
                    "用例：测试写入Text文件带空格路径的...."
                );

                //判断文件是否存在
                var tmpFilePath = b$.App.getAppDataHomeDir() + "__101TEST012222.txt";
                console.log("临时文件 = ", tmpFilePath);

                //先尝试写入文件
                console.log("执行写入");
                b$.Binary.createTextFile({
                    filePath:tmpFilePath,
                    text: "TestContent"
                }, function(obj){
                    console.assert($.isPlainObject(obj) == true, "obj对象返回不能为null");
                    console.assert(obj.success == true, "写入不成功");
                })

                //判断读取文件时候有值
                console.log("执行读取");
                b$.Binary.getUTF8TextContentFromFile({
                    filePath: tmpFilePath
                }, function (obj) {
                    console.assert($.isPlainObject(obj) == true, "obj对象返回不能为null");
                    console.assert(obj.success == true, "读取不成功");

                    if (obj.success) {
                        console.assert(obj.content == "TestContent", "文件内容不正确");
                        console.log("读取到内容: ", obj.content);
                    }
                });
            }

            ,test_base64ToImageFile:function(){
              console.log(
                  "用例：测试base64字符串转存为Image文件"
              )

              var tmpPngFile = b$.App.getTempDir() + 'test_1.png';
              console.log("临时图片文件路径 = ", tmpPngFile);

              var base64StringT = "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";

              //先尝试写入文件
              console.log("执行存储");
              b$.Binary.base64ToImageFile({
                  filePath: tmpPngFile,
                  base64String: base64StringT,
                  dataAppend: false,
                  imageType: 'png'
              }, function(info){
                 console.log($.obj2string(info));
              })

            }
        };



        ////// 完善处理
        _u.run = function(){
            var t$ = this;

            for (var key in t$){
                if (t$.hasOwnProperty(key)){
                    if ($.isPlainObject(t$[key])){
                        try{
                            if ($.RTYUtils.isFunction(t$[key]["run"])){
                                try{
                                    console.log("【Test:[" + key + "】 begin....\n");
                                    t$[key]["run"]();
                                    console.log("【Test:[" + key + "】 end....\n\n\n");
                                    console.log("#################################################");
                                }catch(e) {console.error(e);}

                            }
                        }catch(e) {console.error(e);}

                    }
                }
            }
        };

        $.TESTOOL_RTY = _u;

    }($));


    return $;
}));
