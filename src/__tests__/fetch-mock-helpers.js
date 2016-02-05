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
