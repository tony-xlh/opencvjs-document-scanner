# opencvjs-document-scanner

A document scanner implemented with opencv.js. It can detect the boundaries of documents and apply perspective transformation to get a deskewed image.

[Online demo](https://ornate-unicorn-65848b.netlify.app/)

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
   const imgElement = document.getElementById("photoRaw")
   const points = documentScanner.detect(imgElement); //detect from an img or canvas element
   ```
   
3. Get the cropped document image.
   
   ```js
   let imgElement = document.getElementById("photoRaw")
   const canvas = documentScanner.crop(imgElement); //get cropped image from an img or canvas element
   ```
   
4. Live scanning with camera using [Dynamsoft Document Viewer](https://www.dynamsoft.com/document-viewer/docs/introduction/index.html).
   
   ```html
   <script type="module">
     import { DocumentScanner } from 'https://cdn.jsdelivr.net/npm/opencv-document-scanner/dist/opencv-document-scanner.js';
     const documentScanner = new DocumentScanner();
     const detectHandler = new OpenCVDocumentDetectHandler(documentScanner);
     Dynamsoft.DDV.setProcessingHandler("documentBoundariesDetect", detectHandler);
   </script>
   ```

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


