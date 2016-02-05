import { checkStatus, parseResponse } from './fetchStatus'

const mergeOptions = (opts1, opts2) => Object.assign({}, opts1, opts2)

/**
 * fetch's promise will actually resolve successfully even if the server returns a > 400 reponse
 * see "Checking that the fetch was successful":
 *  https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
 */
function safeFetch(url, fetchOptions = {}) {
  return fetch(url, fetchOptions)
    .then(checkStatus)
}


function fetchAndParse(url, fetchOptions = {}) {
  return safeFetch(url, fetchOptions)
    .then(parseResponse)
}


function sendJson(url, body, fetchOptions = {}) {
  const sendOptions = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  }
  return fetchAndParse(url, mergeOptions(sendOptions, fetchOptions))
}


export function getJson(url, body, fetchOptions = {}) {
  return fetchAndParse(url, body, mergeOptions({ method: 'get' }, fetchOptions))
}


export function postJson(url, body, fetchOptions = {}) {
  return sendJson(url, body, mergeOptions({ method: 'post' }, fetchOptions))
}


export function putJson(url, body, fetchOptions = {}) {
  return sendJson(url, body, mergeOptions({ method: 'put' }, fetchOptions))
}


// using 'delete_' because 'delete' is a reserved keyword
export function delete_(url, fetchOptions = {}) {
  return fetchAndParse(url, mergeOptions({ method: 'delete' }, fetchOptions))
}


function makeUri(baseUrl, endPoint) {
  if (/^https?:\/\//.test(endPoint)) { throw new Error(`Endpoint seems invalid: "${endPoint}"`) }
  // Trim ending '/' from baseUrl, and starting one from endPoint
  // Hardcode '/' between 'trimmed' baseUrl and endpoint
  return `${baseUrl.replace(/(\/$)/, '')}/${endPoint.replace(/(^\/)/, '')}`
}


// Creates an object with helper methods to query an API point
export function createApiSource(baseUrl, baseOptions = {}) {
  return {
    getJson: (endPoint = '', fetchOptions) =>
      getJson(makeUri(baseUrl, endPoint), mergeOptions(baseOptions, fetchOptions)),

    postJson: (endPoint = '', body, fetchOptions) =>
      postJson(makeUri(baseUrl, endPoint), body, mergeOptions(baseOptions, fetchOptions)),

    putJson: (endPoint = '', body, fetchOptions) =>
      putJson(makeUri(baseUrl, endPoint), body, mergeOptions(baseOptions, fetchOptions)),

    delete: (endPoint = '', fetchOptions) =>
      delete_(makeUri(baseUrl, endPoint), mergeOptions(baseOptions, fetchOptions)),
  }
}
