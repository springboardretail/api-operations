import { assert } from 'chai'
import fetchMock from 'fetch-mock'
import { get, postJson, putJson, patchJson, delete_, createApiSource } from '../apiOperations'
import { jsonAPIResponse, jsonAPIStatusError, assertCalled } from './fetch-mock-helpers'

const testAPISource = createApiSource('https://test', { credentials: 'same-origin' })


describe('apiOperations', () => {
  afterEach(() => fetchMock.restore())

  it('gets json', () => {
    const responseData = { ok: true }
    fetchMock.mock('https://test/get', jsonAPIResponse(responseData))

    return get('https://test/get')
      .then(json => {
        assert.deepEqual(json, responseData)
        assertCalled('https://test/get')
      })
  })

  it('posts json', () => {
    const responseData = { ok: true }
    const sentData = { sent: true }
    fetchMock.mock('https://test/post', 'POST', jsonAPIResponse(responseData))

    return postJson('https://test/post', sentData)
      .then(json => {
        assert.deepEqual(json, responseData)
        assertCalled('https://test/post')
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
        assertCalled('https://test/put')
        assert.deepEqual(JSON.parse(fetchMock.lastOptions('https://test/put').body), sentData)
      })
  })

  it('patches json', () => {
    const responseData = { ok: true }
    const sentData = { sent: true }
    fetchMock.mock('https://test/patch', 'PATCH', jsonAPIResponse(responseData))

    return patchJson('https://test/patch', sentData)
      .then(json => {
        assert.deepEqual(json, responseData)
        assertCalled('https://test/patch')
        assert.deepEqual(JSON.parse(fetchMock.lastOptions('https://test/patch').body), sentData)
      })
  })

  it('deletes json', () => {
    const responseData = { ok: true }
    fetchMock.mock('https://test/delete', 'DELETE', jsonAPIResponse(responseData))

    return delete_('https://test/delete')
      .then(json => {
        assert.deepEqual(json, responseData)
        assertCalled('https://test/delete')
      })
  })

  it('uses passed options', () => {
    const responseData = { ok: true }
    fetchMock.mock('https://test/credentials', jsonAPIResponse(responseData))

    return get('https://test/credentials', { credentials: 'same-origin' })
      .then(json => {
        assert.deepEqual(json, responseData)
        assert.equal(fetchMock.lastOptions('https://test/credentials').credentials, 'same-origin')
      })
  })

  it('uses passed status validator', () => {
    const responseData = { ok: true }
    fetchMock.mock('https://test/customStatus', {
      status: 1,
      headers: { 'Content-Type': 'application/json' },
      body: responseData,
    })
    const statusValidator = (status) => status > 0 && status < 100

    return get('https://test/customStatus', {}, { statusValidator })
      .then(json => {
        assert.deepEqual(json, responseData)
        assertCalled('https://test/customStatus')
      })
  })

  it('uses passed error parser', () => {
    fetchMock.mock('https://test/customError', jsonAPIStatusError(400))
    const errorParser = (error, response) => {
      const _error = new Error('Custom Error')
      _error.name = response.statusText
      return _error
    }

    return get('https://test/customError', {}, { errorParser })
      .catch(error => {
        assert.equal(error.message, 'Custom Error')
        assert.equal(error.name, 'Bad Request')
        assertCalled('https://test/customError')
      })
  })

  it('throws on error', () => {
    fetchMock.mock('https://test/error', jsonAPIStatusError(400))

    return get('https://test/error')
      .catch(error => {
        assert.equal(error.message, 'Status 400')
        assertCalled('https://test/error')
      })
  })


  describe('createApiSource', () => {
    it('gets json', () => {
      const responseData = { ok: true }
      fetchMock.mock('https://test/getEndpoint', jsonAPIResponse(responseData))

      return testAPISource.get('getEndpoint')
        .then(json => {
          assert.deepEqual(json, responseData)
          assertCalled('https://test/getEndpoint')
        })
    })

    it('posts json', () => {
      const responseData = { ok: true }
      const sentData = { sent: true }
      fetchMock.mock('https://test/postEndpoint', 'POST', jsonAPIResponse(responseData))

      return testAPISource.postJson('postEndpoint', sentData)
        .then(json => {
          assert.deepEqual(json, responseData)
          assertCalled('https://test/postEndpoint')
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
          assertCalled('https://test/putEndpoint')
          assert.deepEqual(JSON.parse(fetchMock.lastOptions('https://test/putEndpoint').body), sentData)
        })
    })

    it('patches json', () => {
      const responseData = { ok: true }
      const sentData = { sent: true }
      fetchMock.mock('https://test/patchEndpoint', 'PATCH', jsonAPIResponse(responseData))

      return testAPISource.patchJson('patchEndpoint', sentData)
        .then(json => {
          assert.deepEqual(json, responseData)
          assertCalled('https://test/patchEndpoint')
          assert.deepEqual(JSON.parse(fetchMock.lastOptions('https://test/patchEndpoint').body), sentData)
        })
    })

    it('deletes json', () => {
      const responseData = { ok: true }
      fetchMock.mock('https://test/deleteEndpoint', 'DELETE', jsonAPIResponse(responseData))

      return testAPISource.delete('deleteEndpoint')
        .then(json => {
          assert.deepEqual(json, responseData)
          assertCalled('https://test/deleteEndpoint')
        })
    })

    it('throws on error', () => {
      fetchMock.mock('https://test/errorEndpoint', jsonAPIStatusError(400))

      return testAPISource.get('errorEndpoint')
        .catch(error => {
          assert.equal(error.message, 'Status 400')
          assertCalled('https://test/errorEndpoint')
        })
    })

    it('hits baseUrl when no endpoint is given', () => {
      const responseData = { ok: true }
      fetchMock.mock('https://test/', jsonAPIResponse(responseData))

      return testAPISource.get()
        .then(json => {
          assert.deepEqual(json, responseData)
          assertCalled('https://test/')
        })
    })

    it('uses baseOptions', () => {
      const responseData = { ok: true }
      fetchMock.mock('https://test/baseoptions', jsonAPIResponse(responseData))

      return testAPISource.get('baseoptions')
        .then(json => {
          assert.deepEqual(json, responseData)
          assert.equal(fetchMock.lastOptions('https://test/baseoptions').credentials, 'same-origin')
        })
    })


    describe('stardardize URL', () => {
      it('works for endpoint', () => {
        const responseData = { ok: true }
        fetchMock.mock('https://test/getEndpoint', jsonAPIResponse(responseData))

        return testAPISource.get('/getEndpoint')
          .then(json => {
            assert.deepEqual(json, responseData)
            assertCalled('https://test/getEndpoint')
          })
      })

      it('works for baseUrl', () => {
        const responseData = { ok: true }
        fetchMock.mock('https://test/getEndpoint', jsonAPIResponse(responseData))

        return createApiSource('https://test/')
          .get('getEndpoint')
          .then(json => {
            assert.deepEqual(json, responseData)
            assertCalled('https://test/getEndpoint')
          })
      })

      it('works for baseUrl and endpoint combined', () => {
        const responseData = { ok: true }
        fetchMock.mock('https://test/getEndpoint', jsonAPIResponse(responseData))

        return createApiSource('https://test/')
          .get('/getEndpoint')
          .then(json => {
            assert.deepEqual(json, responseData)
            assertCalled('https://test/getEndpoint')
          })
      })

      it('throws on invalid endPoint', () => {
        const responseData = { ok: true }
        fetchMock.mock('https://test/getEndpoint', jsonAPIResponse(responseData))
        const invalidEndpoint = () => createApiSource('https://test/').get('https://invalidEndpoint')

        assert.throws(invalidEndpoint, /Endpoint seems invalid/)
      })
    })
  })
})
