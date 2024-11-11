# medusajs-uploadthing
A module to upload files to Uploadthing from Medusa.js V2

# Installation
- Install Uploadthing in your project `npm install uploadthing` (I use v7)
- Make a folder inside `src/modules` (Eg: `src/modules/uploadthing`)
- Copy `index.ts` and `service.ts` into that folder
- Go to Uploadthing's dashboard and copy the token into `.env` file
- Update `medusa-config.ts` with the new file module
    ```ts
      module.exports = defineConfig({
        modules: [
            {
                resolve: '@medusajs/file',
                options: {
                    providers: [
                        {
                            resolve: './src/modules/uploadthing',
                            id: 'uploadthing',
                            options: {
                                apiKey: process.env.UPLOADTHING_TOKEN,
                            },
                        },
                    ],
                },
            },
        ],
      });
    ```
