
import { DDV } from 'dynamsoft-document-viewer';
import { DocumentScanner, setDDV, OpenCVDocumentDetectHandler } from 'opencv-document-scanner';

(window as any)["DocumentScanner"] = DocumentScanner;
(window as any)["Dynamsoft"] = {"DDV":DDV};
(window as any)["OpenCVDocumentDetectHandler"] = OpenCVDocumentDetectHandler;
setDDV(DDV);
