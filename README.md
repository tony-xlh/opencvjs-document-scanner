# opencvjs-document-scanner

![version](https://img.shields.io/npm/v/opencv-document-scanner.svg)
![downloads](https://img.shields.io/npm/dm/opencv-document-scanner.svg)
![jsdelivr](https://img.shields.io/jsdelivr/npm/hm/opencv-document-scanner.svg)

A document scanner implemented with opencv.js. It can detect the boundaries of documents and apply perspective transformation to get a deskewed image.

[Online demo](https://tony-xlh.github.io/opencvjs-document-scanner/example/vanilla.html)

[Demo video](https://github.com/tony-xlh/opencvjs-document-scanner/assets/5462205/0f1748fc-1e19-462f-9928-c9efde0863ad)

Example:

![example](https://github.com/tony-xlh/opencvjs-document-scanner/assets/5462205/dba83ab0-75bd-4685-a462-ef61fb21629d)

## Installation

Via NPM:

```bash
npm install opencv-document-scanner
```

Via CDN:

```html
<script type="module">
  import { DocumentScanner } from 'https://cdn.jsdelivr.net/npm/opencv-document-scanner/dist/opencv-document-scanner.js';
</script>
```

You also need to include OpenCV:

```html
<script type="text/javascript">
  var Module = {
    // https://emscripten.org/docs/api_reference/module.html#Module.onRuntimeInitialized
    onRuntimeInitialized() {
      document.getElementById('status').innerHTML = 'OpenCV.js is ready.';
    }
  };
</script>
<script async src="https://docs.opencv.org/4.8.0/opencv.js" type="text/javascript"></script>
```

## Usage

1. Initialize an instance.

   ```js
   const documentScanner = new DocumentScanner();
   ```
   
2. Detect the polygon of documents and return the points.

   ```js
   const imgElement = document.getElementById("photoRaw");
   const points = documentScanner.detect(imgElement, {useCanny:false}); //detect from an img or canvas element. You can use canny edge detection to detect document with uneven lightings. If the contrast of the background and the document is vivid, then you don't need to enable this.
   ```
   
3. Get the cropped document image.
   
   ```js
   let imgElement = document.getElementById("photoRaw")
   const canvas = documentScanner.crop(imgElement); //get cropped image from an img or canvas element
   ```
   
4. Live scanning with camera using [Dynamsoft Document Viewer](https://www.dynamsoft.com/document-viewer/docs/introduction/index.html) (v5.0+).

   Since v5.0, camera capture lives in a plugin, so include and register the camera plugin before initializing the SDK:

   ```html
   <script src="https://cdn.jsdelivr.net/npm/dynamsoft-document-viewer@5.0.0/dist/ddv.js"></script>
   <script src="https://cdn.jsdelivr.net/npm/dynamsoft-document-viewer@5.0.0/dist/plugins/ddv-plugin-camera.js"></script>
   <script type="module">
     import { DocumentScanner, OpenCVDocumentDetectHandler } from 'https://cdn.jsdelivr.net/npm/opencv-document-scanner/dist/opencv-document-scanner.js';
     Dynamsoft.DDV.Core.engineResourcePath = "https://cdn.jsdelivr.net/npm/dynamsoft-document-viewer@5.0.0/dist/engine";
     Dynamsoft.DDV.use(Dynamsoft.DDV.CameraPlugin); // required for CaptureViewer and setProcessingHandler
     await Dynamsoft.DDV.Core.init();
     const documentScanner = new DocumentScanner();
     const detectHandler = new OpenCVDocumentDetectHandler(documentScanner);
     Dynamsoft.DDV.setProcessingHandler("documentBoundariesDetect", detectHandler);
   </script>
   ```

   > The camera plugin is required for `CaptureViewer` and `DDV.setProcessingHandler()`. Without it these APIs throw an error.

   ![image](https://github.com/tony-xlh/opencvjs-document-scanner/assets/5462205/3572db79-d98c-4012-b640-fef3b5cc83d0)


5. Edit the polygon with Dynamsoft Document Viewer.

   ```js
   const points = documentScanner.detect(imgElement);
   const quad = [];
   points.forEach(point => {
     quad.push([point.x,point.y]);
   });
   perspectiveViewer.setQuadSelection(quad);
   ```

   ![image](https://github.com/tony-xlh/opencvjs-document-scanner/assets/5462205/aad13adb-3c7e-45ae-81c3-2df5d283b4c5)

## Blog

[Web Document Scanner with OpenCV.js](https://www.dynamsoft.com/codepool/web-document-scanner-with-opencvjs.html)


