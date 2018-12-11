import React from 'react';

export type I18nDataRenderer = {
  zoom?: string;
  originalSize?: string;
  scaleUp?: string;
  scaleDown?: string;
  rotateLeft?: string;
  rotateRight?: string;
};

export const defaultI18n: I18nDataRenderer = {
  zoom: 'Automatic zoom',
  originalSize: 'Original size',
  scaleUp: 'Scale up',
  scaleDown: 'Scale down',
  rotateLeft: 'Rotate left',
  rotateRight: 'Rotate right',
};

export const I18nContext = React.createContext(defaultI18n);
