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
	exports.patchJson = exports.putJson = exports.postJson = exports.getQuery = exports.get = undefined;
	exports.delete_ = delete_;
	exports.createApiSource = createApiSource;

	var _fetchStatus = __webpack_require__(1);

	var _querystring = __webpack_require__(5);

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

	  return safeFetch(url, fetchOptions, operationOptions).then(function (res) {
	    return operationOptions && operationOptions.dontParse ? res : (0, _fetchStatus.parseResponse)(res);
	  });
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
	function _getQuery(url, query, fetchOptions, operationOptions) {
	  var hasQuery = function hasQuery(uri) {
	    return (/\?/.test(uri)
	    );
	  };
	  return _get('' + url + (hasQuery(url) ? '&' : '?') + (0, _querystring.stringify)(query), fetchOptions, operationOptions);
	}

	exports.getQuery = _getQuery;
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

	function makeUri(baseUrl, endpoint) {
	  // if endpoint starts with "http://" or "https://" throw an error
	  if (/^https?:\/\//.test(endpoint)) {
	    throw new Error('Endpoint seems invalid: "' + endpoint + '"');
	  }
	  // Trim ending '/' from baseUrl, and starting one from endpoint
	  // Hardcode '/' between 'trimmed' baseUrl and endpoint
	  return baseUrl.replace(/(\/$)/, '') + '/' + endpoint.toString().replace(/(^\/)/, '');
	}

	// Creates an object with helper methods to query an API point
	function createApiSource(baseUrl, baseFetchOptions, baseOperationOptions) {
	  return {
	    get: function get() {
	      var endpoint = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
	      var fetchOptions = arguments[1];
	      var operationOptions = arguments[2];
	      return _get(makeUri(baseUrl, endpoint), mergeOptions(baseFetchOptions, fetchOptions), mergeOptions(baseOperationOptions, operationOptions));
	    },

	    getQuery: function getQuery() {
	      var endpoint = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
	      var query = arguments[1];
	      var fetchOptions = arguments[2];
	      var operationOptions = arguments[3];
	      return _getQuery(makeUri(baseUrl, endpoint), query, mergeOptions(baseFetchOptions, fetchOptions), mergeOptions(baseOperationOptions, operationOptions));
	    },

	    postJson: function postJson() {
	      var endpoint = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
	      var body = arguments[1];
	      var fetchOptions = arguments[2];
	      var operationOptions = arguments[3];
	      return _postJson(makeUri(baseUrl, endpoint), body, mergeOptions(baseFetchOptions, fetchOptions), mergeOptions(baseOperationOptions, operationOptions));
	    },

	    putJson: function putJson() {
	      var endpoint = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
	      var body = arguments[1];
	      var fetchOptions = arguments[2];
	      var operationOptions = arguments[3];
	      return _putJson(makeUri(baseUrl, endpoint), body, mergeOptions(baseFetchOptions, fetchOptions), mergeOptions(baseOperationOptions, operationOptions));
	    },

	    patchJson: function patchJson() {
	      var endpoint = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
	      var body = arguments[1];
	      var fetchOptions = arguments[2];
	      var operationOptions = arguments[3];
	      return _patchJson(makeUri(baseUrl, endpoint), body, mergeOptions(baseFetchOptions, fetchOptions), mergeOptions(baseOperationOptions, operationOptions));
	    },

	    delete: function _delete() {
	      var endpoint = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
	      var fetchOptions = arguments[1];
	      var operationOptions = arguments[2];
	      return delete_(makeUri(baseUrl, endpoint), mergeOptions(baseFetchOptions, fetchOptions), mergeOptions(baseOperationOptions, operationOptions));
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
	  if (/^application\/json(;.*)?/.test(response.headers.get('Content-Type'))) {
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
	exports.createApiSource = exports.delete_ = exports.patchJson = exports.putJson = exports.postJson = exports.getQuery = exports.get = undefined;

	var _apiOperations = __webpack_require__(0);

	exports.get = _apiOperations.get;
	exports.getQuery = _apiOperations.getQuery;
	exports.postJson = _apiOperations.postJson;
	exports.putJson = _apiOperations.putJson;
	exports.patchJson = _apiOperations.patchJson;
	exports.delete_ = _apiOperations.delete_;
	exports.createApiSource = _apiOperations.createApiSource; // just an exporter for the modules
	// here we can control the default external API of the package

/***/ },
/* 3 */
/***/ function(module, exports) {

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	'use strict';

	// If obj.hasOwnProperty has been overridden, then calling
	// obj.hasOwnProperty(prop) will break.
	// See: https://github.com/joyent/node/issues/1707
	function hasOwnProperty(obj, prop) {
	  return Object.prototype.hasOwnProperty.call(obj, prop);
	}

	module.exports = function(qs, sep, eq, options) {
	  sep = sep || '&';
	  eq = eq || '=';
	  var obj = {};

	  if (typeof qs !== 'string' || qs.length === 0) {
	    return obj;
	  }

	  var regexp = /\+/g;
	  qs = qs.split(sep);

	  var maxKeys = 1000;
	  if (options && typeof options.maxKeys === 'number') {
	    maxKeys = options.maxKeys;
	  }

	  var len = qs.length;
	  // maxKeys <= 0 means that we should not limit keys count
	  if (maxKeys > 0 && len > maxKeys) {
	    len = maxKeys;
	  }

	  for (var i = 0; i < len; ++i) {
	    var x = qs[i].replace(regexp, '%20'),
	        idx = x.indexOf(eq),
	        kstr, vstr, k, v;

	    if (idx >= 0) {
	      kstr = x.substr(0, idx);
	      vstr = x.substr(idx + 1);
	    } else {
	      kstr = x;
	      vstr = '';
	    }

	    k = decodeURIComponent(kstr);
	    v = decodeURIComponent(vstr);

	    if (!hasOwnProperty(obj, k)) {
	      obj[k] = v;
	    } else if (isArray(obj[k])) {
	      obj[k].push(v);
	    } else {
	      obj[k] = [obj[k], v];
	    }
	  }

	  return obj;
	};

	var isArray = Array.isArray || function (xs) {
	  return Object.prototype.toString.call(xs) === '[object Array]';
	};


/***/ },
/* 4 */
/***/ function(module, exports) {

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	'use strict';

	var stringifyPrimitive = function(v) {
	  switch (typeof v) {
	    case 'string':
	      return v;

	    case 'boolean':
	      return v ? 'true' : 'false';

	    case 'number':
	      return isFinite(v) ? v : '';

	    default:
	      return '';
	  }
	};

	module.exports = function(obj, sep, eq, name) {
	  sep = sep || '&';
	  eq = eq || '=';
	  if (obj === null) {
	    obj = undefined;
	  }

	  if (typeof obj === 'object') {
	    return map(objectKeys(obj), function(k) {
	      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
	      if (isArray(obj[k])) {
	        return map(obj[k], function(v) {
	          return ks + encodeURIComponent(stringifyPrimitive(v));
	        }).join(sep);
	      } else {
	        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
	      }
	    }).join(sep);

	  }

	  if (!name) return '';
	  return encodeURIComponent(stringifyPrimitive(name)) + eq +
	         encodeURIComponent(stringifyPrimitive(obj));
	};

	var isArray = Array.isArray || function (xs) {
	  return Object.prototype.toString.call(xs) === '[object Array]';
	};

	function map (xs, f) {
	  if (xs.map) return xs.map(f);
	  var res = [];
	  for (var i = 0; i < xs.length; i++) {
	    res.push(f(xs[i], i));
	  }
	  return res;
	}

	var objectKeys = Object.keys || function (obj) {
	  var res = [];
	  for (var key in obj) {
	    if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
	  }
	  return res;
	};


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.decode = exports.parse = __webpack_require__(3);
	exports.encode = exports.stringify = __webpack_require__(4);


/***/ }
/******/ ])
});
;