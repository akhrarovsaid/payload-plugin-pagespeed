import { getScoreColor } from '../../utilities/getScoreColor.js'
import './index.scss'

const baseClass = 'psi-indicators'

export const TriangleIndicatorIcon = () => (
  <svg
    className={`${baseClass}__svg`}
    height="100%"
    viewBox="0 0 100 100"
    width="100%"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
  >
    <polygon
      className={`${baseClass}__triangle`}
      points="50 15, 100 100, 0 100"
      style={{ fill: getScoreColor(0) }}
    />
  </svg>
)

export const SquareIndicatorIcon = () => (
  <svg
    className={`${baseClass}__svg`}
    height="100%"
    viewBox="0 0 100 100"
    width="100%"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
  >
    <polygon
      className={`${baseClass}__square`}
      points="0 0, 0 100, 100 100, 100 0"
      style={{ fill: getScoreColor(0.5) }}
    />
  </svg>
)

export const CircleIndicatorIcon = ({ noScore }: { noScore?: boolean }) => (
  <svg
    className={`${baseClass}__svg`}
    height="100%"
    viewBox="0 0 100 100"
    width="100%"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
  >
    <circle
      className={`${baseClass}__circle`}
      cx={50}
      cy={50}
      r={50}
      style={{ fill: noScore ? 'var(--theme-elevation-200)' : getScoreColor(1) }}
    />
  </svg>
)

export const IndicatorLegend = () => {
  return (
    <ul className={baseClass}>
      <li className={`${baseClass}__indicator`}>
        <TriangleIndicatorIcon />
        <p className={`${baseClass}__indicator-label`}>0-49</p>
      </li>
      <li className={`${baseClass}__indicator`}>
        <SquareIndicatorIcon />
        <p className={`${baseClass}__indicator-label`}>50-89</p>
      </li>
      <li className={`${baseClass}__indicator`}>
        <CircleIndicatorIcon />
        <p className={`${baseClass}__indicator-label`}>90-100</p>
      </li>
    </ul>
  )
}
