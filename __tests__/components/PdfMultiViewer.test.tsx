import React from 'react';
import { mount, shallow } from 'enzyme';
import { PdfMultiViewer, PdfRenderer } from '../../src';

const { getDocument } = require('pdfjs-dist/build/pdf');
jest.genMockFromModule('pdfjs-dist/build/pdf');
jest.mock('pdfjs-dist/build/pdf');

const getDocumentPromise = Promise.resolve({ numPages: 1 });

getDocument.mockImplementation(
  jest.fn().mockReturnValueOnce(getDocumentPromise),
);

describe('<PdfMultiViewer />', () => {
  it('should exist', () => {
    expect(PdfMultiViewer).toBeDefined();
  });

  it('renders the PdfRenderer', () => {
    const wrapper = shallow<PdfMultiViewer>(
      <PdfMultiViewer pdfs={['test.pdf']} />,
    );

    return getDocumentPromise.then(() => {
      expect(wrapper.find(PdfRenderer).exists()).toBeTruthy();
    });
  });

  it('should set overlayMode true', () => {
    const wrapper = mount<PdfMultiViewer>(
      <PdfMultiViewer pdfs={['test.pdf']} />,
    );

    wrapper.instance().setOverlayMode(400);

    expect(wrapper.state().overlayMode).toBeTruthy();
  });

  it('should set overlayMode false', () => {
    const wrapper = mount<PdfMultiViewer>(
      <PdfMultiViewer pdfs={['test.pdf']} />,
    );
    wrapper.setState({ overlayMode: true });
    wrapper.instance().setOverlayMode(1200);

    expect(wrapper.state().overlayMode).toBeFalsy();
  });
});
