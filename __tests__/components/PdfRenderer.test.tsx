import React from 'react';
import { mount } from 'enzyme';
import { PDFDocumentProxy } from 'pdfjs-dist';
import { PdfRenderer } from '../../src';
import PdfRendererControls from '../../src/PdfRendererControls';

const { PDFViewer } = require('pdfjs-dist/web/pdf_viewer');
jest.genMockFromModule('pdfjs-dist/web/pdf_viewer');
jest.mock('pdfjs-dist/web/pdf_viewer');

const mockPdfViewer = {
  setDocument: jest.fn(),
  _pages: [
    {
      viewport: {
        width: 1020,
      },
      scale: 1,
    },
  ],
};

PDFViewer.mockImplementation(() => mockPdfViewer);

const proxyMock = { numPages: 1 } as PDFDocumentProxy;
const proxyMockAnother = { numPages: 2 } as PDFDocumentProxy;

describe('<PdfRenderer />', () => {
  it('should exist', () => {
    expect(PdfRenderer).toBeDefined();
  });

  it('renders the renderer-controls bar', () => {
    const wrapper = mount<PdfRenderer>(<PdfRenderer pdfDoc={proxyMock} />);
    expect(wrapper.find(PdfRendererControls).exists()).toBeTruthy();
  });

  it('does not render the renderer-controls bar', () => {
    const wrapper = mount<PdfRenderer>(
      <PdfRenderer pdfDoc={proxyMock} controls={false} />,
    );
    expect(wrapper.find(PdfRendererControls).exists()).toBeFalsy();
  });

  it('has the class no-controls when it does not render the renderer-controls bar', () => {
    const wrapper = mount<PdfRenderer>(
      <PdfRenderer pdfDoc={proxyMock} controls={false} />,
    );
    expect(
      wrapper.find('.renderer-target-container').hasClass('no-controls'),
    ).toBeTruthy();
  });

  it('calls reScale when autoZoom enabled', () => {
    const spy = jest.spyOn(PdfRenderer.prototype, 'reScale');
    mount<PdfRenderer>(<PdfRenderer pdfDoc={proxyMock} />);
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it('does not call reScale when autoZoom disabled', () => {
    const spy = jest.spyOn(PdfRenderer.prototype, 'reScale');
    mount<PdfRenderer>(<PdfRenderer pdfDoc={proxyMock} autoZoom={false} />);
    expect(spy).not.toBeCalled();
    spy.mockRestore();
  });

  it('zoomOut does not set negative scale state', () => {
    const wrapper = mount<PdfRenderer>(
      <PdfRenderer pdfDoc={proxyMock} autoZoom={false} />,
    );
    wrapper.setState({ scale: 10 });
    wrapper.instance().zoomOut();
    expect(wrapper.state().scale).toEqual(10);
  });

  it('zoomOut decrements scale state by 10', () => {
    const wrapper = mount<PdfRenderer>(
      <PdfRenderer pdfDoc={proxyMock} autoZoom={false} />,
    );
    wrapper.setState({ scale: 100 });
    wrapper.instance().zoomOut();
    expect(wrapper.state().scale).toEqual(90);
  });

  it('zoomOut decrements scale state by 20', () => {
    const wrapper = mount<PdfRenderer>(
      <PdfRenderer pdfDoc={proxyMock} autoZoom={false} />,
    );
    wrapper.setState({ scale: 150 });
    wrapper.instance().zoomOut();
    expect(wrapper.state().scale).toEqual(130);
  });

  it('zoomOut decrements scale state by 5', () => {
    const wrapper = mount<PdfRenderer>(
      <PdfRenderer pdfDoc={proxyMock} autoZoom={false} />,
    );
    wrapper.setState({ scale: 75 });
    wrapper.instance().zoomOut();
    expect(wrapper.state().scale).toEqual(70);
  });

  it('zoomIn does not set scale state above 1000', () => {
    const wrapper = mount<PdfRenderer>(
      <PdfRenderer pdfDoc={proxyMock} autoZoom={false} />,
    );
    wrapper.setState({ scale: 1000 });
    wrapper.instance().zoomIn();
    expect(wrapper.state().scale).toEqual(1000);
  });

  it('zoomIn increments scale state by 10', () => {
    const wrapper = mount<PdfRenderer>(
      <PdfRenderer pdfDoc={proxyMock} autoZoom={false} />,
    );
    wrapper.setState({ scale: 100 });
    wrapper.instance().zoomIn();
    expect(wrapper.state().scale).toEqual(110);
  });

  it('zoomIn increments scale state by 20', () => {
    const wrapper = mount<PdfRenderer>(
      <PdfRenderer pdfDoc={proxyMock} autoZoom={false} />,
    );
    wrapper.setState({ scale: 110 });
    wrapper.instance().zoomIn();
    expect(wrapper.state().scale).toEqual(130);
  });

  it('zoomIn increments scale state by 15', () => {
    const wrapper = mount<PdfRenderer>(
      <PdfRenderer pdfDoc={proxyMock} autoZoom={false} />,
    );
    wrapper.setState({ scale: 75 });
    wrapper.instance().zoomIn();
    expect(wrapper.state().scale).toEqual(90);
  });

  it('calls autoFitScale when setScale is call with a negativ scale', () => {
    const wrapper = mount<PdfRenderer>(<PdfRenderer pdfDoc={proxyMock} />);
    const spy = jest.spyOn(wrapper.instance(), 'autoFitScale');
    wrapper.instance().setScale(-1);
    expect(spy).toHaveBeenCalled();
  });

  it('calls setDocument on the pdfViewer when the pdfDoc changes', () => {
    const wrapper = mount<PdfRenderer>(<PdfRenderer pdfDoc={proxyMock} />);
    wrapper.setProps({ pdfDoc: proxyMockAnother });
    expect(wrapper.instance().pdfViewer.setDocument).toHaveBeenCalled();
  });

  it('calls reScale on the pdfViewer when the pdfDoc changes', () => {
    const wrapper = mount<PdfRenderer>(<PdfRenderer pdfDoc={proxyMock} />);
    wrapper.instance().reScale = jest.fn();
    wrapper.setProps({ pdfDoc: proxyMockAnother });
    expect(wrapper.instance().reScale).toHaveBeenCalled();
  });
});
