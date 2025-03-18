declare module 'react-native-pdf-lib' {
  export class PDFDocument {
    static load(data: Uint8Array): Promise<PDFDocument>;
    getPageCount(): number;
    getPage(index: number): PDFPage;
  }

  export class PDFPage {
    getText(): string;
    getSize(): { width: number; height: number };
  }
} 