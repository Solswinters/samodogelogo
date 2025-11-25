/**
 * Robots.txt generation
 */

export interface RobotsConfig {
  userAgent: string
  allow?: string[]
  disallow?: string[]
  crawlDelay?: number
}

/**
 * generateRobotsTxt utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of generateRobotsTxt.
 */
export function generateRobotsTxt(config: { sitemapUrl?: string; rules?: RobotsConfig[] }): string {
  const { sitemapUrl, rules = [] } = config

  const defaultRules: RobotsConfig[] = [
    {
      userAgent: '*',
      allow: ['/'],
      disallow: ['/api/', '/_next/'],
    },
  ]

  const allRules = rules.length > 0 ? rules : defaultRules

  const ruleBlocks = allRules
    .map((rule) => {
      const lines = [`User-agent: ${rule.userAgent}`]

      if (rule.allow) {
        lines.push(...rule.allow.map((path) => `Allow: ${path}`))
      }

      if (rule.disallow) {
        lines.push(...rule.disallow.map((path) => `Disallow: ${path}`))
      }

      if (rule.crawlDelay) {
        lines.push(`Crawl-delay: ${rule.crawlDelay}`)
      }

      return lines.join('\n')
    })
    .join('\n\n')

  const sitemapLine = sitemapUrl ? `\nSitemap: ${sitemapUrl}` : ''

  return `${ruleBlocks}${sitemapLine}`
}
