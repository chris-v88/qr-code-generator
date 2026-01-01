declare module 'qrcode.react' {
  import * as React from 'react';

  interface QRCodeProps {
    value: string;
    size?: number;
    bgColor?: string;
    fgColor?: string;
    level?: 'L' | 'M' | 'Q' | 'H';
    includeMargin?: boolean;
    renderAs?: 'canvas' | 'svg';
    imageSettings?: {
      src: string;
      x?: number;
      y?: number;
      height?: number;
      width?: number;
      excavate?: boolean;
    };
  }

  export const QRCodeCanvas: React.FC<QRCodeProps>;
  export const QRCodeSVG: React.FC<QRCodeProps>;
}
