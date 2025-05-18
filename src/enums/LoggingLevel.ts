/**
 * Enum that defines which messages will be displayed in the console
 * 
 * Each level includes messages from the previous levels
 * 
 * Пример:
 * ```js
 * Logging.debugLevel = LoggingLevel.None
 * Logging.info("Info") // doesn't displayed
 * Logging.error("Error") // doesn't displayed
 * Logging.Warn("Warning") // doesn't displayed
 * 
 * Logging.debugLevel = LoggingLevel.Info
 * Logging.info("Info") // displayed
 * Logging.error("Error") // doesn't displayed
 * Logging.Warn("Warning") // doesn't displayed
 * 
 * Logging.debugLevel = LoggingLevel.Error
 * Logging.info("Info") // displayed
 * Logging.error("Error") // displayed
 * Logging.Warn("Warning") // doesn't displayed
 * 
 * Logging.debugLevel = LoggingLevel.Warn
 * Logging.info("Info") // displayed
 * Logging.error("Error") // displayed
 * Logging.Warn("Warning") // displayed
 * ```
 */

enum LoggingLevel {
    /**
     * No messages from Logging will be displayed in the console
     */
    None,
    /**
     * Only informational messages will be displayed
     */
    Info,
    /**
     * Errors will also be displayed
     */
    Error,
    /**
     * Warnings will also be displayed
     */
    Warn,
    /**
     * Debug messages will also be displayed
     */
    Debug,
    /**
     * Engine errors will also be displayed
     */
    EngineError,
    /**
     * Engine warnings will also be displayed
     */
    EngineWarn,
    /**
     * Engine messages will also be displayed
     */
    EngineLog,
    /**
     * Very frequent engine messages will also be displayed
     */
    EngineSpam,
    /**
     * All types of messages are displayed in the console
     */
    Full
}


export default LoggingLevel