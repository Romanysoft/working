/**
C标准的dylib封装接口
所有要重新封着的dylib、 可执行文件全部按照此方法进行重新封装。

Ian 2014.4 创建接口文件
Ian 2014.5 初步简化流程
Ian 2014.6 重新整理
Ian 2014.9 增加方便传输数据的接口处理

***/

#ifndef INTERFACE_ROMANYSOFT_H_
#define INTERFACE_ROMANYSOFT_H_


#ifdef __cplusplus
extern "C" {
#endif

#ifdef _WIN32
# ifndef BUILDING_ROMANYSOFT_EXTERN
#   define ROMANYSOFT_EXTERN __declspec(dllexport)
# else
#   define ROMANYSOFT_EXTERN __declspec(dllimport)
# endif
#else
# define ROMANYSOFT_EXTERN /* nothing */
#endif

//////////////////////////////////////////////////////////////////////////////////////////////
//定义常用的宏

///{1. 定义内部消息传输类型}
#ifndef ERROR_EXECCOMMANDOPERATION_ROMANYSOFT
#define ERROR_EXECCOMMANDOPERATION_ROMANYSOFT "type_clicall_error" //执行出错
#endif

#ifndef START_EXECCOMMANDOPERATION_ROMANYSOFT
#define START_EXECCOMMANDOPERATION_ROMANYSOFT "type_clicall_start" //开始执行
#endif

#ifndef END_EXECCOMMANDOPERATION_ROMANYSOFT
#define END_EXECCOMMANDOPERATION_ROMANYSOFT "type_clicall_end" //执行成功
#endif

#ifndef CANCEL_EXECCOMMANDOPERATION_ROMANYSOFT
#define CANCEL_EXECCOMMANDOPERATION_ROMANYSOFT "type_clicall_cancel" //取消执行
#endif

#ifndef PROGRESS_EXECCOMMANDOPERATION_ROMANYSOFT
#define PROGRESS_EXECCOMMANDOPERATION_ROMANYSOFT "type_clicall_reportprogress" //报告信息
#endif

#ifndef LOG_EXECCOMMANDOPERATION_ROMANYSOFT
#define LOG_EXECCOMMANDOPERATION_ROMANYSOFT "type_clicall_log" //输出日志信息
#endif

///{2.定义常用的变量}
#ifndef CHECK_LIFE_ROMANYSOFT
#define CHECK_LIFE_ROMANYSOFT "RomanysoftLAB"   //特殊的生命周期限制字符
#endif 

#ifndef RETURNCODE_DEFAULT_ROMANYSOFT
#define RETURNCODE_DEFAULT_ROMANYSOFT -1        //默认返回的Code
#endif

#ifndef ERROR_DETAIL_DEFAULT_ROMANYSOFT
#define ERROR_DETAIL_DEFAULT_ROMANYSOFT ""      //默认错误信息
#endif
    
//{2.1 返回去的info，要求的json数据Key，要求统一处理}
#ifndef INFO_INFOTYPE_ROMANYSOFT
#define INFO_INFOTYPE_ROMANYSOFT "infoType"
#endif
    
#ifndef INFO_INFOTEXT_ROMANYSOFT
#define INFO_INFOTEXT_ROMANYSOFT "infoText"
#endif
    
#ifndef INFO_INFOPER_ROMANYSOFT
#define INFO_INFOPER_ROMANYSOFT  "infoPercent"
#endif

///{3.接口说明}
    
//封着标准的发送信息的处理
void g_romanysoft_send_start_info();
void g_romanysoft_send_end_info();
void g_romanysoft_send_error(const char* error);
void g_romanysoft_send_progress(const double percent);
void g_romanysoft_send_progressWithInfo(const char* log);
    
  
///////////////////////////////////
typedef void(*global_reportExecStateFunc_TYPE)(const char* info, void* ref);

static void* global_exRef_romanysoft = 0;    //用来存储global_exRef, 反注册的句柄
static global_reportExecStateFunc_TYPE global_reportExecStateFunc = 0; //用来存储函数指针句柄
    
//以下两个内容，用在实现上，用来判断是否出现问题
static bool romanysoft_g_have_error = false; //全局查看是否处理过程中有出错问题
static bool romanysoft_g_canExit = false;   //标明是否可以退出进程，默认是不可以的（这个主要是用来防止替换源代码中，使用Exit函数的问题）

// 汇报执行情况的内部接口
static void cb_reportExecState(const char* info){
	global_reportExecStateFunc(info, global_exRef_romanysoft);
}


/**
 register_reportExecState 是用来注册全局的执行状态的，
 会用到ERROR_EXECCOMMANDOPERATION_ROMANYSOFT 这些宏来处理
 
 参数：info， 是json的字符串，里面要包括至少如下内容：
 infoType, 消息的类型。error 错误信息， returnCode, 错误信息
 
 如果要解析json，建议使用https://bitbucket.org/yarosla/nxjson
 还有很多json的例子可以参考http://json.org/
 
 参数：global_exRef 外部引入的句柄，只是为了方便原调用方，方便使用
 **/
ROMANYSOFT_EXTERN void register_reportExecState(global_reportExecStateFunc_TYPE cb, void* global_exRef){
    global_reportExecStateFunc = cb;
    global_exRef_romanysoft = global_exRef;
}



/**
 真正调用内部功能的入口，模拟控制台调用方式(兼容以前的调用方式)
 特殊参数说明：life_arg。 必须传入的参数要等于 CHECK_LIFE_ROMANYSOFT宏的值，不然无法执行，返回的是个错误值
 **/
ROMANYSOFT_EXTERN int execCLI( int argc, char *argv[], char* life_arg  );
 
    
/**
 execCLI2 应用的扩展，主要新增可以附加jsondata.
 
 实现要求：有特殊需求的时候，可以使用此函数
 **/
ROMANYSOFT_EXTERN int execCLI2( int argc, char *argv[], char* life_arg, char* jsondata);
    

#ifdef __cplusplus
}
#endif


////////////////////////////////////////////////////////////////////////////////////////////////
#endif