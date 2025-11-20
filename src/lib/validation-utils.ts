/**
 * Common validation utilities
 */

export class ValidationUtils {
  static isEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(email)
  }

  static isURL(url: string): boolean {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  static isHex(hex: string): boolean {
    return /^[0-9a-fA-F]+$/.test(hex)
  }

  static isEthereumAddress(address: string): boolean {
    return /^0x[0-9a-fA-F]{40}$/.test(address)
  }

  static isTransactionHash(hash: string): boolean {
    return /^0x[0-9a-fA-F]{64}$/.test(hash)
  }

  static isUUID(uuid: string): boolean {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(uuid)
  }

  static isNumeric(value: string): boolean {
    return /^-?\d+\.?\d*$/.test(value)
  }

  static isAlphanumeric(value: string): boolean {
    return /^[a-zA-Z0-9]+$/.test(value)
  }

  static isStrongPassword(password: string): boolean {
    return (
      password.length >= 8 &&
      /[a-z]/.test(password) &&
      /[A-Z]/.test(password) &&
      /[0-9]/.test(password) &&
      /[^a-zA-Z0-9]/.test(password)
    )
  }

  static isJSON(str: string): boolean {
    try {
      JSON.parse(str)
      return true
    } catch {
      return false
    }
  }

  static isBase64(str: string): boolean {
    try {
      return btoa(atob(str)) === str
    } catch {
      return false
    }
  }

  static isEmpty(value: unknown): boolean {
    if (value === null || value === undefined) {
      return true
    }
    if (typeof value === 'string') {
      return value.trim().length === 0
    }
    if (Array.isArray(value)) {
      return value.length === 0
    }
    if (typeof value === 'object') {
      return Object.keys(value).length === 0
    }
    return false
  }

  static isInRange(value: number, min: number, max: number): boolean {
    return value >= min && value <= max
  }

  static matches(value: string, pattern: RegExp): boolean {
    return pattern.test(value)
  }

  static minLength(value: string, min: number): boolean {
    return value.length >= min
  }

  static maxLength(value: string, max: number): boolean {
    return value.length <= max
  }

  static isIPv4(ip: string): boolean {
    const parts = ip.split('.')
    if (parts.length !== 4) {
      return false
    }
    return parts.every((part) => {
      const num = parseInt(part, 10)
      return num >= 0 && num <= 255 && part === num.toString()
    })
  }

  static isIPv6(ip: string): boolean {
    const regex =
      /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/
    return regex.test(ip)
  }

  static isPhoneNumber(phone: string): boolean {
    const cleaned = phone.replace(/\D/g, '')
    return cleaned.length >= 10 && cleaned.length <= 15
  }

  static isCreditCard(card: string): boolean {
    const cleaned = card.replace(/\D/g, '')
    if (cleaned.length < 13 || cleaned.length > 19) {
      return false
    }

    // Luhn algorithm
    let sum = 0
    let isEven = false

    for (let i = cleaned.length - 1; i >= 0; i--) {
      let digit = parseInt(cleaned[i], 10)

      if (isEven) {
        digit *= 2
        if (digit > 9) {
          digit -= 9
        }
      }

      sum += digit
      isEven = !isEven
    }

    return sum % 10 === 0
  }

  static isSlug(slug: string): boolean {
    return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)
  }

  static isUsername(username: string): boolean {
    return /^[a-zA-Z0-9_-]{3,20}$/.test(username)
  }

  static isInteger(value: string): boolean {
    return /^-?\d+$/.test(value) && !isNaN(parseInt(value, 10))
  }

  static isPositive(value: number): boolean {
    return value > 0
  }

  static isNegative(value: number): boolean {
    return value < 0
  }

  static isZero(value: number): boolean {
    return value === 0
  }

  static isDivisibleBy(value: number, divisor: number): boolean {
    return divisor !== 0 && value % divisor === 0
  }

  static isDateString(date: string): boolean {
    return !isNaN(Date.parse(date))
  }

  static isFutureDate(date: Date | string): boolean {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return dateObj.getTime() > Date.now()
  }

  static isPastDate(date: Date | string): boolean {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return dateObj.getTime() < Date.now()
  }

  static isValidDate(year: number, month: number, day: number): boolean {
    const date = new Date(year, month - 1, day)
    return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day
  }

  static isHexColor(color: string): boolean {
    return /^#([0-9A-F]{3}){1,2}$/i.test(color)
  }

  static isRgbColor(color: string): boolean {
    return /^rgb\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*\)$/i.test(color)
  }

  static isRgbaColor(color: string): boolean {
    return /^rgba\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*[\d.]+\s*\)$/i.test(color)
  }

  static isPort(port: number): boolean {
    return Number.isInteger(port) && port >= 0 && port <= 65535
  }

  static isMACAddress(mac: string): boolean {
    return /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/.test(mac)
  }

  static isLowercase(str: string): boolean {
    return str === str.toLowerCase() && str !== str.toUpperCase()
  }

  static isUppercase(str: string): boolean {
    return str === str.toUpperCase() && str !== str.toLowerCase()
  }

  static containsUppercase(str: string): boolean {
    return /[A-Z]/.test(str)
  }

  static containsLowercase(str: string): boolean {
    return /[a-z]/.test(str)
  }

  static containsNumber(str: string): boolean {
    return /\d/.test(str)
  }

  static containsSpecialChar(str: string): boolean {
    return /[!@#$%^&*(),.?":{}|<>]/.test(str)
  }

  static isWhitespace(str: string): boolean {
    return /^\s*$/.test(str)
  }

  static isASCII(str: string): boolean {
    return /^[\x00-\x7F]*$/.test(str)
  }

  static isLatitude(lat: number): boolean {
    return lat >= -90 && lat <= 90
  }

  static isLongitude(lng: number): boolean {
    return lng >= -180 && lng <= 180
  }

  static isSemver(version: string): boolean {
    return /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/.test(
      version
    )
  }

  static validateObject<T>(
    obj: unknown,
    schema: Record<string, (value: unknown) => boolean>
  ): obj is T {
    if (typeof obj !== 'object' || obj === null) {
      return false
    }

    return Object.entries(schema).every(([key, validator]) => {
      return validator((obj as Record<string, unknown>)[key])
    })
  }

  static validateRequired(value: unknown): boolean {
    return value !== null && value !== undefined && value !== ''
  }

  static validateOptional(value: unknown, validator: (val: unknown) => boolean): boolean {
    if (value === null || value === undefined || value === '') {
      return true
    }
    return validator(value)
  }
}
