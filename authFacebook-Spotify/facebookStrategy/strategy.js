// Load modules.
var OAuth2Strategy = require('passport-oauth2')
    , util = require('util')
    , uri = require('url')
    , crypto = require('crypto')
    , Profile = require('./profile')
    , InternalOAuthError = require('passport-oauth2').InternalOAuthError
    , FacebookAuthorizationError = require('./errors/facebookauthorizationerror')
    , FacebookTokenError = require('./errors/facebooktokenerror')
    , FacebookGraphAPIError = require('./errors/facebookgraphapierror');

function Strategy(options, verify) {
    options = options || {};
    var version = options.graphAPIVersion || 'v3.2';

    options.authorizationURL = options.authorizationURL || 'https://www.facebook.com/' + version + '/dialog/oauth';
    options.tokenURL = options.tokenURL || 'https://graph.facebook.com/' + version + '/oauth/access_token';
    options.scopeSeparator = options.scopeSeparator || ',';

    OAuth2Strategy.call(this, options, verify);
    this.name = 'facebook';
    this._profileURL = options.profileURL || 'https://graph.facebook.com/' + version + '/me';
    this._profileFields = options.profileFields || null;
    this._enableProof = options.enableProof;
    this._clientSecret = options.clientSecret;
}

util.inherits(Strategy, OAuth2Strategy);


Strategy.prototype.authenticate = function (req, options) {

    if (req.query && req.query.error_code && !req.query.error) {
        return this.error(new FacebookAuthorizationError(req.query.error_message, parseInt(req.query.error_code, 10)));
    }

    OAuth2Strategy.prototype.authenticate.call(this, req, options);
};
Strategy.prototype.authorizationParams = function (options) {
    var params = {};

    // https://developers.facebook.com/docs/reference/dialogs/oauth/
    if (options.display) {
        params.display = options.display;
    }

    // https://developers.facebook.com/docs/facebook-login/reauthentication/
    if (options.authType) {
        params.auth_type = options.authType;
    }
    if (options.authNonce) {
        params.auth_nonce = options.authNonce;
    }

    return params;
};

Strategy.prototype.userProfile = function (accessToken, done) {
    var url = uri.parse(this._profileURL);
    if (this._enableProof) {
        var proof = crypto.createHmac('sha256', this._clientSecret).update(accessToken).digest('hex');
        url.search = (url.search ? url.search + '&' : '') + 'appsecret_proof=' + proof;
    }
    if (this._profileFields) {
        var fields = this._convertProfileFields(this._profileFields);
        if (fields !== '') { url.search = (url.search ? url.search + '&' : '') + 'fields=' + fields; }
    }
    url = uri.format(url);

    this._oauth2.get(url, accessToken, function (err, body, res) {
        var json;

        if (err) {
            if (err.data) {
                try {
                    json = JSON.parse(err.data);
                } catch (_) { }
            }

            if (json && json.error && typeof json.error == 'object') {
                return done(new FacebookGraphAPIError(json.error.message, json.error.type, json.error.code, json.error.error_subcode, json.error.fbtrace_id));
            }
            return done(new InternalOAuthError('Failed to fetch user profile', err));
        }

        try {
            json = JSON.parse(body);
        } catch (ex) {
            return done(new Error('Failed to parse user profile'));
        }

        var profile = Profile.parse(json);
        profile.provider = 'facebook';
        profile._raw = body;
        profile._json = json;

        done(null, profile);
    });
};

Strategy.prototype.parseErrorResponse = function (body, status) {
    var json = JSON.parse(body);
    if (json.error && typeof json.error == 'object') {
        return new FacebookTokenError(json.error.message, json.error.type, json.error.code, json.error.error_subcode, json.error.fbtrace_id);
    }
    return OAuth2Strategy.prototype.parseErrorResponse.call(this, body, status);
};

Strategy.prototype._convertProfileFields = function (profileFields) {
    var map = {
        'id': 'id',
        'username': 'username',
        'displayName': 'name',
        'name': ['last_name', 'first_name', 'middle_name'],
        'gender': 'gender',
        'birthday': 'birthday',
        'profileUrl': 'link',
        'emails': 'email',
        'photos': 'picture'
    };

    var fields = [];

    profileFields.forEach(function (f) {

        if (typeof map[f] === 'undefined') { return fields.push(f); };

        if (Array.isArray(map[f])) {
            Array.prototype.push.apply(fields, map[f]);
        } else {
            fields.push(map[f]);
        }
    });

    return fields.join(',');
};

module.exports = Strategy;