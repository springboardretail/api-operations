import { checkStatus, parseResponse } from './fetchStatus'

const mergeOptions = (opts1, opts2) => Object.assign({}, opts1, opts2)

/**
 * fetch's promise will actually resolve successfully even if the server returns a > 400 reponse
 * see "Checking that the fetch was successful":
 *  https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
 */
function safeFetch(url, fetchOptions, operationOptions) {
  return fetch(url, fetchOptions)
    .then(res => checkStatus(res, operationOptions))
}


function fetchAndParse(url, fetchOptions = {}, operationOptions) {
  return safeFetch(url, fetchOptions, operationOptions)
    .then(parseResponse)
}


function sendJson(url, body, fetchOptions, operationOptions) {
  const sendOptions = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  }
  return fetchAndParse(url, mergeOptions(sendOptions, fetchOptions), operationOptions)
}


export function get(url, fetchOptions, operationOptions) {
  return fetchAndParse(url, mergeOptions({ method: 'get' }, fetchOptions), operationOptions)
}


export function postJson(url, body, fetchOptions, operationOptions) {
  return sendJson(url, body, mergeOptions({ method: 'post' }, fetchOptions), operationOptions)
}


export function putJson(url, body, fetchOptions, operationOptions) {
  return sendJson(url, body, mergeOptions({ method: 'put' }, fetchOptions), operationOptions)
}


export function patchJson(url, body, fetchOptions, operationOptions) {
  return sendJson(url, body, mergeOptions({ method: 'patch' }, fetchOptions), operationOptions)
}


// using 'delete_' because 'delete' is a reserved keyword
export function delete_(url, fetchOptions, operationOptions) {
  return fetchAndParse(url, mergeOptions({ method: 'delete' }, fetchOptions), operationOptions)
}


function makeUri(baseUrl, endPoint) {
  // if endPoint starts with "http://" or "https://" throw an error
  if (/^https?:\/\//.test(endPoint)) { throw new Error(`Endpoint seems invalid: "${endPoint}"`) }
  // Trim ending '/' from baseUrl, and starting one from endPoint
  // Hardcode '/' between 'trimmed' baseUrl and endpoint
  return `${baseUrl.replace(/(\/$)/, '')}/${endPoint.replace(/(^\/)/, '')}`
}


// Creates an object with helper methods to query an API point
export function createApiSource(baseUrl, baseFetchOptions, baseOperationOptions) {
  return {
    get: (endPoint = '', fetchOptions, operationOptions) =>
      get(makeUri(baseUrl, endPoint),
        mergeOptions(baseFetchOptions, fetchOptions),
        mergeOptions(baseOperationOptions, operationOptions)
      ),

    postJson: (endPoint = '', body, fetchOptions, operationOptions) =>
      postJson(makeUri(baseUrl, endPoint), body,
        mergeOptions(baseFetchOptions, fetchOptions),
        mergeOptions(baseOperationOptions, operationOptions)
      ),

    putJson: (endPoint = '', body, fetchOptions, operationOptions) =>
      putJson(makeUri(baseUrl, endPoint), body,
        mergeOptions(baseFetchOptions, fetchOptions),
        mergeOptions(baseOperationOptions, operationOptions)
      ),

    patchJson: (endPoint = '', body, fetchOptions, operationOptions) =>
      patchJson(makeUri(baseUrl, endPoint), body,
        mergeOptions(baseFetchOptions, fetchOptions),
        mergeOptions(baseOperationOptions, operationOptions)
      ),

    delete: (endPoint = '', fetchOptions, operationOptions) =>
      delete_(makeUri(baseUrl, endPoint),
        mergeOptions(baseFetchOptions, fetchOptions),
        mergeOptions(baseOperationOptions, operationOptions)
      ),
  }
}
