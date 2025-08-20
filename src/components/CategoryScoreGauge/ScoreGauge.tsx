import type { ComponentProps, CSSProperties, FC } from 'react'

type Props = {
  baseClass: string
  circumference: number
  color: string
  offset: number
  radius: number
  size: number
  strokeWidth: number
} & ComponentProps<'svg'>

export const ScoreGauge: FC<Props> = ({
  baseClass,
  circumference,
  color,
  offset,
  radius,
  size,
  strokeWidth,
  ...rest
}) => (
  <svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg" {...rest}>
    <circle
      className={`${baseClass}__progress`}
      cx={size / 2}
      cy={size / 2}
      fill="none"
      r={radius}
      stroke={color}
      strokeDasharray={circumference}
      strokeDashoffset={offset}
      strokeLinecap="round"
      strokeWidth={strokeWidth}
      style={
        {
          '--circumference': circumference,
          '--offset': offset,
        } as CSSProperties
      }
      transform={`rotate(-90 ${size / 2} ${size / 2})`}
    />
    <circle
      cx={size / 2}
      cy={size / 2}
      fill={color}
      r={radius}
      stroke="none"
      strokeDasharray={circumference}
      strokeDashoffset={offset}
      strokeLinecap="round"
      style={{ opacity: 0.1 }}
    />
  </svg>
)
