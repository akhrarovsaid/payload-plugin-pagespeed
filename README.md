![payload-plugin-pagespeed-banner](https://github.com/user-attachments/assets/7fb6cc8b-84eb-4d1a-9f0b-d11c9ae4ad11)

[![npm version](https://img.shields.io/npm/v/payload-plugin-pagespeed.svg)](https://www.npmjs.com/package/payload-plugin-pagespeed)
[![npm downloads](https://img.shields.io/npm/dm/payload-plugin-pagespeed.svg)](https://www.npmjs.com/package/payload-plugin-pagespeed)
[![license](https://img.shields.io/github/license/akhrarovsaid/payload-plugin-pagespeed.svg)](./LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/akhrarovsaid/payload-plugin-pagespeed?style=social)](https://github.com/akhrarovsaid/payload-plugin-pagespeed)

# payload-plugin-pagespeed

A [Payload CMS](https://payloadcms.com) plugin that integrates [Google PageSpeed Insights](https://developers.google.com/speed/pagespeed/insights/) into your project. Use it to analyze pages and view performance metrics directly in your Payload admin ui.

## Features

- 🔍 Run [PageSpeed Insights](https://developers.google.com/speed/pagespeed/insights/) checks on demand  
- 📊 Store results in a Payload collection  
- ⚡ Simple setup with minimal configuration  
- 🛠 Works with your existing PayloadCMS project

## Demo

[payload-plugin-pagespeed-demo.webm](https://github.com/user-attachments/assets/319dee12-0b22-4b3c-8809-fd3c12b5ead6)

## Installation

```
pnpm add payload-plugin-pagespeed
```

## Getting Started

> [!IMPORTANT]  
> Make sure to get a [PageSpeed Insights API key](https://developers.google.com/speed/docs/insights/v5/get-started#APIKey) as this plugin requires one to communicate with the PageSpeed API.

Add the plugin to your `payload.config.ts`:

```ts
import { buildConfig } from 'payload/config'
import { pageSpeedPlugin } from 'payload-plugin-pagespeed'

export default buildConfig({
  // ... your config
  plugins: [
    // ... your other plugins
    pageSpeedPlugin({
      apiKey: process.env.PAGESPEED_API_KEY, // Required
    }),
  ],
})
```

Now start your Payload app:

```
pnpm dev
```

You’ll see a new collection in the admin panel where your PageSpeed Insight reports are stored, by default this is the `PageSpeed Insights` collection.

## Usage

1. Go to the `PageSpeed Insights` collection in the Payload admin.  
2. Create a new entry with a `URL`.  
3. The plugin will fetch results from Google PageSpeed Insights and save them (This may take a while as the PageSpeed Insights API analyzes your page).
4. View metrics such as **Performance, Accessibility, SEO, and Best Practices**.  

![create-new-doc](https://github.com/user-attachments/assets/9db31117-7c10-46f9-ac4b-248b865ea895)

## Configuration

The plugin accepts the following options:

| Key                          | Type                                                                                                                           | Description                                                                                                                       |
| :---                         | :---                                                                                                                           | :---                                                                                                                              |
| `apiKey`*                    | `string` (required)                                                                                                            | A Google PageSpeed Insights API key.                                                                                              |
| `debug`                      | `boolean`                                                                                                                      | A boolean that, when true, shows debug information and the hidden reports collection.                                             |
| `disabled`                   | `boolean`                                                                                                                      | A boolean that, when true, prevents the plugin from mounting the api endpoint in collection config.                               |
| `generateFileName`           | `function` ([GenerateFileNameFn](https://github.com/akhrarovsaid/payload-plugin-pagespeed/blob/main/src/types/index.ts#L15))   | An optional function that is invoked to generate a filename for a PageSpeed Insights report object.                               |
| `generateFilePrefix`         | `function` ([GenerateFilePrefixFn](https://github.com/akhrarovsaid/payload-plugin-pagespeed/blob/main/src/types/index.ts#L21)) | An optional function that is invoked to generate a file prefix for a PageSpeed Insights report object if using a storage adapter. |
| `overrideInsightsCollection` | `function` ([CollectionOverride](https://github.com/akhrarovsaid/payload-plugin-pagespeed/blob/main/src/types/index.ts#L8))    | A function used to override the default PageSpeed Insights collection.                                                            |
| `overrideReportsCollection`  | `function` ([CollectionOverride](https://github.com/akhrarovsaid/payload-plugin-pagespeed/blob/main/src/types/index.ts#L8))    | A function used to override the default PageSpeed Reports collection.                                                             |

> [!NOTE]
> In order to successfully work, the user making the request needs to have both `read` and `create` access for the PageSpeed Insights collection. In addition, this plugin sets the `update` access control on the PageSpeed Insights collection to `false`. An example below shows customizing access controls and other collection configs.

### Example plugin configurations

<details>
  <summary>
    With custom access controls
  </summary>

  ```ts
  import { buildConfig } from 'payload/config'
  import { pageSpeedPlugin } from 'payload-plugin-pagespeed'

  export default buildConfig({
    // ... your config
    plugins: [
      // ... your other plugins
      pageSpeedPlugin({
        apiKey: process.env.PAGESPEED_API_KEY, // Required
        overrideInsightsCollection: (collection) => ({
          ...collection,
          access: {
            ...collection,
            read: () => true, // Anyone can read the insights collection
            create: () => true, // Anyone can create an insights report
          }
          // ... other overrides
        })
      }),
    ],
  })
  ```
</details>

<details>
  <summary>
    With storage adapter
  </summary>

  ```ts
  import { s3Storage } from '@payloadcms/storage-s3'
  import { buildConfig } from 'payload/config'
  import { pageSpeedPlugin } from 'payload-plugin-pagespeed'

  export default buildConfig({
    // ... your config
    plugins: [
      // ... your other plugins
      s3Storage({
        bucket: process.env.S3_BUCKET || '',
        collections: {
          'pagespeed-reports': true,
        },
        config: {
          credentials: {
            accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
            secretAccessKey: process.env.S3_SECRET || '',
          },
          endpoint: process.env.S3_ENDPOINT || '',
          region: process.env.S3_REGION || '',
        },
      })
      pageSpeedPlugin({
        apiKey: process.env.PAGESPEED_API_KEY, // Required
        generateFilePrefix: ({ collection, req }) => { ... } // Save to specific folder in storage
      }),
    ],
  })
  ```
</details>

## API Reference

### HTTP request

```
GET <api-route>/<insights-slug>/:id?/report
```

The URL segment for `api-route` is your Payload configured base API route (by default `/api`), `insights-slug` is the collection slug for the PageSpeed Insights collection (by default `pagespeed-insights`), and `:id?` is an optional parameter representing a PageSpeed Insights doc id.

### Query parameters

If a doc id is passed as a url segment, then the query parameters are overriden by the fields in the doc. To view available query parameters, see the [PageSpeed API Reference](https://developers.google.com/speed/docs/insights/rest/v5/pagespeedapi/runpagespeed#query-parameters).

#### Example HTTP request

If no doc id is provided, then the `url` query parameter is required.

```
GET /api/pagespeed-insights/report?url=https://payloadcms.com
```

#### Example HTTP request with doc id

```
GET /api/pagespeed-insights/68aa352d42f08695dd833412/report
```

### Response body

A successful request will return:

| Parameter | Type                                        | Description                                                                                               |
| :---      | :---                                        | :---                                                                                                      |
| `report`  | `PageSpeedReportObject \| string \| number` | The pagespeed report. This will be a document id if the insights document already has a report generated. |
| `message` | `string`                                    | A message containing the status message of the operation.                                                 |

## Contributing

Contributions are welcome!  

If you’d like to improve this plugin, feel free to open an issue or PR.

## License

[MIT](./LICENSE) © 2025 [saikhon.dev](https://saikhon.dev)
