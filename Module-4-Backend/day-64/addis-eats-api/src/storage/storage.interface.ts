export interface StorageService {
    put(key: string, body: Buffer, contentType: string): Promise<void>;
    delete(key: string): Promise<void>;
    urlFor(key: string): string;
}