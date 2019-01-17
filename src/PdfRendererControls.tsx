import React, { Fragment, SFC } from 'react';
import ZoomSelectBox from './ZoomSelectBox';
import './PdfRendererControls.scss';
import { I18nContext } from './I18nContext';

type Props = {
  autoZoom?: boolean;
  downloadBtn?: boolean;
  onDownload: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onRotateRight: () => void;
  onRotateLeft: () => void;
  scale: number;
  setScale: (scale: number) => void;
};

const PdfControls: SFC<Props> = ({
  autoZoom,
  downloadBtn,
  onDownload,
  onZoomIn,
  onZoomOut,
  onRotateRight,
  onRotateLeft,
  scale,
  setScale,
}) => (
  <div className="renderer-controls">
    <div>
      <I18nContext.Consumer>
        {({ scaleDown, scaleUp }) => (
          <div className="button-group">
            <button
              className="renderer-controls-button"
              type="button"
              onClick={onZoomOut}
            >
              <span className="zoom-out-label">{scaleDown}</span>
            </button>
            <div className="split-button-seperator" />
            <button
              className="renderer-controls-button"
              type="button"
              onClick={onZoomIn}
            >
              <span className="zoom-in-label">{scaleUp}</span>
            </button>
          </div>
        )}
      </I18nContext.Consumer>
      <ZoomSelectBox autoZoom={autoZoom} scale={scale} setScale={setScale} />
      <I18nContext.Consumer>
        {({ scaleDown, scaleUp, download }) => (
          <Fragment>
            <div className="button-group">
              <button
                className="renderer-controls-button"
                type="button"
                onClick={onRotateLeft}
              >
                <span className="rotate-left-label">{scaleDown}</span>
              </button>
              <div className="split-button-seperator" />
              <button
                className="renderer-controls-button"
                type="button"
                onClick={onRotateRight}
              >
                <span className="rotate-right-label">{scaleUp}</span>
              </button>
            </div>
            {downloadBtn && (
              <div className="button-group">
                <button
                  className="renderer-controls-button"
                  type="button"
                  onClick={onDownload}
                >
                  <span className="download-label">{download}</span>
                </button>
              </div>
            )}
          </Fragment>
        )}
      </I18nContext.Consumer>
    </div>
  </div>
);

export default PdfControls;
