import { DocumentScanner } from ".";

// Inherit DocumentDetect class
const Dynamsoft = (window as any)["Dynamsoft"];
export class OpenCVDocumentDetectHandler extends Dynamsoft.DDV.DocumentDetect {
  private documentScanner:DocumentScanner;
  constructor(documentScanner:DocumentScanner){
    super();
    this.documentScanner = documentScanner;
  }
  // Rewrite the detect method
  async detect(image:any, detectConfig:any) {
    const quad:any[] = [];
    try {
      const width = image.width;
      const height = image.height;
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext('2d');
      if (context) {
        const imageData = context.createImageData(width, height);
        var pixelData = imageData.data;
        var inputArrayBuffer = image.data;
        var inputUint8Array = new Uint8Array(inputArrayBuffer);
        pixelData.set(inputUint8Array);
        context.putImageData(imageData, 0, 0);
        const points = this.documentScanner.detect(canvas as any);
        points.forEach(p => {
          quad.push([p.x, p.y]);
        });
      }
    } catch (error) {
      console.log(error);
      quad.push([0, 0]);
      quad.push([0, 0]);
      quad.push([0, 0]);
      quad.push([0, 0]);
    }
    const result:any = {
      location: quad,
      width: image.width,
      height: image.height,
      config: detectConfig,
    };
    const ret = this.processDetectResult(result);
    return Promise.resolve(ret);
  }
}
