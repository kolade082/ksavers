declare module 'react-native-pdf' {
  interface PDFDocument {
    getPageCount(): number;
    getPage(pageNumber: number): Promise<PDFPage>;
  }

  interface PDFPage {
    getTextContent(): Promise<{
      items: Array<{
        str: string;
        transform: number[];
        width: number;
        height: number;
        dir: string;
      }>;
      styles: Record<string, any>;
    }>;
  }

  interface PDFDocumentStatic {
    getDocument(source: string): {
      promise: Promise<PDFDocument>;
    };
  }

  const Pdf: PDFDocumentStatic;
  export default Pdf;
} 