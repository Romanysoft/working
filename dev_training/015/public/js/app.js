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
		 
		 
		 // 选择文件
		 $('#btn-openFile').on('click', function(){
			
			c$.log_output($(this).text())
			
		    var b$ = BS.b$;
            b$.importFiles({
                callback: b$._get_callback(function(obj){
					console.log(JOSN.stringify(obj))
                }, true),
                allowOtherFileTypes: false,
                canChooseDir: false,
                allowMulSelection: false,
                title: "Select a file",
                prompt: "Select",
                types: []
            });
		 });
		 
		 // 选择图像文件
		 $('#btn-openImgFile').on('click', function(){
			c$.log_output($(this).text())
			 
		    var b$ = BS.b$;
			 
            b$.importFiles({
                callback: b$._get_callback(function(obj){
					console.log(JOSN.stringify(obj))
                }, true),
                allowOtherFileTypes: false,
                canChooseDir: false,
                allowMulSelection: false,
                title: "Select images file",
                prompt: "Select",
                types: ["png","gif","jpg"]
            });			 
		 });
		 
		 // 选择图像文件,可以选择类型
		 $('#btn-openImgExFile').on('click', function(){
			c$.log_output($(this).text())
			 
		    var b$ = BS.b$;
			 
            b$.importFiles({
                callback: b$._get_callback(function(obj){
					console.log(JOSN.stringify(obj))
                }, true),
                allowOtherFileTypes: false,
                canChooseDir: false,
                allowMulSelection: false,
                title: "Select images file",
                prompt: "Select",
                types: ["png","gif","jpg"]
            });				 
		 });
		 
		 // 选择文件夹
		 $('#btn-openDir').on('click', function(){
			 c$.log_output($(this).text())
			 var b$ = BS.b$;
			 
			 b$.selectOutDir({
                callback: b$._get_callback(function(obj){
					console.log(JOSN.stringify(obj))
                }, true),
                title: "Select Photos Directory",
                prompt: "Select"
            });
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