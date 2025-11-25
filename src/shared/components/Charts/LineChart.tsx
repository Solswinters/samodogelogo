/**
 * Line chart component
 */

'use client'

export interface DataPoint {
  x: number
  y: number
  label?: string
}

export interface LineChartProps {
  data: DataPoint[]
  width?: number
  height?: number
  color?: string
  showGrid?: boolean
  showDots?: boolean
}

/**
 * LineChart utility function.
 * @param props - Component properties or function arguments.
 * @returns The result of LineChart.
 */
export function LineChart({
  data,
  width = 400,
  height = 200,
  color = '#a855f7',
  showGrid = true,
  showDots = true,
}: LineChartProps) {
  if (data.length === 0) return null

  const padding = 20
  const chartWidth = width - padding * 2
  const chartHeight = height - padding * 2

  const xMin = Math.min(...data.map((d) => d.x))
  const xMax = Math.max(...data.map((d) => d.x))
  const yMin = Math.min(...data.map((d) => d.y))
  const yMax = Math.max(...data.map((d) => d.y))

  const xScale = (x: number) => ((x - xMin) / (xMax - xMin)) * chartWidth + padding
  const yScale = (y: number) => height - (((y - yMin) / (yMax - yMin)) * chartHeight + padding)

  const pathData = data
    .map((point, i) => {
      const x = xScale(point.x)
      const y = yScale(point.y)
      return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`
    })
    .join(' ')

  return (
    <div className="rounded-lg bg-gray-800 p-4">
      <svg width={width} height={height} className="overflow-visible">
        {showGrid && (
          <g className="text-gray-700">
            {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
              <line
                key={`h-${ratio}`}
                x1={padding}
                y1={height - (ratio * chartHeight + padding)}
                x2={width - padding}
                y2={height - (ratio * chartHeight + padding)}
                stroke="currentColor"
                strokeWidth="1"
                opacity="0.2"
              />
            ))}
          </g>
        )}
        <path d={pathData} fill="none" stroke={color} strokeWidth="2" />
        {showDots &&
          data.map((point, i) => (
            <circle key={i} cx={xScale(point.x)} cy={yScale(point.y)} r="4" fill={color} />
          ))}
      </svg>
    </div>
  )
}
