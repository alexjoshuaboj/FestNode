function FacebookAuthorizationError(message, code) {
    Error.call(this);
    Error.captureStackTrace(this, arguments.callee);
    this.name = 'FacebookAuthorizationError';
    this.message = message;
    this.code = code;
    this.status = 500;
}

// Inherit from `Error`.
FacebookAuthorizationError.prototype.__proto__ = Error.prototype;


// Expose constructor.
module.exports = FacebookAuthorizationError;