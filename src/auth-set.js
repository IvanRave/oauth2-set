/**
 * Set of auth-issuers plus addt elems
 * @module
 */

var mdlFbIssuer = require('./auth-issuer-fb');
var mdlGoogIssuer = require('./auth-issuer-goog');
var mdlDevIssuer = require('./auth-issuer-dev');

/**
 * Auth set
 * @constructor
 */
var Mdl = function(data, issData){
  this.handleAuthResult = data.handleAuthResult;
  this.zpath = data.zpath;
  this.tmplAuthButton = data.tmplAuthButton;
  this.tmplAuthPreButton = data.tmplAuthPreButton;

  /**
   * DOM element: wrap of generated markup
   *    Can be created dynamically, therefore is null (init later)
   */
  this.parentElem = null;

  this.issData = issData;

  this.authIssuers = null;
  this.loadAuthIssuers();
};

Mdl.prototype.initAuthIssuer = function(item, ind) {
  var mdlIssuer;
  if (item.id === 'fb') {
    mdlIssuer = mdlFbIssuer;
  } else if (item.id === 'goog') {
    mdlIssuer = mdlGoogIssuer;
  } else if (item.id === 'dev') {
    mdlIssuer = mdlDevIssuer;
  } else {
    // nothing
    throw new Error('nosuchissuer');
  }
  var obj = mdlIssuer.init(item,
    this.zpath + '.authIssuers[' + ind + ']',
    this.handleAuthResult,
    this.buildAuthButtons.bind(this),
    this.tmplAuthButton,
    this.tmplAuthPreButton);
  return obj;
};

Mdl.prototype.loadAuthIssuers = function() {
  this.authIssuers = this.issData.map(this.initAuthIssuer.bind(this));
};

/**
 * Fill a block with login buttons
 */
Mdl.prototype.fillLoginChoice = function(parentElem) {
  this.parentElem = parentElem;
  // start load libs for buttons
  // load only once per page: isLoadStarted
  this.authIssuers.forEach(function(issItem) {
    if (!issItem.isLoadStarted) {
      issItem.isLoadStarted = true;
      issItem.loadAuthLib();
    }
  });

  // draw pre or ready buttons
  this.buildAuthButtons();
};

Mdl.prototype.buildAuthButtons = function() {
  var htmlButtons = this.authIssuers.map(function(issItem) {
    return issItem.buildHtml();
  }).join('');

  // authButtons places in auth-popup window
  // but can be moved as separate module on the page
  this.parentElem.innerHTML = htmlButtons;
};

exports.init = function(){
  var obj = Object.create(Mdl.prototype);
  Mdl.apply(obj, arguments);
  return obj;
};

module.exports = exports;

