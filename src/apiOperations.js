import { stringify } from 'querystring'
import { checkStatus, parseResponse } from './fetchStatus'

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
    .then(res => (operationOptions && operationOptions.dontParse ? res : parseResponse(res)))
}


export function sendJson(url, body, fetchOptions, operationOptions) {
  const sendOptions = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  }
  return fetchAndParse(url, { ...sendOptions, ...fetchOptions }, operationOptions)
}


export function get(url, fetchOptions, operationOptions) {
  return fetchAndParse(url, { ...{ method: 'get' }, ...fetchOptions }, operationOptions)
}


export function getQuery(url, query, fetchOptions, operationOptions) {
  const hasQuery = uri => /\?/.test(uri)
  const stripUndefined = queryObj =>
    Object.keys(queryObj).reduce((acc, key) => {
      if (queryObj[key] === undefined) { return acc }
      return { ...acc, [key]: queryObj[key] }
    }, {})

  return get(
    `${url}${hasQuery(url) ? '&' : '?'}${stringify(stripUndefined(query))}`,
    fetchOptions,
    operationOptions
  )
}


export function postJson(url, body, fetchOptions, operationOptions) {
  return sendJson(url, body, { ...{ method: 'post' }, ...fetchOptions }, operationOptions)
}


export function putJson(url, body, fetchOptions, operationOptions) {
  return sendJson(url, body, { ...{ method: 'put' }, ...fetchOptions }, operationOptions)
}


export function patchJson(url, body, fetchOptions, operationOptions) {
  return sendJson(url, body, { ...{ method: 'patch' }, ...fetchOptions }, operationOptions)
}


// using 'delete_' because 'delete' is a reserved keyword
// eslint-disable-next-line no-underscore-dangle
export function delete_(url, fetchOptions, operationOptions) {
  return fetchAndParse(url, { ...{ method: 'delete' }, ...fetchOptions }, operationOptions)
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
        { ...baseFetchOptions, ...fetchOptions },
        { ...baseOperationOptions, ...operationOptions }
      ),

    getQuery: (endpoint = '', query, fetchOptions, operationOptions) =>
      getQuery(makeUri(baseUrl, endpoint),
        query,
        { ...baseFetchOptions, ...fetchOptions },
        { ...baseOperationOptions, ...operationOptions }
      ),

    sendJson: (endpoint = '', body, fetchOptions, operationOptions) =>
      sendJson(makeUri(baseUrl, endpoint), body,
        { ...baseFetchOptions, ...fetchOptions },
        { ...baseOperationOptions, ...operationOptions }
      ),

    postJson: (endpoint = '', body, fetchOptions, operationOptions) =>
      postJson(makeUri(baseUrl, endpoint), body,
        { ...baseFetchOptions, ...fetchOptions },
        { ...baseOperationOptions, ...operationOptions }
      ),

    putJson: (endpoint = '', body, fetchOptions, operationOptions) =>
      putJson(makeUri(baseUrl, endpoint), body,
        { ...baseFetchOptions, ...fetchOptions },
        { ...baseOperationOptions, ...operationOptions }
      ),

    patchJson: (endpoint = '', body, fetchOptions, operationOptions) =>
      patchJson(makeUri(baseUrl, endpoint), body,
        { ...baseFetchOptions, ...fetchOptions },
        { ...baseOperationOptions, ...operationOptions }
      ),

    delete: (endpoint = '', fetchOptions, operationOptions) =>
      delete_(makeUri(baseUrl, endpoint),
        { ...baseFetchOptions, ...fetchOptions },
        { ...baseOperationOptions, ...operationOptions }
      ),
  }
}
