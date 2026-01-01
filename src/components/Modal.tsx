import domtoimage from 'dom-to-image';
import { QRCodeCanvas } from 'qrcode.react';
import React, { useRef, useState } from 'react';

interface ModalProps {
  children: React.ReactNode;
  qrText: string;
  handleClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ children, qrText, handleClose }) => {
  const [fileType, setFileType] = useState('png');
  const qrRef = useRef<HTMLDivElement>(null);

  const fileTypes = ['jpg', 'png', 'svg'];

  const handleDownload = () => {
    if (!qrRef.current) return;

    let dataUrlPromise;
    switch (fileType) {
      case fileTypes[0]:
        dataUrlPromise = domtoimage.toJpeg(qrRef.current);
        break;
      case fileTypes[1]:
        dataUrlPromise = domtoimage.toPng(qrRef.current);
        break;
      case fileTypes[3]:
        dataUrlPromise = domtoimage.toSvg(qrRef.current);
        break;
      default:
        dataUrlPromise = domtoimage.toPng(qrRef.current);
    }

    dataUrlPromise.then((dataUrl) => {
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `qrcode.${fileType}`;
      link.click();
    });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center h-screen bg-gray-400 bg-opacity-75">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96 flex flex-col items-center">
        <h1 className="text-xl font-semibold mb-4">Generated QR Code</h1>

        <div className="mb-4" ref={qrRef}>
          <QRCodeCanvas value={qrText} />
        </div>
        <div className="text-center text-gray-600 mb-4">{qrText}</div>

        <div className="flex flex-row space-x-2">
          <select
            className="mb-4 p-2 border rounded w-full"
            value={fileType}
            onChange={(e) => setFileType(e.target.value)}
          >
            {fileTypes.map((type) => (
              <option value={type}>{type.toUpperCase()}</option>
            ))}
          </select>
          <button
            className="mb-4 p-2 bg-green-500 text-white rounded hover:bg-green-700"
            onClick={handleDownload}
          >
            Download
          </button>
        </div>

        <button
          className="mt-4 p-2 bg-red-500 text-white rounded hover:bg-red-900"
          onClick={handleClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;
