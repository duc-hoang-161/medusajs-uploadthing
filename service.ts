import { AbstractFileProviderService } from '@medusajs/framework/utils';
import { Logger } from '@medusajs/medusa';
import { ProviderGetFileDTO } from '@medusajs/types';
import { ProviderDeleteFileDTO } from '@medusajs/types';
import { ProviderUploadFileDTO, ProviderFileResultDTO } from '@medusajs/types';
import { UTApi } from 'uploadthing/server';
type InjectedDependencies = {
    logger: Logger;
};

type Options = {
    apiKey: string;
};
class UploadThingProviderService extends AbstractFileProviderService {
    protected logger_: Logger;
    protected options_: Options;
    static identifier = 'uploadthing';
    protected client: UTApi;
    constructor({ logger }: InjectedDependencies, options: Options) {
        super();
        this.logger_ = logger;
        this.options_ = options;
        this.client = new UTApi({ token: this.options_.apiKey });
    }
    private binaryStringToUint8Array(binaryString) {
        const len = binaryString.length;
        const arrayBuffer = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            arrayBuffer[i] = binaryString.charCodeAt(i);
        }
        return arrayBuffer;
    }
    async upload(file: ProviderUploadFileDTO): Promise<ProviderFileResultDTO> {
        const response = await this.client.uploadFiles([
            new File(
                [this.binaryStringToUint8Array(file.content)],
                file.filename,
                {
                    type: file.mimeType,
                }
            ),
        ]);
        if (response[0].error) {
            throw new Error(response[0].error.message);
        }
        return Promise.resolve({
            url: response[0].data.url,
            key: response[0].data.key,
        });
    }

    async delete(file: ProviderDeleteFileDTO): Promise<void> {
        const response = await this.client.deleteFiles([file.fileKey]);
        if (response.deletedCount === 0) {
            throw new Error(`File with key ${file.fileKey} not found`);
        }
        return Promise.resolve();
    }

    async getPresignedDownloadUrl(
        fileData: ProviderGetFileDTO
    ): Promise<string> {
        const response = await this.client.getSignedURL(fileData.fileKey, {
            expiresIn: 60 * 60,
        });
        return response.url;
    }
}

export default UploadThingProviderService;
