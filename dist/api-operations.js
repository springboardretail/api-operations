(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["apiOperations"] = factory();
	else
		root["apiOperations"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// on error function for async loading
/******/ 	__webpack_require__.oe = function(err) { throw err; };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.putJson = exports.postJson = exports.getJson = undefined;
	exports.delete_ = delete_;
	exports.makeUri = makeUri;
	exports.createApiSource = createApiSource;

	var _fetchStatus = __webpack_require__(1);

	var mergeOptions = function mergeOptions(opts1, opts2) {
	  return Object.assign({}, opts1, opts2);
	};

	/**
	 * fetch's promise will actually resolve successfully even if the server returns a > 400 reponse
	 * see "Checking that the fetch was successful":
	 *  https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
	 */
	function safeFetch(url) {
	  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	  return fetch(url, options).then(_fetchStatus.checkStatus);
	}

	function fetchAndParse(url) {
	  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	  return safeFetch(url, options).then(_fetchStatus.parseResponse);
	}

	function sendJson(url, body) {
	  var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

	  var sendOptions = {
	    headers: {
	      Accept: 'application/json',
	      'Content-Type': 'application/json'
	    },
	    body: JSON.stringify(body)
	  };
	  return fetchAndParse(url, mergeOptions(sendOptions, options));
	}

	function _getJson(url, body) {
	  var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

	  return fetchAndParse(url, body, mergeOptions({ method: 'get' }, options));
	}

	exports.getJson = _getJson;
	function _postJson(url, body) {
	  var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

	  return sendJson(url, body, mergeOptions({ method: 'post' }, options));
	}

	exports.postJson = _postJson;
	function _putJson(url, body) {
	  var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

	  return sendJson(url, body, mergeOptions({ method: 'put' }, options));
	}

	// using 'delete_' because 'delete' is a reserved keyword
	exports.putJson = _putJson;
	function delete_(url) {
	  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	  return fetchAndParse(url, mergeOptions({ method: 'delete' }, options));
	}

	function makeUri(baseUrl, endPoint) {
	  // Trim ending '/' from baseUrl, and starting one from endPoint
	  // Hardcode '/' between 'trimmed' baseUrl and endpoint
	  return baseUrl.replace(/(\/$)/, '') + '/' + endPoint.replace(/(^\/)/, '');
	}

	// Creates an object with helper methods to query an API point
	function createApiSource(baseUrl) {
	  var baseOptions = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	  return {
	    getJson: function getJson() {
	      var endPoint = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
	      var options = arguments[1];
	      return _getJson(makeUri(baseUrl, endPoint), mergeOptions(baseOptions, options));
	    },

	    postJson: function postJson() {
	      var endPoint = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
	      var body = arguments[1];
	      var options = arguments[2];
	      return _postJson(makeUri(baseUrl, endPoint), body, mergeOptions(baseOptions, options));
	    },

	    putJson: function putJson() {
	      var endPoint = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
	      var body = arguments[1];
	      var options = arguments[2];
	      return _putJson(makeUri(baseUrl, endPoint), body, mergeOptions(baseOptions, options));
	    },

	    delete: function _delete() {
	      var endPoint = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
	      var options = arguments[1];
	      return delete_(makeUri(baseUrl, endPoint), mergeOptions(baseOptions, options));
	    }
	  };
	}

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.checkStatus = checkStatus;
	exports.parseResponse = parseResponse;
	/*
	 * Checks status of a response
	 * @see https://github.com/github/fetch#handling-http-error-statuses
	 * @note best used in a fetch promises chain, where an error can be easily caught.
	 */
	function checkStatus(response) {
	  if (response.status >= 200 && response.status < 300) {
	    return response;
	  }
	  return parseResponse(response).then(function (error) {
	    throw parseError(error, response);
	  });
	}

	function parseResponse(response) {
	  if (response.headers.get('Content-Type') === 'application/json') {
	    return response.json();
	  }
	  return response.text();
	}

	function parseError(error, response) {
	  var _error = new Error(error.message || response.statusText);
	  _error.name = error.error || response.status;
	  _error.response = response;
	  _error.body = error;
	  return _error;
	}

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _apiOperations = __webpack_require__(0);

	var _apiOperations2 = _interopRequireDefault(_apiOperations);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = _apiOperations2.default; // just an exporter for the modules

/***/ }
/******/ ])
});
;