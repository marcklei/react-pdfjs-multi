import React from 'react';
import { shallow } from 'enzyme';
import { PdfMultiViewer, PdfRenderer } from '../../src';

const { getDocument } = require('pdfjs-dist/build/pdf');
jest.genMockFromModule('pdfjs-dist/build/pdf');
jest.mock('pdfjs-dist/build/pdf');

const getDocumentPromise = Promise.resolve({ numPages: 1 });

getDocument.mockImplementation(jest.fn().mockReturnValue(getDocumentPromise));

describe('<PdfMultiViewer />', () => {
  it('should exist', () => {
    expect(PdfMultiViewer).toBeDefined();
  });

  it('renders the PdfRenderer', async () => {
    const wrapper = shallow<PdfMultiViewer>(
      <PdfMultiViewer pdfs={['test.pdf']} />,
    );

    await getDocumentPromise;
    expect(wrapper.find(PdfRenderer).exists()).toBeTruthy();
  });

  it('should set overlayMode true', () => {
    const wrapper = shallow<PdfMultiViewer>(
      <PdfMultiViewer pdfs={['test.pdf']} />,
    );

    wrapper.instance().setOverlayMode(400);

    expect(wrapper.state().overlayMode).toBeTruthy();
  });

  it('should set overlayMode false', () => {
    const wrapper = shallow<PdfMultiViewer>(
      <PdfMultiViewer pdfs={['test.pdf']} />,
    );
    wrapper.instance().setOverlayMode(330);
    wrapper.instance().setOverlayMode(1200);

    expect(wrapper.state().overlayMode).toBeFalsy();
  });

  it('should toggle list state', () => {
    const wrapper = shallow<PdfMultiViewer>(
      <PdfMultiViewer pdfs={['test.pdf']} />,
    );
    wrapper.instance().toggleList();

    expect(wrapper.state().listVisible).toBeFalsy();
  });

  it('should not change activeIndex when pdfProxy not present', () => {
    const wrapper = shallow<PdfMultiViewer>(
      <PdfMultiViewer pdfs={['test.pdf', 'test2.pdf']} />,
    );
    const file = wrapper.state().files[1];
    wrapper.instance().changePdf(1, file);

    expect(wrapper.state().activeIndex).toEqual(0);
  });

  it('should change activeIndex when pdfProxy is present', async () => {
    const wrapper = shallow<PdfMultiViewer>(
      <PdfMultiViewer pdfs={['test.pdf', 'test2.pdf']} />,
    );

    await getDocumentPromise;
    const file = wrapper.state().files[1];
    wrapper.instance().changePdf(1, file)();

    expect(wrapper.state().activeIndex).toEqual(1);
  });

  it('should call toggleList when listVisible and overlayMode', async () => {
    const wrapper = shallow<PdfMultiViewer>(
      <PdfMultiViewer pdfs={['test.pdf', 'test2.pdf']} />,
    );

    const spy = jest.spyOn(wrapper.instance(), 'toggleList');

    await getDocumentPromise;
    const file = wrapper.state().files[1];
    wrapper.instance().setOverlayMode(330);
    wrapper.instance().changePdf(1, file)();

    expect(spy).toHaveBeenCalled();
  });

  it('should not call toggleList when listVisible and !overlayMode', async () => {
    const wrapper = shallow<PdfMultiViewer>(
      <PdfMultiViewer pdfs={['test.pdf', 'test2.pdf']} />,
    );

    const spy = jest.spyOn(wrapper.instance(), 'toggleList');

    await getDocumentPromise;

    const file = wrapper.state().files[1];
    // wrapper.setState({ overlayMode: false, listVisible: true });
    wrapper.instance().setOverlayMode(1200);
    wrapper.instance().changePdf(1, file)();

    expect(spy).not.toHaveBeenCalled();
  });

  it('should destroy worker on unmount', () => {
    const wrapper = shallow<PdfMultiViewer>(
      <PdfMultiViewer pdfs={['test.pdf', 'test2.pdf']} />,
    );

    return getDocumentPromise.then(() => {
      const spy = wrapper.instance().worker.destroy;
      wrapper.unmount();
      expect(spy).toHaveBeenCalled();
    });
  });
});
