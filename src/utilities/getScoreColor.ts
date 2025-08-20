export const getScoreColor = (score: number): string => {
  if (score >= 0.9) {
    return 'var(--psi-green)'
  } else if (score >= 0.5) {
    return 'var(--psi-orange)'
  }
  return 'var(--psi-red)'
}
