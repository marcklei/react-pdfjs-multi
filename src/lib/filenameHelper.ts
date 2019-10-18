const isDataSchema = (url: string) => {
  let i = 0,
    ii = url.length;

  while (i < ii && url[i].trim() === '') {
    i++;
  }

  return url.substring(i, i + 5).toLowerCase() === 'data:';
}

export const getPDFFileNameFromURL = function (url: string) {
  const defaultFilename = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'document.pdf';

  if (typeof url !== 'string') {
    return defaultFilename;
  }

  if (isDataSchema(url)) {
    console.warn('getPDFFileNameFromURL: ' + 'ignoring "data:" URL for performance reasons.');
    return defaultFilename;
  }

  const reURI = /^(?:(?:[^:]+:)?\/\/[^\/]+)?([^?#]*)(\?[^#]*)?(#.*)?$/;
  const reFilename = /[^\/?#=]+\.pdf\b(?!.*\.pdf\b)/i;
  const splitURI = reURI.exec(url);
  let suggestedFilename: RegExpExecArray | string | null = null;

  if (splitURI) {
    suggestedFilename = reFilename.exec(splitURI[1]) || reFilename.exec(splitURI[2]) || reFilename.exec(splitURI[3]);
  }

  if (suggestedFilename) {
    suggestedFilename = suggestedFilename[0];

    if (suggestedFilename.includes('%')) {
      try {
        const suggestedFilenameResult = reFilename.exec(decodeURIComponent(suggestedFilename));

        if (suggestedFilenameResult) {
          suggestedFilename = suggestedFilenameResult[0];
        }
      } catch (ex) { }
    }
  }

  return suggestedFilename || defaultFilename;
}