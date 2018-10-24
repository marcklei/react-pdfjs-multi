import React, { PureComponent } from 'react';
import { PDFDocumentProxy } from 'pdfjs-dist';
import PdfRenderer from './PdfRenderer';
import './PdfMultiViewer.scss';

const PdfjsLib = require('pdfjs-dist/build/pdf');

const initialState = {
  files: [],
  activeIndex: 0,
};

type PdfDefinition = {
  title: string;
  source: string;
};
type PdfSource = string | PdfDefinition;
type PdfFile = {
  title?: string;
  source: string;
  pdfProxy: PDFDocumentProxy | null;
};
type State = {
  files: PdfFile[];
  activeIndex: number;
};
type Props = {
  pdfs: PdfSource[];
} & Partial<DefaultProps>;
type DefaultProps = {
  autoZoom?: boolean;
  controls?: boolean;
  startIndex?: number;
};

export default class PdfMultiViewer extends PureComponent<Props, {}> {
  state: State = initialState;
  worker: any;

  static defaultProps: DefaultProps = {
    autoZoom: true,
    controls: true,
    startIndex: 0,
  };

  constructor(props: Props) {
    super(props);

    PdfjsLib.GlobalWorkerOptions.workerSrc =
      '//cdnjs.cloudflare.com/ajax/libs/pdf.js/2.0.489/pdf.worker.js';

    this.worker = new PdfjsLib.PDFWorker('pdf-viewer');

    this.state.activeIndex = props.startIndex as number;

    this.state.files = this.props.pdfs.map(
      (pdf): PdfFile => {
        return typeof pdf === 'object'
          ? { ...pdf, pdfProxy: null }
          : {
              source: pdf,
              pdfProxy: null,
            };
      },
    );
  }

  loadPdfDocuments() {
    this.state.files.forEach(async (file, index) => {
      const pdfDoc = await PdfjsLib.getDocument({
        url: file.source,
        worker: this.worker,
      });

      this.setState((state: State) => ({
        files: state.files.map((pdfFile, pdfIndex) => {
          if (pdfIndex !== index) return pdfFile;

          return {
            ...pdfFile,
            pdfProxy: pdfDoc,
          };
        }),
      }));
    });
  }

  changePdf = (activeIndex: number, file: PdfFile) => () => {
    if (!file.pdfProxy) return;

    this.setState(() => ({ activeIndex }));
  };

  renderListItems() {
    const { activeIndex } = this.state;

    return this.state.files.map((file, index) => (
      <li
        className={`pdf-viewer-list-item${file.pdfProxy ? ' loaded' : ''}${
          activeIndex === index ? ' active' : ''
        }`}
        key={file.source}
        onClick={this.changePdf(index, file)}
      >
        {file.title || file.source}
        {file.pdfProxy && (
          <div className="pdf-viewer-list-item-meta">
            Seiten: {file.pdfProxy.numPages}
          </div>
        )}
      </li>
    ));
  }

  componentDidMount() {
    this.loadPdfDocuments();
  }

  componentWillUnmount() {
    this.worker.destroy();
  }

  render() {
    const { activeIndex, files } = this.state;
    const pdfToShow = files[activeIndex];
    const { autoZoom, controls } = this.props;

    return (
      <div className="pdf-multi-viewer">
        <ul className="pdf-viewer-list">{this.renderListItems()}</ul>
        <div className="pdf-viewer-multi-renderer">
          {pdfToShow.pdfProxy && (
            <PdfRenderer
              autoZoom={autoZoom}
              controls={controls}
              pdfDoc={pdfToShow.pdfProxy}
            />
          )}
        </div>
      </div>
    );
  }
}
