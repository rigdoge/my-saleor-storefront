import { toast } from '@/components/ui/use-toast'

// 错误类型
export enum ErrorType {
  NETWORK = 'network',
  AUTH = 'auth',
  VALIDATION = 'validation',
  SERVER = 'server',
  UNKNOWN = 'unknown',
}

// 错误处理选项
interface ErrorHandlerOptions {
  showToast?: boolean
  logToConsole?: boolean
  throwError?: boolean
  context?: string
}

// 默认选项
const defaultOptions: ErrorHandlerOptions = {
  showToast: true,
  logToConsole: true,
  throwError: false,
  context: '',
}

// 错误日志记录
interface ErrorLog {
  timestamp: string;
  type: ErrorType;
  message: string;
  context?: string;
  stack?: string;
}

// 错误日志存储
class ErrorLogger {
  private static instance: ErrorLogger;
  private logs: ErrorLog[] = [];
  private maxLogs: number = 100;

  private constructor() {}

  public static getInstance(): ErrorLogger {
    if (!ErrorLogger.instance) {
      ErrorLogger.instance = new ErrorLogger();
    }
    return ErrorLogger.instance;
  }

  public log(error: Error, type: ErrorType, context?: string): void {
    // 创建新日志
    const newLog: ErrorLog = {
      timestamp: new Date().toISOString(),
      type,
      message: error.message,
      context,
      stack: error.stack
    };

    // 添加到日志列表
    this.logs.unshift(newLog);

    // 限制日志数量
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs);
    }

    // 在开发环境下，将错误发送到控制台
    if (process.env.NODE_ENV === 'development') {
      console.error(`[${type.toUpperCase()}] ${context ? `[${context}] ` : ''}${error.message}`, error);
    }

    // 在生产环境下，可以将错误发送到服务器
    if (process.env.NODE_ENV === 'production' && typeof window !== 'undefined') {
      // 这里可以添加将错误发送到服务器的代码
      // 例如使用 fetch 发送到错误收集 API
      this.sendToServer(newLog);
    }
  }

  private sendToServer(log: ErrorLog): void {
    // 如果配置了错误收集 API，则发送错误
    const errorApiUrl = process.env.NEXT_PUBLIC_ERROR_API_URL;
    if (!errorApiUrl) return;

    try {
      fetch(errorApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(log),
        // 使用 keepalive 确保即使页面关闭也能发送
        keepalive: true
      }).catch(e => console.error('Failed to send error to server:', e));
    } catch (e) {
      console.error('Failed to send error to server:', e);
    }
  }

  public getLogs(): ErrorLog[] {
    return [...this.logs];
  }

  public clearLogs(): void {
    this.logs = [];
  }
}

/**
 * 通用错误处理函数
 */
export function handleError(
  error: unknown,
  type: ErrorType = ErrorType.UNKNOWN,
  customOptions?: Partial<ErrorHandlerOptions>
) {
  const options = { ...defaultOptions, ...customOptions }
  const { showToast, logToConsole, throwError, context } = options
  
  // 确保错误是Error对象
  const err = error instanceof Error ? error : new Error(String(error))
  
  // 根据错误类型生成用户友好的消息
  let title = '操作失败'
  let description = err.message || '发生未知错误，请稍后重试'
  
  switch (type) {
    case ErrorType.NETWORK:
      title = '网络错误'
      description = '连接服务器失败，请检查您的网络连接'
      break
    case ErrorType.AUTH:
      title = '认证错误'
      description = '您的登录已过期或无效，请重新登录'
      break
    case ErrorType.VALIDATION:
      title = '输入错误'
      // 保留原始消息，通常是验证错误
      break
    case ErrorType.SERVER:
      title = '服务器错误'
      description = '服务器处理请求时出错，请稍后重试'
      break
  }
  
  // 显示toast通知
  if (showToast) {
    toast({
      title,
      description,
      variant: 'destructive',
    })
  }
  
  // 记录到控制台
  if (logToConsole) {
    // 使用错误日志记录器
    ErrorLogger.getInstance().log(err, type, context);
  }
  
  // 重新抛出错误
  if (throwError) {
    throw err
  }
  
  return {
    title,
    description,
    error: err,
  }
}

/**
 * 网络错误处理
 */
export function handleNetworkError(error: unknown, options?: Partial<ErrorHandlerOptions>) {
  return handleError(error, ErrorType.NETWORK, options)
}

/**
 * 认证错误处理
 */
export function handleAuthError(error: unknown, options?: Partial<ErrorHandlerOptions>) {
  return handleError(error, ErrorType.AUTH, options)
}

/**
 * 验证错误处理
 */
export function handleValidationError(error: unknown, options?: Partial<ErrorHandlerOptions>) {
  return handleError(error, ErrorType.VALIDATION, options)
}

/**
 * 服务器错误处理
 */
export function handleServerError(error: unknown, options?: Partial<ErrorHandlerOptions>) {
  return handleError(error, ErrorType.SERVER, options)
}

// 导出错误日志记录器
export const errorLogger = ErrorLogger.getInstance(); 