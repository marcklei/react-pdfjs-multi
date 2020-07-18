import React, { FC, useState, useEffect } from 'react';
import { PdfRenderer, PdfjsLib, PDFDocumentProxy } from 'react-pdfjs-multi';

PdfjsLib.GlobalWorkerOptions.workerSrc =
  '//cdnjs.cloudflare.com/ajax/libs/pdf.js/2.5.207/pdf.worker.js';

const RendererExample: FC = () => {
  const [pdfDoc, setPdfDoc] = useState<PDFDocumentProxy>();

  useEffect(() => {
    const getPdfDoc = async () => {
      const doc = await PdfjsLib.getDocument({
        url: 'pdfs/compressed.tracemonkey-pldi-09.pdf',
      }).promise;

      setPdfDoc(doc);
    };

    getPdfDoc();
  }, []);

  if (!pdfDoc) return null;

  return <PdfRenderer pdfDoc={pdfDoc} downloadBtn={false} />;
};

export default RendererExample;
