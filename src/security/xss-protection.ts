/**
 * XSS protection utilities
 */

export function escapeHTML(str: string): string {
  const div = document.createElement('div')
  div.appendChild(document.createTextNode(str))
  return div.innerHTML
}

export function unescapeHTML(str: string): string {
  const div = document.createElement('div')
  div.innerHTML = str
  return div.textContent || div.innerText || ''
}

export function stripScripts(html: string): string {
  const div = document.createElement('div')
  div.innerHTML = html

  // Remove all script tags
  const scripts = div.querySelectorAll('script')
  scripts.forEach(script => script.remove())

  // Remove event handlers
  const elements = div.querySelectorAll('*')
  elements.forEach(el => {
    Array.from(el.attributes).forEach(attr => {
      if (attr.name.startsWith('on')) {
        el.removeAttribute(attr.name)
      }
    })
  })

  return div.innerHTML
}

export function sanitizeUserInput(input: string): string {
  return escapeHTML(stripScripts(input))
}

export const allowedTags = ['p', 'br', 'strong', 'em', 'u', 'a', 'ul', 'ol', 'li']

export function sanitizeRichText(html: string): string {
  const div = document.createElement('div')
  div.innerHTML = html

  // Remove disallowed tags
  const elements = div.querySelectorAll('*')
  elements.forEach(el => {
    if (!allowedTags.includes(el.tagName.toLowerCase())) {
      el.remove()
    }
  })

  return stripScripts(div.innerHTML)
}
