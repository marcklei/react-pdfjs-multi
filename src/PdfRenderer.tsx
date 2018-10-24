import React, { PureComponent, RefObject } from 'react';
import { PDFDocumentProxy } from 'pdfjs-dist';
import PdfRendererControls from './PdfRendererControls';
import 'pdfjs-dist/web/pdf_viewer.css';
import './PdfRenderer.scss';

const roundToNearest = (numToRound: number, numToRoundTo: number) =>
  Math.round(numToRound / numToRoundTo) * numToRoundTo;

const { PDFViewer } = require('pdfjs-dist/web/pdf_viewer');
const initialState = {
  scale: 100,
  isLoading: true,
  firstPageWidth: 0,
};

type State = typeof initialState;
type Props = {
  pdfDoc: PDFDocumentProxy;
} & Partial<DefaultProps>;
type DefaultProps = {
  autoZoom?: boolean;
  controls?: boolean;
};
export default class PdfRenderer extends PureComponent<Props, {}> {
  state: State = initialState;
  container: RefObject<HTMLDivElement>;
  pdfViewer: any;

  static defaultProps: DefaultProps = {
    autoZoom: true,
    controls: true,
  };

  constructor(props: Props) {
    super(props);
    this.container = React.createRef();
    this.pdfViewer = null;
  }

  async componentDidMount() {
    const { autoZoom, pdfDoc } = this.props;

    this.pdfViewer = new PDFViewer({
      container: this.container.current,
    });

    this.pdfViewer.setDocument(pdfDoc);

    if (autoZoom) {
      window.addEventListener('resizeAutoZoom', this.autoFitScale);
      this.reScale();
    }
    this.setState(() => ({ isLoading: false }));
  }

  componentDidUpdate(prevProps: Props) {
    const { pdfDoc } = this.props;
    if (pdfDoc !== prevProps.pdfDoc) {
      this.pdfViewer.setDocument(pdfDoc);
      this.reScale();
    }
  }

  componentWillUnmount() {
    if (this.props.autoZoom) {
      window.removeEventListener('resizeAutoZoom', this.autoFitScale);
    }
  }

  autoFitScale = async () => {
    const firstPageWith = this.pdfViewer._pages[0].viewport.width;
    const currentScale = this.pdfViewer._pages[0].scale;
    const originalWidth = firstPageWith / currentScale;
    let containerWidth =
      this.container.current && this.container.current.offsetWidth < 1020
        ? this.container.current.offsetWidth - 56
        : 1019;
    let nextScale = -1;

    if (this.container.current) {
      nextScale = containerWidth / originalWidth;
    }

    this.setScale(nextScale * 100);
  };

  async reScale() {
    await this.pdfViewer.firstPagePromise;
    await this.autoFitScale();
  }

  setScale = (scale: number) => {
    const { autoZoom } = this.props;
    if (autoZoom && scale < 0) {
      this.autoFitScale();
      return;
    }

    this.setState(() => ({ scale }));
    this.pdfViewer.currentScaleValue = scale / 100;
  };

  zoomIn = () => {
    let { scale } = this.state;
    scale = roundToNearest(scale, 10);
    let newScale;

    if (scale >= 110 && scale < 990) {
      newScale = scale + 20;
    } else if (scale === 75 || scale === 125) {
      newScale = scale + 5;
    } else {
      newScale = scale + 10;
    }

    if (newScale > 1000) return;

    this.setScale(newScale);
  };

  zoomOut = () => {
    let { scale } = this.state;
    scale = roundToNearest(scale, 10);
    let newScale;

    if (scale > 110 && scale !== 125) {
      newScale = scale - 20;
    } else if (scale === 75 || scale === 125) {
      newScale = scale - 5;
    } else {
      newScale = scale - 10;
    }

    if (newScale <= 0) return;

    this.setScale(newScale);
  };

  render() {
    const { isLoading, scale } = this.state;
    const { autoZoom, controls } = this.props;

    return (
      <div className="renderer-container">
        {controls && (
          <PdfRendererControls
            autoZoom={autoZoom}
            scale={scale}
            setScale={this.setScale}
            onZoomIn={this.zoomIn}
            onZoomOut={this.zoomOut}
          />
        )}
        <div
          ref={this.container}
          className={`renderer-target-container ${
            !controls ? 'no-controls' : ''
          } `}
        >
          <div
            id="viewer"
            className={`pdfViewer ${isLoading ? 'hidden' : ''}`}
          />
        </div>
      </div>
    );
  }
}
