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



            }
            
        };
        
        





        $.TESTOOL_RTY = _u;

    }($));


    return $;
}));
