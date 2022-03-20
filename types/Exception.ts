//From @poppinss/utils v.4.0.2

export class Exception extends Error {
    public name: string
    public message: string
    public help?: string
    public code?: string
    public status: number
  
    constructor(message: string, status: number = 500, code?: string) {
      super(message)
      this.name = this.constructor.name
      this.message = message
      this.status = status
  
      /**
       * Set error code as a public property (only when defined)
       */
      if (code) {
        Object.defineProperty(this, 'code', {
          configurable: true,
          enumerable: false,
          value: code,
          writable: true,
        })
      }
  
      /**
       * Update the stack trace
       */
      Error.captureStackTrace(this, this.constructor)
    }
  }