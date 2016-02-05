import { assert } from 'chai'
import fetchMock from 'fetch-mock'
import { getJson, postJson, putJson, delete_, createApiSource } from '../apiOperations'
import { jsonAPIResponse, jsonAPIStatusError } from './fetch-mock-helpers'

const testAPISource = createApiSource('https://test', { credentials: 'same-origin' })


describe('apiOperations', () => {
  afterEach(() => fetchMock.restore())

  it('gets json', () => {
    const responseData = { ok: true }
    fetchMock.mock('https://test/get', jsonAPIResponse(responseData))

    return getJson('https://test/get')
      .then(json => {
        assert.deepEqual(json, responseData)
        assert(fetchMock.called('https://test/get'))
      })
  })

  it('posts json', () => {
    const responseData = { ok: true }
    const sentData = { sent: true }
    fetchMock.mock('https://test/post', 'POST', jsonAPIResponse(responseData))

    return postJson('https://test/post', sentData)
      .then(json => {
        assert.deepEqual(json, responseData)
        assert(fetchMock.called('https://test/post'))
        assert.deepEqual(JSON.parse(fetchMock.lastOptions('https://test/post').body), sentData)
      })
  })

  it('puts json', () => {
    const responseData = { ok: true }
    const sentData = { sent: true }
    fetchMock.mock('https://test/put', 'PUT', jsonAPIResponse(responseData))

    return putJson('https://test/put', sentData)
      .then(json => {
        assert.deepEqual(json, responseData)
        assert(fetchMock.called('https://test/put'))
        assert.deepEqual(JSON.parse(fetchMock.lastOptions('https://test/put').body), sentData)
      })
  })

  it('deletes json', () => {
    const responseData = { ok: true }
    fetchMock.mock('https://test/delete', 'DELETE', jsonAPIResponse(responseData))

    return delete_('https://test/delete')
      .then(json => {
        assert.deepEqual(json, responseData)
        assert(fetchMock.called('https://test/delete'))
      })
  })

  it('uses passed options', () => {
    const responseData = { ok: true }
    fetchMock.mock('https://test/credentials', jsonAPIResponse(responseData))

    return getJson('https://test/credentials', { credentials: 'same-origin' })
      .then(json => {
        assert.deepEqual(json, responseData)
        assert.equal(fetchMock.lastOptions('https://test/credentials').credentials, 'same-origin')
      })
  })

  it('throws on error', () => {
    fetchMock.mock('https://test/error', jsonAPIStatusError(400))

    return getJson('https://test/error')
      .catch(error => {
        assert.equal(error.message, 'Status 400')
        assert(fetchMock.called('https://test/error'))
      })
  })


  describe('createApiSource', () => {
    it('gets json', () => {
      const responseData = { ok: true }
      fetchMock.mock('https://test/getEndpoint', jsonAPIResponse(responseData))

      return testAPISource.getJson('getEndpoint')
        .then(json => {
          assert.deepEqual(json, responseData)
          assert(fetchMock.called('https://test/getEndpoint'))
        })
    })

    it('posts json', () => {
      const responseData = { ok: true }
      const sentData = { sent: true }
      fetchMock.mock('https://test/postEndpoint', 'POST', jsonAPIResponse(responseData))

      return testAPISource.postJson('postEndpoint', sentData)
        .then(json => {
          assert.deepEqual(json, responseData)
          assert(fetchMock.called('https://test/postEndpoint'))
          assert.deepEqual(JSON.parse(fetchMock.lastOptions('https://test/postEndpoint').body), sentData)
        })
    })

    it('puts json', () => {
      const responseData = { ok: true }
      const sentData = { sent: true }
      fetchMock.mock('https://test/putEndpoint', 'PUT', jsonAPIResponse(responseData))

      return testAPISource.putJson('putEndpoint', sentData)
        .then(json => {
          assert.deepEqual(json, responseData)
          assert(fetchMock.called('https://test/putEndpoint'))
          assert.deepEqual(JSON.parse(fetchMock.lastOptions('https://test/putEndpoint').body), sentData)
        })
    })

    it('deletes json', () => {
      const responseData = { ok: true }
      fetchMock.mock('https://test/deleteEndpoint', 'DELETE', jsonAPIResponse(responseData))

      return testAPISource.delete('deleteEndpoint')
        .then(json => {
          assert.deepEqual(json, responseData)
          assert(fetchMock.called('https://test/deleteEndpoint'))
        })
    })

    it('throws on error', () => {
      fetchMock.mock('https://test/errorEndpoint', jsonAPIStatusError(400))

      return testAPISource.getJson('errorEndpoint')
        .catch(error => {
          assert.equal(error.message, 'Status 400')
          assert(fetchMock.called('https://test/errorEndpoint'))
        })
    })

    it('hits baseUrl when no endpoint is given', () => {
      const responseData = { ok: true }
      fetchMock.mock('https://test/', jsonAPIResponse(responseData))

      return testAPISource.getJson()
        .then(json => {
          assert.deepEqual(json, responseData)
          assert(fetchMock.called('https://test/'))
        })
    })

    it('uses baseOptions', () => {
      const responseData = { ok: true }
      fetchMock.mock('https://test/credentials', jsonAPIResponse(responseData))

      return testAPISource.getJson('credentials')
        .then(json => {
          assert.deepEqual(json, responseData)
          assert.equal(fetchMock.lastOptions('https://test/credentials').credentials, 'same-origin')
        })
    })


    describe('stardardize URL', () => {
      it('works for endpoint', () => {
        const responseData = { ok: true }
        fetchMock.mock('https://test/getEndpoint', jsonAPIResponse(responseData))

        return testAPISource.getJson('/getEndpoint')
          .then(json => {
            assert.deepEqual(json, responseData)
            assert(fetchMock.called('https://test/getEndpoint'))
          })
      })

      it('works for baseUrl', () => {
        const responseData = { ok: true }
        fetchMock.mock('https://test/getEndpoint', jsonAPIResponse(responseData))

        return createApiSource('https://test/')
          .getJson('getEndpoint')
          .then(json => {
            assert.deepEqual(json, responseData)
            assert(fetchMock.called('https://test/getEndpoint'))
          })
      })

      it('works for baseUrl and endpoint combined', () => {
        const responseData = { ok: true }
        fetchMock.mock('https://test/getEndpoint', jsonAPIResponse(responseData))

        return createApiSource('https://test/')
          .getJson('/getEndpoint')
          .then(json => {
            assert.deepEqual(json, responseData)
            assert(fetchMock.called('https://test/getEndpoint'))
          })
      })

      it('throws on invalid endPoint', () => {
        const responseData = { ok: true }
        fetchMock.mock('https://test/getEndpoint', jsonAPIResponse(responseData))
        const invalidEndpoint = () => createApiSource('https://test/').getJson('https://invalidEndpoint')

        assert.throws(invalidEndpoint, /Endpoint seems invalid/)
      })
    })
  })
})
