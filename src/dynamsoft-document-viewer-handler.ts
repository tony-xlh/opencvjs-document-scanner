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
      let width = image.width;
      let height = image.height;

      let ratio = 1;
      let data;
      const thresh = 720
      if (height > thresh) {
        ratio = height / thresh;
        height = thresh;
        width = Math.floor(width / ratio);
        data = this.compress(image.data, image.width, image.height, width, height);
      } else {
        data = image.data.slice(0);
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext('2d');
      if (context) {
        const imageData = context.createImageData(width, height);
        var pixelData = imageData.data;
        var inputArrayBuffer = data;
        var inputUint8Array = new Uint8Array(inputArrayBuffer);
        pixelData.set(inputUint8Array);
        context.putImageData(imageData, 0, 0);
        const points = this.documentScanner.detect(canvas);
        points.forEach(p => {
          quad.push([p.x * ratio, p.y * ratio]);
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

  compress(
    imageData:any,
    imageWidth:number,
    imageHeight:number,
    newWidth:number,
    newHeight:number,
  ) {
    let source:any = null;
    try {
      source = new Uint8ClampedArray(imageData);
    } catch (error) {
      source = new Uint8Array(imageData);
    }
  
    const scaleW = newWidth / imageWidth;
    const scaleH = newHeight / imageHeight;
    const targetSize = newWidth * newHeight * 4;
    const targetMemory = new ArrayBuffer(targetSize);
    let distData = null;
  
    try {
      distData = new Uint8ClampedArray(targetMemory, 0, targetSize);
    } catch (error) {
      distData = new Uint8Array(targetMemory, 0, targetSize);
    }
  
    const filter = (distCol:number, distRow:number) => {
      const srcCol = Math.min(imageWidth - 1, distCol / scaleW);
      const srcRow = Math.min(imageHeight - 1, distRow / scaleH);
      const intCol = Math.floor(srcCol);
      const intRow = Math.floor(srcRow);

      let distI = (distRow * newWidth) + distCol;
      let srcI = (intRow * imageWidth) + intCol;

      distI *= 4;
      srcI *= 4;

      for (let j = 0; j <= 3; j += 1) {
        distData[distI + j] = source[srcI + j];
      }
    };
  
    for (let col = 0; col < newWidth; col += 1) {
      for (let row = 0; row < newHeight; row += 1) {
        filter(col, row);
      }
    }
  
    return distData;
  }
}
