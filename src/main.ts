import { DocumentScanner } from "./document-scanner";
import { OpenCVDocumentDetectHandler } from "./dynamsoft-document-viewer-handler";

(window as any)["DocumentScanner"] = DocumentScanner;
(window as any)["OpenCVDocumentDetectHandler"] = OpenCVDocumentDetectHandler;