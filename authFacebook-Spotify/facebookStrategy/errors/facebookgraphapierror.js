function FacebookGraphAPIError(message, type, code, subcode, traceID) {
    Error.call(this);
    Error.captureStackTrace(this, arguments.callee);
    this.name = 'FacebookGraphAPIError';
    this.message = message;
    this.type = type;
    this.code = code;
    this.subcode = subcode;
    this.traceID = traceID;
    this.status = 500;
}

// Inherit from `Error`.
FacebookGraphAPIError.prototype.__proto__ = Error.prototype;


// Expose constructor.
module.exports = FacebookGraphAPIError;