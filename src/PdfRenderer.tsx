import React, { PureComponent, RefObject } from 'react';
import { PDFDocumentProxy } from 'pdfjs-dist';
import PdfRendererControls from './PdfRendererControls';
import 'pdfjs-dist/web/pdf_viewer.css';
import './PdfRenderer.scss';
import { I18nDataRenderer, defaultI18n, I18nContext } from './I18nContext';

const roundToNearest = (numToRound: number, numToRoundTo: number) =>
  Math.round(numToRound / numToRoundTo) * numToRoundTo;

const { PDFViewer } = require('pdfjs-dist/web/pdf_viewer');
const initialState = {
  scale: 100,
  isLoading: true,
  firstPageWidth: 0,
};

type State = typeof initialState;

export type RendererDocumentPosition = {
  zoom: number;
  scrollTop: number | null;
  scrollLeft?: number | null;
};

type PdfChangeHook = (
  documentIndex: number,
  position: RendererDocumentPosition,
) => void;

type Props = {
  pdfDoc: PDFDocumentProxy;
} & Partial<DefaultProps>;

type DefaultProps = {
  activeIndex?: number;
  autoZoom?: boolean;
  controls?: boolean;
  i18nData?: I18nDataRenderer;
  pdfChangeHook?: PdfChangeHook | null;
  zoom?: number;
  scrollTop?: number;
  scrollLeft?: number;
};
export default class PdfRenderer extends PureComponent<Props, {}> {
  state: State = initialState;
  container: RefObject<HTMLDivElement>;
  pdfViewer: any;

  static defaultProps: DefaultProps = {
    activeIndex: 0,
    autoZoom: true,
    controls: true,
    i18nData: defaultI18n,
    pdfChangeHook: null,
    scrollTop: 0,
    scrollLeft: 0,
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
    }

    this.rePosition();

    this.setState(() => ({ isLoading: false }));
  }

  componentDidUpdate(prevProps: Props) {
    const { pdfDoc, pdfChangeHook } = this.props;

    if (pdfDoc !== prevProps.pdfDoc) {
      if (typeof pdfChangeHook === 'function') {
        pdfChangeHook(prevProps.activeIndex as number, {
          zoom: this.state.scale,
          scrollTop: this.container.current && this.container.current.scrollTop,
          scrollLeft:
            this.container.current && this.container.current.scrollLeft,
        });
      }

      this.pdfViewer.setDocument(pdfDoc);
      this.rePosition();
    }
  }

  componentWillUnmount() {
    if (this.props.autoZoom) {
      window.removeEventListener('resizeAutoZoom', this.autoFitScale);
    }
  }

  autoFitScale = () => {
    const firstPageWith = this.pdfViewer._pages[0].viewport.width;
    const currentScale = this.pdfViewer._pages[0].scale;
    const originalWidth = firstPageWith / currentScale;
    let containerWidth =
      this.container.current && this.container.current.offsetWidth < 1020
        ? this.container.current.offsetWidth - 56
        : 1019;
    let nextScale = -1;

    if (this.container.current) {
      nextScale = Math.abs(containerWidth) / originalWidth;
    }
    this.setScale(nextScale * 100);
  };

  async rePosition() {
    const { autoZoom, zoom, scrollTop, scrollLeft } = this.props;
    await this.pdfViewer.firstPagePromise;

    if (zoom) {
      this.setScale(zoom);
    } else if (!zoom && autoZoom) {
      this.autoFitScale();
    }

    if (typeof scrollTop !== 'undefined') {
      this.setScrollTop(scrollTop);
    }

    if (typeof scrollLeft !== 'undefined') {
      this.setScrollLeft(scrollLeft);
    }
  }

  setScrollTop(scrollTop: number) {
    if (this.container.current) {
      this.container.current.scrollTop = scrollTop;
    }
  }

  setScrollLeft(scrollLeft: number) {
    if (this.container.current) {
      this.container.current.scrollLeft = scrollLeft;
    }
  }

  setScale = (scale: number) => {
    const { autoZoom } = this.props;
    if (autoZoom && scale < 0) {
      this.autoFitScale();
      return;
    }

    const nextScale = scale >= 10 ? scale : 10;

    this.setState(() => ({ scale: nextScale }));
    this.pdfViewer.currentScaleValue = nextScale / 100;
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
    scale = scale === 125 ? scale : roundToNearest(scale, 10);
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
    const { autoZoom, controls, i18nData } = this.props;

    return (
      <div className="renderer-container">
        {controls && (
          <I18nContext.Provider value={{ ...defaultI18n, ...i18nData! }}>
            <PdfRendererControls
              autoZoom={autoZoom}
              scale={scale}
              setScale={this.setScale}
              onZoomIn={this.zoomIn}
              onZoomOut={this.zoomOut}
            />
          </I18nContext.Provider>
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
