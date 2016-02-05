/*
 * Checks status of a response
 * @see https://github.com/github/fetch#handling-http-error-statuses
 * @note best used in a fetch promises chain, where an error can be easily caught.
 */
export function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) { return response }

  return parseResponse(response)
    .then(error => { throw parseError(error, response) })
}

export function parseResponse(response) {
  if (response.headers.get('Content-Type') === 'application/json') { return response.json() }

  return response.text()
}

function parseError(error, response) {
  const _error = new Error(error.message || response.statusText)
  _error.name = error.error || response.status
  _error.response = response
  _error.body = error
  return _error
}
