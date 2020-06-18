function FacebookTokenError(message, type, code, subcode, traceID) {
    Error.call(this);
    Error.captureStackTrace(this, arguments.callee);
    this.name = 'FacebookTokenError';
    this.message = message;
    this.type = type;
    this.code = code;
    this.subcode = subcode;
    this.traceID = traceID;
    this.status = 500;
}

// Inherit from `Error`.
FacebookTokenError.prototype.__proto__ = Error.prototype;


// Expose constructor.
module.exports = FacebookTokenError;