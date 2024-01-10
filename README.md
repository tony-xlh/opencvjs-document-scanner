# opencvjs-document-scanner

A document scanner implemented with opencv.js. It can detect the boundaries of documents and apply perspective transformation to get a deskewed image.

[Online demo](https://ornate-unicorn-65848b.netlify.app/)

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

## Usage

1. Initialize an instance.

   ```js
   const documentScanner = new DocumentScanner();
   ```
   
2. Detect the polygon of documents and return the points.

   ```js
   let imgElement = document.getElementById("photoRaw")
   documentScanner.detect(imgElement); //detect from an img or canvas element
   ```
   
3. Get the cropped document image.
   
   ```js
   let imgElement = document.getElementById("photoRaw")
   documentScanner.crop(imgElement); //get cropped image from an img or canvas element
   ```
   
4. Live scanning with camera using [Dynamsoft Document Viewer](https://www.dynamsoft.com/document-viewer/docs/introduction/index.html).
   
   ```js
   <script type="module">
   import { DocumentScanner } from 'https://cdn.jsdelivr.net/npm/opencv-document-scanner/dist/opencv-document-scanner.js';
   const documentScanner = new DocumentScanner();
   const detectHandler = new OpenCVDocumentDetectHandler(documentScanner);
   Dynamsoft.DDV.setProcessingHandler("documentBoundariesDetect", detectHandler);
   </script>
   ```

5. Edit the polygon with Dynamsoft Document Viewer.

   ```js
   const points = documentScanner.detect(imgElement);
   const quad = [];
   points.forEach(point => {
     quad.push([point.x,point.y]);
   });
   perspectiveViewer.setQuadSelection(quad);
   ```

