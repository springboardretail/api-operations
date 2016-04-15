import { checkStatus, parseResponse } from './fetchStatus'
import { stringify } from 'querystring'

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


export function getQuery(url, query, fetchOptions, operationOptions) {
  const hasQuery = uri => /\?/.test(uri)
  return get(
    `${url}${hasQuery(url) ? '&' : '?'}${stringify(query)}`,
    fetchOptions,
    operationOptions
  )
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


function makeUri(baseUrl, endpoint) {
  // if endpoint starts with "http://" or "https://" throw an error
  if (/^https?:\/\//.test(endpoint)) { throw new Error(`Endpoint seems invalid: "${endpoint}"`) }
  // Trim ending '/' from baseUrl, and starting one from endpoint
  // Hardcode '/' between 'trimmed' baseUrl and endpoint
  return `${baseUrl.replace(/(\/$)/, '')}/${endpoint.toString().replace(/(^\/)/, '')}`
}


// Creates an object with helper methods to query an API point
export function createApiSource(baseUrl, baseFetchOptions, baseOperationOptions) {
  return {
    get: (endpoint = '', fetchOptions, operationOptions) =>
      get(makeUri(baseUrl, endpoint),
        mergeOptions(baseFetchOptions, fetchOptions),
        mergeOptions(baseOperationOptions, operationOptions)
      ),

    getQuery: (endpoint = '', query, fetchOptions, operationOptions) =>
      getQuery(makeUri(baseUrl, endpoint),
        query,
        mergeOptions(baseFetchOptions, fetchOptions),
        mergeOptions(baseOperationOptions, operationOptions)
      ),

    postJson: (endpoint = '', body, fetchOptions, operationOptions) =>
      postJson(makeUri(baseUrl, endpoint), body,
        mergeOptions(baseFetchOptions, fetchOptions),
        mergeOptions(baseOperationOptions, operationOptions)
      ),

    putJson: (endpoint = '', body, fetchOptions, operationOptions) =>
      putJson(makeUri(baseUrl, endpoint), body,
        mergeOptions(baseFetchOptions, fetchOptions),
        mergeOptions(baseOperationOptions, operationOptions)
      ),

    patchJson: (endpoint = '', body, fetchOptions, operationOptions) =>
      patchJson(makeUri(baseUrl, endpoint), body,
        mergeOptions(baseFetchOptions, fetchOptions),
        mergeOptions(baseOperationOptions, operationOptions)
      ),

    delete: (endpoint = '', fetchOptions, operationOptions) =>
      delete_(makeUri(baseUrl, endpoint),
        mergeOptions(baseFetchOptions, fetchOptions),
        mergeOptions(baseOperationOptions, operationOptions)
      ),
  }
}
