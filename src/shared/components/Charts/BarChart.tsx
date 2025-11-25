/**
 * Bar chart component
 */

'use client'

export interface BarData {
  label: string
  value: number
  color?: string
}

export interface BarChartProps {
  data: BarData[]
  width?: number
  height?: number
  showValues?: boolean
  horizontal?: boolean
}

/**
 * BarChart utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of BarChart.
 */
export function BarChart({
  data,
  width = 400,
  height = 200,
  showValues = true,
  horizontal = false,
}: BarChartProps) {
  if (data.length === 0) return null

  const padding = 40
  const maxValue = Math.max(...data.map((d) => d.value))

  if (horizontal) {
    const barHeight = (height - padding * 2) / data.length
    const chartWidth = width - padding * 2

    return (
      <div className="rounded-lg bg-gray-800 p-4">
        <svg width={width} height={height}>
          {data.map((item, i) => {
            const barWidth = (item.value / maxValue) * chartWidth
            const y = padding + i * barHeight

            return (
              <g key={i}>
                <rect
                  x={padding}
                  y={y}
                  width={barWidth}
                  height={barHeight * 0.8}
                  fill={item.color || '#a855f7'}
                  rx="4"
                />
                <text x={10} y={y + barHeight * 0.5} fill="#9ca3af" fontSize="12">
                  {item.label}
                </text>
                {showValues && (
                  <text
                    x={padding + barWidth + 5}
                    y={y + barHeight * 0.5}
                    fill="#e5e7eb"
                    fontSize="12"
                  >
                    {item.value}
                  </text>
                )}
              </g>
            )
          })}
        </svg>
      </div>
    )
  }

  const barWidth = (width - padding * 2) / data.length
  const chartHeight = height - padding * 2

  return (
    <div className="rounded-lg bg-gray-800 p-4">
      <svg width={width} height={height}>
        {data.map((item, i) => {
          const barH = (item.value / maxValue) * chartHeight
          const x = padding + i * barWidth

          return (
            <g key={i}>
              <rect
                x={x}
                y={height - padding - barH}
                width={barWidth * 0.8}
                height={barH}
                fill={item.color || '#a855f7'}
                rx="4"
              />
              <text
                x={x + barWidth * 0.4}
                y={height - 5}
                fill="#9ca3af"
                fontSize="12"
                textAnchor="middle"
              >
                {item.label}
              </text>
              {showValues && (
                <text
                  x={x + barWidth * 0.4}
                  y={height - padding - barH - 5}
                  fill="#e5e7eb"
                  fontSize="12"
                  textAnchor="middle"
                >
                  {item.value}
                </text>
              )}
            </g>
          )
        })}
      </svg>
    </div>
  )
}
