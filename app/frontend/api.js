function csrfToken() {
  return document.querySelector('meta[name="csrf-token"]')?.getAttribute("content")
}

export async function apiFetch(path, options = {}) {
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...options.headers,
  }
  const token = csrfToken()
  if (token) headers["X-CSRF-Token"] = token

  const res = await fetch(path, { ...options, headers })
  const text = await res.text()
  let body = null
  if (text) {
    try {
      body = JSON.parse(text)
    } catch {
      body = { raw: text }
    }
  }
  if (!res.ok) {
    const message = body?.errors?.join?.("; ") || body?.error || res.statusText
    throw new Error(message || `HTTP ${res.status}`)
  }
  return { res, body }
}

export function apiJson(path, options = {}) {
  return apiFetch(path, options).then(({ body }) => body)
}
