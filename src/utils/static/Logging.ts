import LoggingDebugLevel from '../../enums/LoggingDebugLevel'

export default class Logging {
    static debugLevel: LoggingDebugLevel = LoggingDebugLevel.None
    static isShowTrace: boolean = false

    static message(cb: (...values: any[]) => void, needLevel: LoggingDebugLevel, ...values: any[]): void {
        if(Logging.debugLevel >= needLevel) {
            cb(...values)
            if(Logging.isShowTrace) console.trace(cb.name)
        }
    }

    static error(...values: any[]): void {
        Logging.message(console.error, LoggingDebugLevel.Error, ...values)
    }

    static warn(...values: any[]): void {
        Logging.message(console.warn, LoggingDebugLevel.Warn, ...values)
    }

    static debug(...values: any[]): void {
        Logging.message(console.log, LoggingDebugLevel.Debug, ...values)
    }

    static info(...values: any[]): void {
        Logging.message(console.info, LoggingDebugLevel.Info, ...values)
    }

    static engineError(...values: any[]): void {
        Logging.message(console.error, LoggingDebugLevel.EngineError, ...values)
    }

    static engineWarn(...values: any[]): void {
        Logging.message(console.warn, LoggingDebugLevel.EngineWarn, ...values)
    }

    static engineLog(...values: any[]): void {
        Logging.message(console.log, LoggingDebugLevel.EngineLog, ...values)
    }
}