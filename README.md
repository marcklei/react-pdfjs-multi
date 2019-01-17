# react-pdfjs-multi

[![Build Status](https://travis-ci.com/marcklei/react-pdfjs-multi.svg?branch=master)](https://travis-ci.com/marcklei/react-pdfjs-multi)
[![David Dependencies](https://david-dm.org/marcklei/react-pdfjs-multi.svg)](https://david-dm.org/marcklei/react-pdfjs-multi)
[![Coverage Status](https://coveralls.io/repos/github/marcklei/react-pdfjs-multi/badge.svg?branch=master)](https://coveralls.io/github/marcklei/react-pdfjs-multi?branch=master)

React wrapper for pdfjs with multiple file support.

This library uses [pdf.js][1].

For a preview of the current development visit [github pages][2].

> What does in development mean:
>
> 1.  **MINOR** versions represent **breaking changes**
> 1.  **PATCH** versions represent **fixes _and_ features**
> 1.  There are **no deprecation warnings** between releases

## Installation & Usage

`yarn add react-pdfjs-multi`

or

`npm i react-pdfjs-multi`

Example Usage:

```javascript
import React, { PureComponent } from 'react';
import { PdfMultiViewer } from 'react-pdfjs-multi';
import 'react-pdfjs-multi/dist/react-pdfjs-multi.css';

const pdfFiles = [
  'pdfs/test-pdf-a.pdf',
  {
    title: 'Trace-based Just-in-Time Type Specialization for DynamicLanguages',
    source: 'pdfs/compressed.tracemonkey-pldi-09.pdf',
  },
  'pdfs/test-pdf-b.pdf',
  'pdfs/test-pdf-c.pdf',
];

class MultiViewerExample extends PureComponent {
  render() {
    return <PdfMultiViewer pdfs={pdfFiles} />;
  }
}

export default MultiViewerExample;
```

### PdfMultiViewer

The MultiViewer allows you to pass an array of source strings or an object definition and it then loads all PDF's async and shows the renderer as soon as the first PDF is loaded.

Props:

| Name       | Required | Default | Type       | Description                                                    |
| ---------- | -------- | ------- | ---------- | -------------------------------------------------------------- |
| pdfs       | true     |         | {array}    | An array of strings or objects                                 |
| autoZoom   |          | true    | {boolean}  | enables/disables autoZoom on component mount and window resize |
| controls   |          | true    | {boolean}  | enables/disables controls to e.g. change renderer zoom         |
| i18nData   |          | {}\*    | {I18nData} | An object of translated strings, default language is en        |
| startIndex |          | 0       | {number}   | first pdf to load using array index                            |

### i18n

To be able to use different i18n libraries eg. i18next or react-intl you can pass an i18n object with translated strings to the component.

\*defaults:

```javascript
{
  // Viewer
  pages: 'Pages',
  // Renderer
  zoom: 'Automatic zoom',
  originalSize: 'Original size',
  rotateLeft: 'Rotate left',
  rotateRight: 'Rotate right',
  scaleUp: 'Scale up',
  scaleDown: 'Scale down',
  download: 'Download',
}
```

### PdfRenderer

If you like to implement your own custom multi renderer logic you can use the PdfRenderer component. For an implementation example see [Example][3].

Props:

| Name          | Required | Default | Type               | Description                                                    |
| ------------- | -------- | ------- | ------------------ | -------------------------------------------------------------- |
| pdfDoc        | true     |         | {PDFDocumentProxy} | A proxy of the pdf document to display                         |
| autoZoom      |          | true    | {boolean}          | enables/disables autoZoom on component mount and window resize |
| controls      |          | true    | {boolean}          | enables/disables controls to e.g. change renderer zoom         |
| downloadBtn   |          | true    | {boolean}          | enables/disables download button                               |
| i18nData      |          | {}\*    | {I18nDataRenderer} | An object of translated strings, default language is en        |
| zoom          |          | null    | {number}           | Initial Zoom                                                   |
| rotation      |          | null    | {number}           | Initial Rotation                                               |
| scrollTop     |          | null    | {number}           | Initial ScrollTop                                              |
| scrollLeft    |          | null    | {number}           | Initial ScrollLeft                                             |
| activeIndex   |          | null    | {number}           | Is required whenn the pdfChangeHook is used                    |
| pdfChangeHook |          | null    | {func}             | Callback function which gets a position object                 |

[1]: https://mozilla.github.io/pdf.js/
[2]: https://marcklei.github.io/react-pdfjs-multi/
[3]: https://github.com/marcklei/react-pdfjs-multi/blob/master/examples/src/RendererExample.js
