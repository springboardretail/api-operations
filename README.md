# API Operations

A lightweight (2kb minified) library for simple RESTful API operations that leverages ```fetch```.


## Features

- Minimal yet powerful API
- Uses the [fetch standard](https://fetch.spec.whatwg.org) so it returns promises and keeps things idiomatic
- Automatic parsing of JSON data; falls back to plain text
- Standardized errors by default or configure the error output to your taste
- Rejects by default on ```response.status < 200 && response.status > 300```, but you can configure the validation to your needs


## Installing

installing ```api-operations``` via npm:

```sh
npm install api-operations
```

api-operations uses the fetch standard: you should bring your favorite polyfill ;D
(and fetch uses Promise, so you might need to polyfill that too, consult your polyfill of choice docs)

```sh
# official fetch polyfill - https://github.com/github/fetch
npm install whatwg-fetch

# node-fetch - https://github.com/bitinn/node-fetch
npm install node-fetch

# isomorphic-fetch - https://github.com/matthew-andrews/isomorphic-fetch
npm install isomorphic-fetch
```


### UMD build

you can get the development and minified production files on the ['dist' folder](https://github.com/springboardretail/api-operations/tree/master/dist).
The library namespace is ```apiOperations```


## Getting started

```js
import { get, postJson, putJson, delete_, createApiSource } from 'api-operations'

// Simple get json from url
get('http://myCoolApi.com/endpoint')
  .then(json => { console.log('got the json:', json) })
  .catch(error => { console.log('got an error:', error) })

// Simple post json to url
postJson('http://myCoolApi.com/endpoint', { myData: 'omgBbqWtfKawaii' })
  .then(json => { console.log('posted and got json:', json) })
  .catch(error => { console.log('posted and got error:', error) })


// Creating an API source for quick and convenient use
const myAPISource = createApiSource('http://myCoolApi.com/resource')

// Get from 'http://myCoolApi.com/resource/someEndpoint'
myAPISource.get('someEndpoint')
  .then(json => { console.log('got the json:', json) })
  .catch(error => { console.log('got an error:', error) })

// Post to 'http://myCoolApi.com/resource/someOtherEndpoint'
myAPISource.postJson('someOtherEndpoint', { myData: 'omgBbqWtfKawaii' })
  .then(json => { console.log('posted and got json:', json) })
  .catch(error => { console.log('posted and got error:', error) })

// Get from 'http://myCoolApi.com/resource'
myAPISource.get()
  .then(json => { console.log('got the json:', json) })
  .catch(error => { console.log('got an error:', error) })

```

## API
- [Methods:](#methods)
  - [get](#get) ```(url[, fetchOptions[, operationOptions]])```
  - [postJson](#postjson) ```(url, body[, fetchOptions[, operationOptions]])```
  - [putJson](#putjson) ```(url, body[, fetchOptions[, operationOptions]])```
  - [patchJson](#patchjson) ```(url, body[, fetchOptions[, operationOptions]])```
  - [delete_](#delete_) ```(url[, fetchOptions[, operationOptions]])```
  - [createApiSource](#createapisource) ```(baseUrl, [baseFetchOptions[, baseOperationOptions]])```

- [Arguments:](#arguments)
  - [url / baseUrl / endPoint](#url-/-baseurl-/-endpoint)
  - [fetchOptions](#fetchoptions)
  - [operationOptions](#operationoptions)


### Methods

*statusValidator and errorParser definitions omitted from examples for clarity; check the [Arguments > operationOptions](#operationoptions) section for details*


#### get ```(url[, fetchOptions[, operationOptions]])```

Gets a document using the 'get' HTTP method and returns a promise with a parsed result. Example:

```js
get('http://myCoolApi.com/endpoint', { credentials: 'same-origin' }, { statusValidator, errorParser })
  .then(json => { console.log('got the json:', json) })
  .catch(error => { console.log('got an error:', error) })
```


#### postJson ```(url, body[, fetchOptions[, operationOptions]])```

Sends a JSON body using the 'post' HTTP method and returns a promise with a parsed result. *body gets converted to json automatically*. Example:

```js
postJson('http://myCoolApi.com/endpoint', { myData: 'omgBbqWtfKawaii' }, { credentials: 'same-origin' }, { statusValidator, errorParser })
  .then(json => { console.log('posted and got json:', json) })
  .catch(error => { console.log('posted and got error:', error) })
```


#### putJson ```(url, body[, fetchOptions[, operationOptions]])```

Sends a JSON body using the 'put' HTTP method and returns a promise with a parsed result. *body gets converted to json automatically*. Example:

```js
putJson('http://myCoolApi.com/endpoint', { myData: 'omgBbqWtfKawaii' }, { credentials: 'same-origin' }, { statusValidator, errorParser })
  .then(json => { console.log('put and got json:', json) })
  .catch(error => { console.log('put and got error:', error) })
```


#### patchJson ```(url, body[, fetchOptions[, operationOptions]])```

Sends a JSON body using the 'patch' HTTP method and returns a promise with a parsed result. *body gets converted to json automatically*. Example:

```js
patchJson('http://myCoolApi.com/endpoint', { myData: 'omgBbqWtfKawaii' }, { credentials: 'same-origin' }, { statusValidator, errorParser })
  .then(json => { console.log('patched and got json:', json) })
  .catch(error => { console.log('patched and got error:', error) })
```


#### delete_ ```(url[, fetchOptions[, operationOptions]])```

Sends a request using the 'delete' HTTP method and returns a promise with a parsed result. Example:

```js
// we use 'delete_' because 'delete' is a reserved keyword
delete_('http://myCoolApi.com/endpoint', { credentials: 'same-origin' }, { statusValidator, errorParser })
  .then(json => { console.log('deleted and got json:', json) })
  .catch(error => { console.log('deleted and got error:', error) })
```


#### createApiSource ```(baseUrl, [baseFetchOptions[, baseOperationOptions]])```

Creates an 'API source' which acts as a base URL and base configurations for operations.
Returns an object with the following endpoint methods:

- get ```(endPoint[, fetchOptions[, operationOptions]])```
- postJson ```(endPoint, body[, fetchOptions[, operationOptions]])```
- putJson ```(endPoint, body[, fetchOptions[, operationOptions]])```
- delete_ ```(endPoint[, fetchOptions[, operationOptionsions]])```

**All endpoint method options get merged with the base options created by ```createApiSource```**

```js
// Creating an API source for quick and convenient use
const myAPISource = createApiSource('http://myCoolApi.com', { credentials: 'same-origin' }, { statusValidator, errorParser })

// Get from 'http://myCoolApi.com/someEndpoint' with 'same-origin' credentials, custom  statusValidator and errorParser
myAPISource.get('someEndpoint')
  .then(json => { console.log('got the json:', json) })
  .catch(error => { console.log('got an error:', error) })

// Post to 'http://myCoolApi.com/someOtherEndpoint' with 'same-origin' credentials, connection 'keep-alive', custom statusValidator and errorParser
myAPISource.postJson('someOtherEndpoint', { myData: 'omgBbqWtfKawaii' }, { connection: 'keep-alive' })
  .then(json => { console.log('posted and got json:', json) })
  .catch(error => { console.log('posted and got error:', error) })

// Get from 'http://myCoolApi.com/', with 'same-origin' credentials, custom errorParser and specific statusValidator
const statusValidator = (status) => status > 0 && status < 100

myAPISource.get('', {}, { statusValidator })
  .then(json => { console.log('got the json:', json) })
  .catch(error => { console.log('got an error:', error) })

```


### Arguments

#### url / baseUrl / endPoint
- url: a ```String``` containing a full url i.e. ```https://api.github.com/user/repos```
- baseUrl: a ```String``` containing a root api url i.e. ```https://api.github.com/user``` or ```https://api.github.com```
- endPoint: a ```String``` containing an API endpoint i.e. ```repos``` or ```user/repos```


#### fetchOptions
An object containing options for the request. Directly passed to ```fetch``` second argument. this is the place to set headers, body, and other request data. Example:

```js
{
  method: 'post',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'Hubot',
    login: 'hubot',
  })
}
```

#### operationOptions
An object that modifies the operations default behavior. The following key/values are supported:
- statusValidator ```(response_status)```: A function that receives the response status code,
implements some custom validation and returns ```true``` for valid statuses and ```false``` for invalid ones   
- errorParser ```(error, response)```: A function that receives the parsed rejected response (error) and the raw response object

```js
// A custom status validator that passes on status 0 to 100 and fails on everything else
const statusValidator = (status) => status > 0 && status < 100

// A custom error parser that passes some custom data
const errorParser = (error, response) => {
  const _error = new Error('Custom Error')
  _error.name = response.statusText
  _error.response = response
  _error.body = error
  _error.myExtraStuff = 'teach me how to dougie, teach me-teach me how to dougie~'
  return _error
}

// Use them!
get('http://myCoolApi.com/endpoint', {}, { statusValidator, errorParser })
  .then(json => { console.log('got the json:', json) })
  .catch(error => { console.log('got an error:', error) })
```
