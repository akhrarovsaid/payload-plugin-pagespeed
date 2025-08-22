/**
 * @type {import('semantic-release').GlobalConfig}
 */
export default {
  branches: ['main'],
  plugins: ['semantic-release-export-data', '@semantic-release/npm'],
}
