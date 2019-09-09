import parseArgv from './parseArgv';
const args = parseArgv([], ['DEBUG']);
const logLevel = args.DEBUG ? 'debug' : 'info';

/**
 * 正常执行日志信息
 * @param msg 
 */
function writeInfoLog(msg: string) {
    console.info(`info:${msg}`)
}
/**
 * 需要跟踪调试的日志信息
 * @param msg 
 */
function writeDebugLog(msg: string) {
    if (logLevel) {
        console.debug(`debug:${msg}`);
    }
}
/**
 * 错误异常日志信息
 * @param msg 
 */
function writeErrorLog(msg: string) {
    console.error(`error:${msg}`);
}

export {
    writeInfoLog,
    writeDebugLog,
    writeErrorLog
}
