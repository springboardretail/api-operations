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
	exports.patchJson = exports.putJson = exports.postJson = exports.get = undefined;
	exports.delete_ = delete_;
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
	function safeFetch(url, fetchOptions, operationOptions) {
	  return fetch(url, fetchOptions).then(function (res) {
	    return (0, _fetchStatus.checkStatus)(res, operationOptions);
	  });
	}

	function fetchAndParse(url) {
	  var fetchOptions = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
	  var operationOptions = arguments[2];

	  return safeFetch(url, fetchOptions, operationOptions).then(_fetchStatus.parseResponse);
	}

	function sendJson(url, body, fetchOptions, operationOptions) {
	  var sendOptions = {
	    headers: {
	      Accept: 'application/json',
	      'Content-Type': 'application/json'
	    },
	    body: JSON.stringify(body)
	  };
	  return fetchAndParse(url, mergeOptions(sendOptions, fetchOptions), operationOptions);
	}

	function _get(url, fetchOptions, operationOptions) {
	  return fetchAndParse(url, mergeOptions({ method: 'get' }, fetchOptions), operationOptions);
	}

	exports.get = _get;
	function _postJson(url, body, fetchOptions, operationOptions) {
	  return sendJson(url, body, mergeOptions({ method: 'post' }, fetchOptions), operationOptions);
	}

	exports.postJson = _postJson;
	function _putJson(url, body, fetchOptions, operationOptions) {
	  return sendJson(url, body, mergeOptions({ method: 'put' }, fetchOptions), operationOptions);
	}

	exports.putJson = _putJson;
	function _patchJson(url, body, fetchOptions, operationOptions) {
	  return sendJson(url, body, mergeOptions({ method: 'patch' }, fetchOptions), operationOptions);
	}

	// using 'delete_' because 'delete' is a reserved keyword
	exports.patchJson = _patchJson;
	function delete_(url, fetchOptions, operationOptions) {
	  return fetchAndParse(url, mergeOptions({ method: 'delete' }, fetchOptions), operationOptions);
	}

	function makeUri(baseUrl, endPoint) {
	  // if endPoint starts with "http://" or "https://" throw an error
	  if (/^https?:\/\//.test(endPoint)) {
	    throw new Error('Endpoint seems invalid: "' + endPoint + '"');
	  }
	  // Trim ending '/' from baseUrl, and starting one from endPoint
	  // Hardcode '/' between 'trimmed' baseUrl and endpoint
	  return baseUrl.replace(/(\/$)/, '') + '/' + endPoint.replace(/(^\/)/, '');
	}

	// Creates an object with helper methods to query an API point
	function createApiSource(baseUrl, baseFetchOptions, baseOperationOptions) {
	  return {
	    get: function get() {
	      var endPoint = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
	      var fetchOptions = arguments[1];
	      var operationOptions = arguments[2];
	      return _get(makeUri(baseUrl, endPoint), mergeOptions(baseFetchOptions, fetchOptions), mergeOptions(baseOperationOptions, operationOptions));
	    },

	    postJson: function postJson() {
	      var endPoint = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
	      var body = arguments[1];
	      var fetchOptions = arguments[2];
	      var operationOptions = arguments[3];
	      return _postJson(makeUri(baseUrl, endPoint), body, mergeOptions(baseFetchOptions, fetchOptions), mergeOptions(baseOperationOptions, operationOptions));
	    },

	    putJson: function putJson() {
	      var endPoint = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
	      var body = arguments[1];
	      var fetchOptions = arguments[2];
	      var operationOptions = arguments[3];
	      return _putJson(makeUri(baseUrl, endPoint), body, mergeOptions(baseFetchOptions, fetchOptions), mergeOptions(baseOperationOptions, operationOptions));
	    },

	    patchJson: function patchJson() {
	      var endPoint = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
	      var body = arguments[1];
	      var fetchOptions = arguments[2];
	      var operationOptions = arguments[3];
	      return _patchJson(makeUri(baseUrl, endPoint), body, mergeOptions(baseFetchOptions, fetchOptions), mergeOptions(baseOperationOptions, operationOptions));
	    },

	    delete: function _delete() {
	      var endPoint = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
	      var fetchOptions = arguments[1];
	      var operationOptions = arguments[2];
	      return delete_(makeUri(baseUrl, endPoint), mergeOptions(baseFetchOptions, fetchOptions), mergeOptions(baseOperationOptions, operationOptions));
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
	  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	  var statusValidator = returnIfFunctionExists(options.statusValidator);
	  var errorParser = returnIfFunctionExists(options.errorParser);

	  var isValidRange = statusValidator ? statusValidator(response.status) : response.status >= 200 && response.status < 300;

	  if (isValidRange) {
	    return response;
	  }

	  return parseResponse(response).then(function (error) {
	    throw parseError(error, response, errorParser);
	  });
	}

	function parseResponse(response) {
	  if (response.headers.get('Content-Type') === 'application/json') {
	    return response.json();
	  }
	  return response.text();
	}

	function parseError(error, response, errorParser) {
	  var _error = new Error(error.message || response.statusText);
	  _error.name = error.error || response.status;
	  _error.response = response;
	  _error.body = error;
	  return errorParser ? errorParser(error, response) : _error;
	}

	function returnIfFunctionExists(object) {
	  var isFunction = function isFunction(obj) {
	    return {}.toString.call(obj) === '[object Function]';
	  };
	  if ((object !== undefined || object !== null) && isFunction(object)) {
	    return object;
	  }
	  return false;
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