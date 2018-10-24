import React, { PureComponent } from 'react';
import { PdfMultiViewer } from 'react-pdfjs-multi';
import 'react-pdfjs-multi/dist/react-pdfjs-multi.css';

const pdfFiles = [
  'pdfs/test-pdf-a.pdf',
  {
    title: 'Trace-based Just-in-Time Type Specialization for DynamicLanguages',
    source: 'pdfs/compressed.tracemonkey-pldi-09.pdf',
  },
  'pdfs/test-pdf-b.pdf',
  'pdfs/test-pdf-c.pdf',
];

class MultiViewerExample extends PureComponent {
  render() {
    return <PdfMultiViewer pdfs={pdfFiles} />;
  }
}

export default MultiViewerExample;
