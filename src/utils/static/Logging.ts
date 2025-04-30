import LoggingLevel from '../../enums/LoggingLevel'

export default class Logging {
    static debugLevel: LoggingLevel = LoggingLevel.None
    static isShowTrace: boolean = false

    static message(cb: (...values: any[]) => void, needLevel: LoggingLevel, ...values: any[]): void {
        if(Logging.debugLevel >= needLevel) {
            cb(...values)
            if(Logging.isShowTrace) console.trace(cb.name)
        }
    }

    static error(...values: any[]): void {
        Logging.message(console.error, LoggingLevel.Error, ...values)
    }

    static warn(...values: any[]): void {
        Logging.message(console.warn, LoggingLevel.Warn, ...values)
    }

    static debug(...values: any[]): void {
        Logging.message(console.log, LoggingLevel.Debug, ...values)
    }

    static info(...values: any[]): void {
        Logging.message(console.info, LoggingLevel.Info, ...values)
    }

    static engineError(...values: any[]): void {
        Logging.message(console.error, LoggingLevel.EngineError, ...values)
    }

    static engineWarn(...values: any[]): void {
        Logging.message(console.warn, LoggingLevel.EngineWarn, ...values)
    }

    static engineLog(...values: any[]): void {
        Logging.message(console.log, LoggingLevel.EngineLog, ...values)
    }

    static engineSpam(...values: any[]): void {
        Logging.message(console.log, LoggingLevel.EngineSpam, ...values)
    }
}