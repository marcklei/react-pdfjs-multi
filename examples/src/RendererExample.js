import React, { PureComponent } from 'react';
import { PdfRenderer, PdfjsLib } from 'react-pdfjs-multi';
import 'react-pdfjs-multi/dist/react-pdfjs-multi.css';

PdfjsLib.GlobalWorkerOptions.workerSrc =
  '//cdnjs.cloudflare.com/ajax/libs/pdf.js/2.0.943/pdf.worker.js';

class RendererExample extends PureComponent {
  state = {
    pdfDoc: null,
  };

  async componentDidMount() {
    const pdfDoc = await PdfjsLib.getDocument({
      url: 'pdfs/compressed.tracemonkey-pldi-09.pdf',
    });

    this.setState(() => ({ pdfDoc }));
  }

  render() {
    const { pdfDoc } = this.state;

    if (!pdfDoc) return false;

    return <PdfRenderer pdfDoc={pdfDoc} downloadBtn={false} />;
  }
}

export default RendererExample;
