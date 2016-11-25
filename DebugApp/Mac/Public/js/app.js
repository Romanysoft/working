(function(){
    window['UI'] = window['UI'] || {};
    window.UI.c$ = window.UI.c$ || {};
})();


(function(){
    var c$ = {};
    c$ = $.extend(window.UI.c$,{});

    /**
     * 初始化标题及版本
     */
    c$.initTitleAndVersion = function(){
        document.title = BS.b$.App.getAppName();
    };
	
	
    /**
     * 配置UI
     */	
	 c$.configUI = function(){
		 
		 c$.log_output = function(text){
			 var orgText = $('#area-log').val();
			 $('#area-log').val(orgText + "\n" + text+"\n");
		 }
		 
		 
		 $('#btn-copy').on('click', function(){
			
			c$.log_output($(this).text())
			
		    var b$ = BS.b$;
		   	b$.Clipboard.copy($('#input-text').val()) 	
		 });
		 
		 $('#btn-paste').on('click', function(){
			
			c$.log_output($(this).text())
			
		    var b$ = BS.b$;
		   	c$.log_output(b$.Clipboard.paste()) 	
		 });


		 $('#btn-xpc').on('click', function(){
			 var b$ = BS.b$;

			 b$.XPCNodeHelper.exec(null, function(obj){alert(obj)});

		 });

		 $('#btn-xpc-python').on('click', function(){
			 var b$ = BS.b$;

			 b$.XPCPythonHelper.startWebServer(null, function(obj){alert(obj)});

		 });


	 };
	
	
    /**
     * 启动
     */
    c$.launch = function(){
		
        c$.initTitleAndVersion();
		c$.configUI();
		
    };	
	
	window.UI.c$ = $.extend(window.UI.c$,c$);
})();