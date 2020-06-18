const util = require('util'),
    querystring = require('querystring'),
    OAuth2Strategy = require('passport-oauth').OAuth2Strategy,
    InternalOAuthError = require('passport-oauth').InternalOAuthError;

function Strategy(options, verify) {
    options = options || {};
    options.authorizationURL = options.authorizationURL || 'https://accounts.spotify.com/authorize';
    options.tokenURL = options.tokenURL || 'https://accounts.spotify.com/api/token';
    options.scopeSeparator = options.scopeSeparator || ' ';

    OAuth2Strategy.call(this, options, verify);
    this.name = 'spotify';
    this._userProfileURL =
        options.userProfileURL || 'https://api.spotify.com/v1/me';

    this._oauth2.getOAuthAccessToken = function (code, params, callback) {
        params = params || {};
        var codeParam =
            params.grant_type === 'refresh_token' ? 'refresh_token' : 'code';
        params[codeParam] = code;
        params['client_id'] = this._clientId;
        params['client_secret'] = this._clientSecret;

        var post_data = querystring.stringify(params);
        var post_headers = {
            'Content-Type': 'application/x-www-form-urlencoded'
        };

        this._request(
            'POST',
            this._getAccessTokenUrl(),
            post_headers,
            post_data,
            null,
            function (error, data, response) {
                if (error) callback(error);
                else {
                    var results = JSON.parse(data);
                    var access_token = results.access_token;
                    var refresh_token = results.refresh_token;
                    var expires_in = results.expires_in;
                    delete results.refresh_token;
                    callback(null, access_token, refresh_token, expires_in, results); // callback results =-=
                }
            }
        );
    };
}

util.inherits(Strategy, OAuth2Strategy);

Strategy.prototype.authorizationParams = function (options) {
    var params = {};

    if (options.showDialog) {
        params.show_dialog = options.showDialog;
    }

    return params;
};

Strategy.prototype.userProfile = function (accessToken, done) {
    var authorization = 'Bearer ' + accessToken;
    var headers = {
        Authorization: authorization
    };
    this._oauth2._request('GET', this._userProfileURL, headers, '', '', function (
        err,
        body,
        res
    ) {
        if (err) {
            return done(new InternalOAuthError('failed to fetch user profile', err));
        }

        try {
            var json = JSON.parse(body);

            var profile = {
                provider: 'spotify',
                id: json.id,
                username: json.id,
                displayName: json.display_name,
                profileUrl: json.external_urls ? json.external_urls.spotify : null,
                photos: json.images
                    ? json.images.map(function (image) {
                        return image.url;
                    })
                    : null,
                country: json.country || null,
                followers: json.followers ? json.followers.total : null,
                product: json.product || null,
                _raw: body,
                _json: json
            };

            if (json.email) {
                profile.emails = [
                    {
                        value: json.email,
                        type: null
                    }
                ];
            }

            done(null, profile);
        } catch (e) {
            done(e);
        }
    });
};
module.exports = Strategy;
