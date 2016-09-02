/* eslint-disable no-underscore-dangle */
import { assert } from 'chai'
import fetchMock from 'fetch-mock'
import { jsonAPIResponse, jsonAPIStatusError, assertCalled } from './fetch-mock-helpers'
import {
  get,
  getQuery,
  postJson,
  putJson,
  patchJson,
  delete_,
  createApiSource,
} from '../apiOperations'

const testAPISource = createApiSource('https://test', { credentials: 'same-origin' })


describe('apiOperations', () => {
  afterEach(() => fetchMock.restore())

  it('uses passed options', () => {
    const responseData = { ok: true }
    fetchMock.get('https://test/credentials', jsonAPIResponse(responseData))

    return get('https://test/credentials', { credentials: 'same-origin' })
      .then(json => {
        assert.deepEqual(json, responseData)
        assert.equal(fetchMock.lastOptions('https://test/credentials').credentials, 'same-origin')
      })
  })

  it('uses passed status validator', () => {
    const responseData = { ok: true }
    fetchMock.get('https://test/customStatus', {
      status: 505,
      headers: { 'Content-Type': 'application/json' },
      body: responseData,
    })
    const statusValidator = (status) => status > 504 && status < 509

    return get('https://test/customStatus', {}, { statusValidator })
      .then(json => {
        assert.deepEqual(json, responseData)
        assertCalled('https://test/customStatus')
      })
  })

  it('uses passed error parser', () => {
    fetchMock.get('https://test/customError', jsonAPIStatusError(400))
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

  it('returns raw result if operationOptions.dontParse = true', () => {
    const responseData = { ok: true }
    fetchMock.get('https://test/dontParse', jsonAPIResponse(responseData))

    return get('https://test/dontParse', {}, { dontParse: true })
      .then(response => {
        const {
          url,
          status,
          statusText,
          headers,
          body,
          bodyUsed,
          ok,
        } = response
        assert.isDefined(url)
        assert.isDefined(status)
        assert.isDefined(statusText)
        assert.isDefined(headers)
        assert.isDefined(body)
        assert.isDefined(bodyUsed)
        assert.isDefined(ok)
        assertCalled('https://test/dontParse')
      })
  })

  it('throws on error', () => {
    fetchMock.get('https://test/error', jsonAPIStatusError(400))

    return get('https://test/error')
      .catch(error => {
        assert.equal(error.message, 'Status 400')
        assertCalled('https://test/error')
      })
  })

  describe('#get', () => {
    it('gets json', () => {
      const responseData = { ok: true }
      fetchMock.get('https://test/get', jsonAPIResponse(responseData))

      return get('https://test/get')
        .then(json => {
          assert.deepEqual(json, responseData)
          assertCalled('https://test/get')
        })
    })
  })

  describe('#getQuery', () => {
    it('gets json', () => {
      const responseData = { ok: true }
      fetchMock.get('https://test/getQuery?foo=bar&bar=baz', jsonAPIResponse(responseData))
      const query = {
        foo: 'bar',
        bar: 'baz',
      }

      return getQuery('https://test/getQuery', query)
        .then(json => {
          assert.deepEqual(json, responseData)
          assertCalled('https://test/getQuery?foo=bar&bar=baz')
        })
    })

    it('appends query params to url query params', () => {
      const responseData = { ok: true }
      fetchMock.get('https://test/getQuery?a=b&foo=bar&bar=baz', jsonAPIResponse(responseData))
      const query = {
        foo: 'bar',
        bar: 'baz',
      }

      return getQuery('https://test/getQuery?a=b', query)
        .then(json => {
          assert.deepEqual(json, responseData)
          assertCalled('https://test/getQuery?a=b&foo=bar&bar=baz')
        })
    })

    it('strips undefined values', () => {
      const responseData = { ok: true }
      fetchMock.get('https://test/getQuery?foo=bar&bar=baz', jsonAPIResponse(responseData))
      const query = {
        foo: 'bar',
        bad: undefined,
        bar: 'baz',
        baz: undefined,
      }

      return getQuery('https://test/getQuery', query)
        .then(json => {
          assert.deepEqual(json, responseData)
          assertCalled('https://test/getQuery?foo=bar&bar=baz')
        })
    })
  })

  describe('#post', () => {
    it('posts json', () => {
      const responseData = { ok: true }
      const sentData = { sent: true }
      fetchMock.post('https://test/post', jsonAPIResponse(responseData))

      return postJson('https://test/post', sentData)
        .then(json => {
          assert.deepEqual(json, responseData)
          assertCalled('https://test/post')
          assert.deepEqual(JSON.parse(fetchMock.lastOptions('https://test/post').body), sentData)
        })
    })
  })

  describe('#put', () => {
    it('puts json', () => {
      const responseData = { ok: true }
      const sentData = { sent: true }
      fetchMock.put('https://test/put', jsonAPIResponse(responseData))

      return putJson('https://test/put', sentData)
        .then(json => {
          assert.deepEqual(json, responseData)
          assertCalled('https://test/put')
          assert.deepEqual(JSON.parse(fetchMock.lastOptions('https://test/put').body), sentData)
        })
    })
  })

  describe('#patch', () => {
    it('patches json', () => {
      const responseData = { ok: true }
      const sentData = { sent: true }
      fetchMock.mock('https://test/patch', jsonAPIResponse(responseData), { method: 'PATCH' })

      return patchJson('https://test/patch', sentData)
        .then(json => {
          assert.deepEqual(json, responseData)
          assertCalled('https://test/patch')
          assert.deepEqual(JSON.parse(fetchMock.lastOptions('https://test/patch').body), sentData)
        })
    })
  })

  describe('#delete_', () => {
    it('deletes json', () => {
      const responseData = { ok: true }
      const sentData = { sent: true }
      fetchMock.delete('https://test/delete', jsonAPIResponse(responseData))

      return delete_('https://test/delete', sentData)
        .then(json => {
          assert.deepEqual(json, responseData)
          assertCalled('https://test/delete')
          assert.deepEqual(JSON.parse(fetchMock.lastOptions('https://test/delete').body), sentData)
        })
    })
  })

  describe('#createApiSource', () => {
    describe('#get', () => {
      it('gets json', () => {
        const responseData = { ok: true }
        fetchMock.get('https://test/getEndpoint', jsonAPIResponse(responseData))

        return testAPISource.get('getEndpoint')
          .then(json => {
            assert.deepEqual(json, responseData)
            assertCalled('https://test/getEndpoint')
          })
      })
    })

    describe('#getQuery', () => {
      it('gets json', () => {
        const responseData = { ok: true }
        fetchMock.get('https://test/getQueryEndpoint?foo=bar&bar=baz', jsonAPIResponse(responseData))
        const query = {
          foo: 'bar',
          bar: 'baz',
        }

        return testAPISource.getQuery('getQueryEndpoint', query)
          .then(json => {
            assert.deepEqual(json, responseData)
            assertCalled('https://test/getQueryEndpoint?foo=bar&bar=baz')
          })
      })
    })

    describe('#post', () => {
      it('posts json', () => {
        const responseData = { ok: true }
        const sentData = { sent: true }
        fetchMock.post('https://test/postEndpoint', jsonAPIResponse(responseData))

        return testAPISource.postJson('postEndpoint', sentData)
          .then(json => {
            assert.deepEqual(json, responseData)
            assertCalled('https://test/postEndpoint')
            assert.deepEqual(JSON.parse(fetchMock.lastOptions('https://test/postEndpoint').body), sentData)
          })
      })
    })

    describe('#put', () => {
      it('puts json', () => {
        const responseData = { ok: true }
        const sentData = { sent: true }
        fetchMock.put('https://test/putEndpoint', jsonAPIResponse(responseData))

        return testAPISource.putJson('putEndpoint', sentData)
          .then(json => {
            assert.deepEqual(json, responseData)
            assertCalled('https://test/putEndpoint')
            assert.deepEqual(JSON.parse(fetchMock.lastOptions('https://test/putEndpoint').body), sentData)
          })
      })
    })

    describe('#patch', () => {
      it('patches json', () => {
        const responseData = { ok: true }
        const sentData = { sent: true }
        fetchMock.mock('https://test/patchEndpoint', jsonAPIResponse(responseData), { method: 'PATCH' })

        return testAPISource.patchJson('patchEndpoint', sentData)
          .then(json => {
            assert.deepEqual(json, responseData)
            assertCalled('https://test/patchEndpoint')
            assert.deepEqual(JSON.parse(fetchMock.lastOptions('https://test/patchEndpoint').body), sentData)
          })
      })
    })

    describe('#delete', () => {
      describe('when body is present', () => {
        it('sends a delete request with json', () => {
          const responseData = { ok: true }
          const sentData = { sent: true }
          fetchMock.mock('https://test/deleteEndpoint', jsonAPIResponse(responseData))

          return testAPISource.delete('deleteEndpoint', sentData)
            .then(json => {
              assert.deepEqual(json, responseData)
              assertCalled('https://test/deleteEndpoint')
              assert.deepEqual(JSON.parse(fetchMock.lastOptions('https://test/deleteEndpoint').body), sentData)
            })
        })
      })
      describe('when body is not present', () => {
        it('sends a delete request', () => {
          const responseData = { ok: true }
          fetchMock.mock('https://test/deleteEndpoint', jsonAPIResponse(responseData))

          return testAPISource.delete('deleteEndpoint')
            .then(json => {
              assert.deepEqual(json, responseData)
              assertCalled('https://test/deleteEndpoint')
            })
        })
      })
    })

    it('throws on error', () => {
      fetchMock.get('https://test/errorEndpoint', jsonAPIStatusError(400))

      return testAPISource.get('errorEndpoint')
        .catch(error => {
          assert.equal(error.message, 'Status 400')
          assertCalled('https://test/errorEndpoint')
        })
    })

    it('hits baseUrl when no endpoint is given', () => {
      const responseData = { ok: true }
      fetchMock.get('https://test/', jsonAPIResponse(responseData))

      return testAPISource.get()
        .then(json => {
          assert.deepEqual(json, responseData)
          assertCalled('https://test/')
        })
    })

    it('uses baseOptions', () => {
      const responseData = { ok: true }
      fetchMock.get('https://test/baseoptions', jsonAPIResponse(responseData))

      return testAPISource.get('baseoptions')
        .then(json => {
          assert.deepEqual(json, responseData)
          assert.equal(fetchMock.lastOptions('https://test/baseoptions').credentials, 'same-origin')
        })
    })


    describe('stardardize URL', () => {
      it('works for endpoint', () => {
        const responseData = { ok: true }
        fetchMock.get('https://test/getEndpoint', jsonAPIResponse(responseData))

        return testAPISource.get('/getEndpoint')
          .then(json => {
            assert.deepEqual(json, responseData)
            assertCalled('https://test/getEndpoint')
          })
      })

      it('works for baseUrl', () => {
        const responseData = { ok: true }
        fetchMock.get('https://test/getEndpoint', jsonAPIResponse(responseData))

        return createApiSource('https://test/')
          .get('getEndpoint')
          .then(json => {
            assert.deepEqual(json, responseData)
            assertCalled('https://test/getEndpoint')
          })
      })

      it('works for baseUrl and endpoint combined', () => {
        const responseData = { ok: true }
        fetchMock.get('https://test/getEndpoint', jsonAPIResponse(responseData))

        return createApiSource('https://test/')
          .get('/getEndpoint')
          .then(json => {
            assert.deepEqual(json, responseData)
            assertCalled('https://test/getEndpoint')
          })
      })

      it('throws on invalid endpoint', () => {
        const responseData = { ok: true }
        fetchMock.get('https://test/getEndpoint', jsonAPIResponse(responseData))
        const invalidEndpoint = () => createApiSource('https://test/').get('https://invalidEndpoint')

        assert.throws(invalidEndpoint, /Endpoint seems invalid/)
      })

      it('allows numeric endpoint', () => {
        const responseData = { ok: true }
        fetchMock.get('https://test/123', jsonAPIResponse(responseData))
        const endpoint = () => createApiSource('https://test/').get(123)

        assert.doesNotThrow(endpoint)
      })
    })
  })
})
