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
