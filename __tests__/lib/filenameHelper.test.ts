import { getPDFFileNameFromURL } from "../../src/lib/filenameHelper";

const dataUriMock = 'data:application/pdf;base64, JVBERi0xLjMKJcTl8uXrp/Og0MTGCjQgMCBvYmoKPDwgL0xlbmd0aCA1ID';

describe('filenameHelper', () => {
  it('should return default filename if data uri is present', () => {
    const filename = getPDFFileNameFromURL(dataUriMock);
    expect(filename).toEqual('document.pdf');
  });

  it('should decode filename if its encoded', () => {
    const filename = getPDFFileNameFromURL('http://www.test.com/this%20is%20a%20test%20pdf.pdf');
    expect(filename).toEqual('this is a test pdf.pdf');
  });

  it('should return the correct filename', () => {
    const filename = getPDFFileNameFromURL('http://www.test.com/some/path/test.pdf');
    expect(filename).toEqual('test.pdf');
  });

  it('should return the default filename if no string is passed', () => {
    const noString = ['test'] as any;
    const filename = getPDFFileNameFromURL(noString);
    expect(filename).toEqual('document.pdf');
  });
});