import React, { PureComponent, RefObject } from 'react';
import { PDFDocumentProxy } from 'pdfjs-dist';
import PdfRenderer from './PdfRenderer';
import './PdfMultiViewer.scss';

const PdfjsLib = require('pdfjs-dist/build/pdf');

const initialState = {
  files: [],
  activeIndex: 0,
  listVisible: true,
  overlayMode: false,
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
  listVisible: boolean;
  overlayMode: boolean;
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
  viewerContainer: RefObject<HTMLDivElement>;

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

    this.viewerContainer = React.createRef();

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
    const { overlayMode, listVisible } = this.state;
    if (!file.pdfProxy) return;

    this.setState(() => ({ activeIndex }));

    if (overlayMode && listVisible) this.toggleList();
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

  toggleList = () =>
    this.setState((state: State) => ({ listVisible: !state.listVisible }));

  setOverlayMode = () => {
    const containerWidth =
      this.viewerContainer.current && this.viewerContainer.current.offsetWidth;
    const { overlayMode } = this.state;

    if (
      containerWidth &&
      containerWidth >= 330 &&
      containerWidth <= 667 &&
      !overlayMode
    ) {
      this.setState(() => ({ overlayMode: true }));
    } else if (overlayMode && containerWidth && containerWidth > 667) {
      this.setState(() => ({ overlayMode: false }));
    }
  };

  componentDidMount() {
    window.addEventListener('resizeAutoZoom', this.setOverlayMode);
    this.setOverlayMode();
    this.loadPdfDocuments();
  }

  componentWillUnmount() {
    window.removeEventListener('resizeAutoZoom', this.setOverlayMode);
    this.worker.destroy();
  }

  render() {
    const { activeIndex, files, listVisible, overlayMode } = this.state;
    const pdfToShow = files[activeIndex];
    const { autoZoom, controls } = this.props;

    return (
      <div className="pdf-multi-viewer" ref={this.viewerContainer}>
        <div className="pdf-multi-viewer-option-bar">
          <button
            className={`viewer-controls-button${listVisible ? ' toggled' : ''}`}
            onClick={this.toggleList}
          >
            <span className="toggle-list-label">Toggle list</span>
          </button>
        </div>
        <ul
          className={`pdf-viewer-list${!listVisible ? ' hidden' : ''}${
            overlayMode ? ' overlay' : ''
          }`}
        >
          {this.renderListItems()}
        </ul>
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
