import { assert } from 'chai'
import fetchMock from 'fetch-mock'
import { checkStatus } from '../fetchStatus'
import { jsonAPIResponse, jsonAPIStatusError } from './fetch-mock-helpers'


describe('fetchStatus', () => {
  afterEach(() => fetchMock.restore())

  it('status 200 passes response through', () => {
    const data = { ok: true }
    fetchMock.mock('https://test200', jsonAPIResponse(data))

    return fetch('https://test200')
      .then(checkStatus)
      .then(response => response.json())
      .then(json => {
        assert.deepEqual(json, data)
        assert(fetchMock.called('https://test200'))
      })
  })

  it('status 300 throws error', () => {
    fetchMock.mock('https://test300', jsonAPIStatusError(300))

    return fetch('https://test300').then(checkStatus)
      .catch(error => {
        assert.equal(error.message, 'Status 300')
        assert(fetchMock.called('https://test300'))
      })
  })

  it('status 400 throws error', () => {
    fetchMock.mock('https://test400', jsonAPIStatusError(400))

    return fetch('https://test400').then(checkStatus)
      .catch(error => {
        assert.equal(error.message, 'Status 400')
        assert(fetchMock.called('https://test400'))
      })
  })


  it('status 500 throws error', () => {
    fetchMock.mock('https://test500', jsonAPIStatusError(500))

    return fetch('https://test500').then(checkStatus)
      .catch(error => {
        assert.equal(error.message, 'Status 500')
        assert(fetchMock.called('https://test500'))
      })
  })

  it('throws proper error for text response', () => {
    fetchMock.mock('https://testText', { status: 400, body: 'Text Error' })

    return fetch('https://testText').then(checkStatus)
      .catch(error => {
        assert.equal(error.body, 'Text Error')
        assert(fetchMock.called('https://testText'))
      })
  })
})
