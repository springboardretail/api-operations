import { assert } from 'chai'
import fetchMock from 'fetch-mock'

export function jsonAPIStatusError(status) {
  return {
    status,
    body: { error: `${status}`, message: `Status ${status}` },
    headers: { 'Content-Type': 'application/json' },
  }
}

export function jsonAPIResponse(body) {
  return {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
    body,
  }
}

export function assertCalled(url) {
  return assert(fetchMock.called(url), `FetchMock: '${url}' wasn't called`)
}
