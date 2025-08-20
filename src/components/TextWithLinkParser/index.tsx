import type { FC } from 'react'

type Props = {
  text: string
}

export const TextWithLinkParser: FC<Props> = ({ text }) => {
  const parts = []
  const regex = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g
  let lastIndex = 0
  let match

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index))
    }
    parts.push(
      <a href={match[2]} key={match[2]} rel="noopener noreferrer" target="_blank">
        {match[1]}
      </a>,
    )
    lastIndex = regex.lastIndex
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex))
  }

  return <>{parts}</>
}
