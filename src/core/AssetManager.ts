export class AssetManager {
    private images: Record<string, HTMLImageElement> = {};

    public async loadImage(key: string, src: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                this.images[key] = img;
                resolve();
            };
            img.onerror = () => {
                reject(new Error(`Failed to load image: ${src}`));
            };
            img.src = src;
        });
    }

    public getImage(key: string): HTMLImageElement {
        if (!this.images[key]) {
            throw new Error(`Image not found for key: ${key}`);
        }
        return this.images[key];
    }
}
