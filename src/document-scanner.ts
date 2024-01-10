export interface Point {
  x: number;
  y: number;
}

export class DocumentScanner {
  private cv:any;
  constructor() {
    if (!("cv" in window)) {
      throw new Error("OpenCV not found");
    }else{
      this.cv = window["cv"];
    }
  }

  detect(source:HTMLImageElement|HTMLCanvasElement):Point[]{
    let cv = this.cv;
    const img = cv.imread(source);
    const gray = new cv.Mat();
    cv.cvtColor(img, gray, cv.COLOR_RGBA2GRAY);
    const blur = new cv.Mat();
    cv.GaussianBlur(gray,blur,new cv.Size(5, 5),0,0,cv.BORDER_DEFAULT);
    const thresh = new cv.Mat();
    cv.threshold(blur,thresh,0,255,cv.THRESH_BINARY + cv.THRESH_OTSU);
    let contours = new cv.MatVector();
    let hierarchy = new cv.Mat();

    cv.findContours(thresh,contours,hierarchy,cv.RETR_CCOMP,
      cv.CHAIN_APPROX_SIMPLE);

    let maxArea = 0;
    let maxContourIndex = -1;
    for (let i = 0; i < contours.size(); ++i) {
      let contourArea = cv.contourArea(contours.get(i));
      if (contourArea > maxArea) {
        maxArea = contourArea;
        maxContourIndex = i;
      }
    }

    const maxContour = contours.get(maxContourIndex);
    const points = this.getCornerPoints(maxContour)
    img.delete();
    gray.delete();
    blur.delete();
    thresh.delete();
    contours.delete();
    hierarchy.delete();
    return points;
  }

  crop(source:HTMLImageElement|HTMLCanvasElement,points?:Point[],width?:number,height?:number):HTMLCanvasElement{
    const cv = this.cv;
    const canvas = document.createElement("canvas");
    const img = cv.imread(source);
    if (!points) {
      points = this.detect(source);
    }
    let warpedDst = new cv.Mat();
    if (!width) {
      width = Math.max(this.distance(points[0],points[1]),this.distance(points[2],points[3]));
    }
    if (!height) {
      height = Math.max(this.distance(points[0],points[3]),this.distance(points[1],points[2]));
    }
    let dsize = new cv.Size(width, height);
    let srcTri = cv.matFromArray(4, 1, cv.CV_32FC2, [
      points[0].x,
      points[0].y,
      points[1].x,
      points[1].y,
      points[3].x,
      points[3].y,
      points[2].x,
      points[2].y,
    ]);

    let dstTri = cv.matFromArray(4, 1, cv.CV_32FC2, [
      0,
      0,
      width,
      0,
      0,
      height,
      width,
      height,
    ]);

    let M = cv.getPerspectiveTransform(srcTri, dstTri);
    cv.warpPerspective(img,warpedDst,M,dsize,cv.INTER_LINEAR,
      cv.BORDER_CONSTANT,
      new cv.Scalar()
    );

    cv.imshow(canvas, warpedDst);
    img.delete()
    warpedDst.delete()
    return canvas;
  }

  distance(p1:Point, p2:Point) {
    return Math.hypot(p1.x - p2.x, p1.y - p2.y);
  }

  getCornerPoints(contour:any):Point[] {
    let cv = this.cv;
    let points:Point[] = [];
    let rect = cv.minAreaRect(contour);
    const center = rect.center;

    let topLeftPoint;
    let topLeftDistance = 0;

    let topRightPoint;
    let topRightDistance = 0;

    let bottomLeftPoint;
    let bottomLeftDistance = 0;

    let bottomRightPoint;
    let bottomRightDistance = 0;

    for (let i = 0; i < contour.data32S.length; i += 2) {
      const point = { x: contour.data32S[i], y: contour.data32S[i + 1] };
      const distance = this.distance(point, center);
      if (point.x < center.x && point.y < center.y) {
        if (distance > topLeftDistance) {
          topLeftPoint = point;
          topLeftDistance = distance;
        }
      } else if (point.x > center.x && point.y < center.y) {
        if (distance > topRightDistance) {
          topRightPoint = point;
          topRightDistance = distance;
        }
      } else if (point.x < center.x && point.y > center.y) {
        if (distance > bottomLeftDistance) {
          bottomLeftPoint = point;
          bottomLeftDistance = distance;
        }
      } else if (point.x > center.x && point.y > center.y) {
        if (distance > bottomRightDistance) {
          bottomRightPoint = point;
          bottomRightDistance = distance;
        }
      }
    }
    points.push(topLeftPoint as Point);
    points.push(topRightPoint as Point);
    points.push(bottomRightPoint as Point);
    points.push(bottomLeftPoint as Point);
    return points;
  }
}