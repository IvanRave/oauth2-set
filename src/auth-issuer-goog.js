/** 
 * Helper for goog issuer
 * @module
 */

var mdlAuthIssuer = require('./auth-issuer');

/**
 * Goog issuer
 * @constructor
 * @augments module:common/auth-issuer~Mdl
 */
var Mdl = function() {
  mdlAuthIssuer.inhProps(this, arguments);
};

mdlAuthIssuer.inhMethods(Mdl);

/**
 * When sign in is finished
 */
Mdl.prototype.handleGoogSignIn = function(authResult) {
  console.log('authResult', authResult);
  if (authResult['status']['signed_in']) {
    // http://stackoverflow.com/questions/23020733/google-login-hitting-twice
    if (authResult['status']['method'] === 'PROMPT') {
      this.social_token = authResult.access_token;
      this.postLoginToApi();

      // send to our server authResult.access_token
      // 

    }

    // send to our server
    // Update the app to reflect a signed in user
    // Hide the sign-in button now that the user is authorized, for example:
  } else {
    // Update the app to reflect a signed out user
    // Possible error values:
    //   "user_signed_out" - User is signed-out
    //   "access_denied" - User denied access to your app
    //   "immediate_failed" - Could not automatically log in the user
    console.log('Sign-in state: ' + authResult['error']);
    //    alert('error');
    //    next(new Error(authResult.error));
  }
};

//  https://developers.google.com/+/web/signin/javascript-flow
// When Google lib is already loaded - run SingIn method
Mdl.prototype.startAuth = function(elem) {
  elem.disabled = true;

  console.log('goog signin');
  //    console.log('gapi', window.gapi);
  // console.log('gapiauth', window.gapi.auth);

  this.authLib.auth.signIn({
    clientid: this.app_id,
    scope: 'profile',
    //    requestvisibleactions: 'https://schema.org/AddAction', // forbidden for scope=profile
    cookiepolicy: 'none', // 'single_host_origin',
    callback: this.handleGoogSignIn.bind(this)
  });
};

/** 
 * Loaded goog lib
 */
Mdl.prototype.handleAuthLib = function() {
  if (!window.gapi || !window.gapi.auth) {
    alert('Auth provider error. Try later (few seconds)');
    return;
  }
  this.authLib = window.gapi;
  console.log('googlib is loaded');
  this.activate();
};

/**
 * Load Google lib for SignIn and other methods
 */
var loadGoogLib = function(fname) {
  var po = document.createElement('script');
  po.type = 'text/javascript';
  po.async = true;
  po.defer = true;

  // onload doesn't work right after. gapi.auth and gapi.client is undefined
  //  po.src = 'https://plus.google.com/js/client:plusone.js';
  //  po.onload = next;
  //    script src="https://apis.google.com/js/client:platform.js" async defer></script>
  // po.src = "https://apis.google.com/js/client:plusone.js";
  po.src = "https://apis.google.com/js/client:platform.js?onload=" + fname;
  var s = document.getElementsByTagName('script')[0];
  s.parentNode.insertBefore(po, s);
};

/**
 * Load Goog auth lib
 */
Mdl.prototype.loadAuthLib = function() {
  window.googAsyncInit = this.handleAuthLib.bind(this); 
  loadGoogLib('googAsyncInit');
};

/**
 * Creates an instance
 */
exports.init = function() {
  var obj = Object.create(Mdl.prototype);
  Mdl.apply(obj, arguments);
  return obj;
};

module.exports = exports;
