/**
 * Module dependencies.
 */
var passport = require('passport-strategy')
  , util = require('util');


/**
 * `Strategy` constructor.
 *
 * @param {Object} options
 * @param {Gateway} algorithms
 * @param {Function} fetch
 * @api public
 */
function Strategy(options, algorithms, fetch) {
  if (!options || typeof options.verify == 'function') {
    fetch = algorithms;
    algorithms = options;
    options = {};
  }
  if (typeof options == 'function') {
    fetch = algorithms;
    algorithms = options;
  }
  if (typeof algorithms == 'function') {
    fetch = algorithms;
    algorithms = undefined;
  }
  
  if (!algorithms) { throw new TypeError('OTPStrategy requires an algorithm registry'); }
  if (!fetch) { throw new TypeError('OTPStrategy requires a fetch callback'); }
  
  this._useridField = options.useridField || 'uid';
  this._otpField = options.otpField || 'otp';
  
  passport.Strategy.call(this);
  this.name = 'otp';
  this._algorithms = algorithms;
  this._fetch = fetch;
  this._passReqToCallback = options.passReqToCallback;
}

/**
 * Inherit from `passport.Strategy`.
 */
util.inherits(Strategy, passport.Strategy);

/**
 * Authenticate request based on the contents of a form submission.
 *
 * @param {Object} req
 * @api protected
 */
Strategy.prototype.authenticate = function(req, options) {
  options = options || {};
  var uid = req.body && req.body[this._useridField];
  var otp = req.body && req.body[this._otpField];
  
  if (!uid || !otp) {
    return this.fail({ message: options.badRequestMessage || 'Missing credentials' }, 400);
  }
  
  var self = this;
  
  function fetched(err, user, authnrs) {
    if (err) { return self.error(err); }
    if (!Array.isArray(authnrs)) {
      authnrs = [ authnrs ];
    }
    
    var authnr
      , i = 0;
    
    (function iter(err) {
      if (err) { return self.error(err); }
      
      authnr = authnrs[i++];
      if (!authnr) {
        return self.fail();
      }
      
      function verified(err, ok) {
        if (err) { return iter(err); }
        if (!ok) { return iter(); }
        
        var info = { method: 'otp' };
        return self.success(user, info);
      }
    
      self._algorithms.verify(authnr, otp, verified);
    })();
  }
  
  try {
    if (self._passReqToCallback) {
      this._fetch(req, uid, fetched);
    } else {
      this._fetch(uid, fetched);
    }
  } catch (ex) {
    return self.error(ex);
  }
};


/**
 * Expose `Strategy`.
 */
module.exports = Strategy;
