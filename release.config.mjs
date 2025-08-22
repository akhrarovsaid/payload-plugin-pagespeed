/**
 * @type {import('semantic-release').GlobalConfig}
 */
export default {
  branches: ['main'],
  plugins: [
    '@semantic-release/npm',
    [
      '@semantic-release/git',
      {
        assets: ['package.json', 'pnpm-lock.yaml'],
        message: 'chore: release ${nextRelease.version} [skip ci]',
      },
    ],
  ],
}
