'use client'

import type { FC, ReactNode } from 'react'

import { useEffect, useState } from 'react'

import { useIntersect } from '../../hooks/useIntersect.js'

export const RenderIfInViewport: FC<{
  children: ReactNode
  className?: string
  forceRender?: boolean
}> = ({ children, className, forceRender }) => {
  const [hasRendered, setHasRendered] = useState(Boolean(forceRender))
  const [intersectionRef, entry] = useIntersect(
    {
      rootMargin: '1000px',
    },
    Boolean(forceRender),
  )

  const isIntersecting = Boolean(entry?.isIntersecting)
  const isAboveViewport = entry?.boundingClientRect?.top ?? 1 < 0
  const shouldRender = forceRender || isIntersecting || isAboveViewport

  useEffect(() => {
    if (shouldRender && !hasRendered) {
      setHasRendered(true)
    }
  }, [shouldRender, hasRendered])

  return (
    <div className={className} ref={intersectionRef}>
      {hasRendered ? children : null}
    </div>
  )
}
