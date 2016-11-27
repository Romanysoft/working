(function(){
    window['UI'] = window['UI'] || {};
    window.UI.c$ = window.UI.c$ || {};
})();


(function(){
    var c$ = {};
    c$ = $.extend(window.UI.c$,{});

    var _U = {};

    /**
     * 初始化标题及版本
     */
    _U.initTitleAndVersion = function(){
        document.title = "Romanysoft | " + BS.b$.App.getAppName() + "  | Ver " + BS.b$.App.getAppBuildVersion();
    };
	
	
    /**
     * 配置UI
     */
    _U.configUI = function(){

		 // c$.log_output = function(text){
			//  var orgText = $('#area-log').val();
			//  $('#area-log').val(orgText + "\n" + text+"\n");
		 // }
		 //
		 //
		 // $('#btn-copy').on('click', function(){
			//
			// c$.log_output($(this).text())
			//
		 //    var b$ = BS.b$;
		 //   	b$.Clipboard.copy($('#input-text').val())
		 // });
		 //
		 // $('#btn-paste').on('click', function(){
			//
			// c$.log_output($(this).text())
			//
		 //    var b$ = BS.b$;
		 //   	c$.log_output(b$.Clipboard.paste())
		 // });
         //
         //
		 // $('#btn-xpc').on('click', function(){
			//  var b$ = BS.b$;
         //
			//  b$.XPCNodeHelper.exec(null, function(obj){alert(obj)});
         //
		 // });
         //
		 // $('#btn-xpc-python').on('click', function(){
			//  var b$ = BS.b$;
         //
			//  b$.XPCPythonHelper.startWebServer(null, function(obj){alert(obj)});
         //
		 // });
        setTimeout(function () {
            toastr.options = {
                closeButton: true,
                progressBar: true,
                showMethod: 'slideDown',
                timeOut: 4000
            };
            toastr.success('Responsive INSPINIA Admin Theme', 'Welcome to Romanysoft SDK');

        }, 1300);

        // 代码格式化
        $.each($('.sdk-code'), function (i, ele) {
            var editor = CodeMirror.fromTextArea(ele, {
                lineNumbers: true
            });

            editor.on("change", function (cm, obj) {
                $(ele).text(cm.getValue());
            });

        });

        // 代码可尝试自动执行
        $.each($('button.coderun'), function (i, ele) {
            var js = $(ele).parent('h3').children('code.enableRun').html();
            try {
                var value = eval(js);
                console.log(value);
                $(ele).parent('h3').children('sub').html(" = " + JSON.stringify(value));
            } catch (e) {
                alert(e);
            }
        });

        // 代码可尝试执行
        $.each($('button.trycode'), function (i, ele) {
            var js = $(ele).parent('h3').children('code').html();
            $(ele).on('click', function () {
                try {
                    var value = eval(js);
                    console.log(value);
                    $(ele).parent('h3').children('sub').html(" = " + JSON.stringify(value));
                } catch (e) {
                    alert(e);
                }
            });
        });

        // 复杂代码执行
        $.each($('div.cx-code'), function (i, ele) {
            var btn = $(ele).children('button');
            var ele_result = $(ele).children('p.runLogShow');
            var ele_code = $(ele).children('textarea.sdk-code');
            btn.html("Run Code");

            $(btn).on('click', function () {
                try {
                    var js = $(ele_code).text();

                    window.RTYD_callback = function (obj) {
                        $(ele_result).html(JSON.stringify(obj));
                        $(ele_result).css({"word-wrap":"break-word", "word-break":"normal"});

                    };

                    eval(js);
                } catch (e) {
                    alert(e);
                }

            });

        });




	 };


	
	
    /**
     * 启动
     */
    _U.launch = function(){
    	var t$ = this;

        t$.initTitleAndVersion();
        t$.configUI();
		
    };

    $(document).ready(function () {
		_U.launch();
    });
	
	window.UI.c$ = $.extend(window.UI.c$,c$);
})();