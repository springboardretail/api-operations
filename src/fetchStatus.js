/*
 * Checks status of a response
 * @see https://github.com/github/fetch#handling-http-error-statuses
 * @note best used in a fetch promises chain, where an error can be easily caught.
 */
export function checkStatus(response, options = {}) {
  const statusValidator = returnIfFunctionExists(options.statusValidator)
  const errorParser = returnIfFunctionExists(options.errorParser)

  const isValidRange = statusValidator ?
    statusValidator(response.status) : response.status >= 200 && response.status < 300

  if (isValidRange) { return response }

  return parseResponse(response)
    .then(error => { throw parseError(error, response, errorParser) })
}

export function parseResponse(response) {
  if (response.headers.get('Content-Type') === 'application/json') { return response.json() }
  return response.text()
}

function parseError(error, response, errorParser) {
  const _error = new Error(error.message || response.statusText)
  _error.name = error.error || response.status
  _error.response = response
  _error.body = error
  return errorParser ? errorParser(error, response) : _error
}

function returnIfFunctionExists(object) {
  const isFunction = obj => ({}.toString.call(obj) === '[object Function]')
  if ((object !== undefined || object !== null) && isFunction(object)) { return object }
  return false
}
