import React, { FC } from 'react';
import { PdfMultiViewer } from 'react-pdfjs-multi';
import 'react-pdfjs-multi/dist/react-pdfjs-multi.css';

const MultiViewerExample: FC = () => {
  const pdfFiles = [
    'pdfs/test-pdf-a.pdf',
    {
      title:
        'Trace-based Just-in-Time Type Specialization for DynamicLanguages',
      source: 'pdfs/compressed.tracemonkey-pldi-09.pdf',
    },
    'pdfs/test-pdf-b.pdf',
    'pdfs/test-pdf-c.pdf',
  ];

  return (
    <PdfMultiViewer
      pdfs={pdfFiles}
      i18nData={{
        download: 'Herunterladen',
        scaleDown: 'Verkleinern',
        scaleUp: 'Vergrößern',
        originalSize: 'Originalgröße',
        pages: 'Seiten',
        zoom: 'Automatischer Zoom',
      }}
    />
  );
};

export default MultiViewerExample;
