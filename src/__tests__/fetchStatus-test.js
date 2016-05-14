import { assert } from 'chai'
import fetchMock from 'fetch-mock'
import { checkStatus, parseResponse } from '../fetchStatus'
import { jsonAPIResponse, jsonAPIStatusError, assertCalled } from './fetch-mock-helpers'


describe('fetchStatus', () => {
  afterEach(() => fetchMock.restore())

  it('status 200 passes response through', () => {
    const data = { ok: true }
    fetchMock.mock('https://test200', jsonAPIResponse(data))

    return fetch('https://test200')
      .then(checkStatus)
      .then(parseResponse)
      .then(json => {
        assert.deepEqual(json, data)
        assertCalled('https://test200')
      })
  })

  it('status 300 throws error', () => {
    fetchMock.mock('https://test300', jsonAPIStatusError(300))

    return fetch('https://test300').then(checkStatus)
      .catch(error => {
        assert.equal(error.message, 'Status 300')
        assertCalled('https://test300')
      })
  })

  it('status 400 throws error', () => {
    fetchMock.mock('https://test400', jsonAPIStatusError(400))

    return fetch('https://test400').then(checkStatus)
      .catch(error => {
        assert.equal(error.message, 'Status 400')
        assertCalled('https://test400')
      })
  })

  it('status 500 throws error', () => {
    fetchMock.mock('https://test500', jsonAPIStatusError(500))

    return fetch('https://test500').then(checkStatus)
      .catch(error => {
        assert.equal(error.message, 'Status 500')
        assertCalled('https://test500')
      })
  })

  it('throws proper error for text response', () => {
    fetchMock.mock('https://testText', { status: 400, body: 'Text Error' })

    return fetch('https://testText').then(checkStatus)
      .catch(error => {
        assert.equal(error.body, 'Text Error')
        assertCalled('https://testText')
      })
  })

  it('parses json when application/json includes parameters', () => {
    const responseData = { ok: true }
    fetchMock.mock('https://contentTypeParams', {
      status: 200,
      headers: { 'Content-Type': 'application/json; foo="bar"' },
      body: responseData,
    })

    return fetch('https://contentTypeParams')
      .then(checkStatus)
      .then(parseResponse)
      .then(json => {
        assert.deepEqual(json, responseData)
        assertCalled('https://contentTypeParams')
      })
  })

  it('validates status with custom statusValidator', () => {
    const responseData = { ok: true }
    fetchMock.mock('https://customStatus', {
      status: 1,
      headers: { 'Content-Type': 'application/json' },
      body: responseData,
    })
    const statusValidator = (status) => status > 0 && status < 100

    return fetch('https://customStatus')
      .then(res => checkStatus(res, { statusValidator }))
      .then(parseResponse)
      .then(json => {
        assert.deepEqual(json, responseData)
        assertCalled('https://customStatus')
      })
  })

  it('parses error with custom errorParser', () => {
    fetchMock.mock('https://customError', jsonAPIStatusError(400))
    const errorParser = (error, response) => {
      const _error = new Error('Custom Error')
      _error.name = response.statusText
      return _error
    }

    return fetch('https://customError')
      .then(res => checkStatus(res, { errorParser }))
      .catch(error => {
        assert.equal(error.message, 'Custom Error')
        assert.equal(error.name, 'Bad Request')
        assertCalled('https://customError')
      })
  })
})
