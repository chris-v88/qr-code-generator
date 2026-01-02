import domtoimage from 'dom-to-image';
import { QRCodeCanvas } from 'qrcode.react';
import React, { useRef, useState } from 'react';
import Button from './ui/Button';
import Modal from './ui/Modal';

export type QrModalProps = {
  children?: React.ReactNode;
  qrText: string;
  handleClose: () => void;
};

const QrModal = (props: QrModalProps) => {
  const { qrText, handleClose } = props;

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
    <Modal isOpen={true} onClose={handleClose} title="Generated QR Code">
      <div className="flex flex-col items-center">
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
          <Button
            className="mb-4 p-2 bg-green-500 text-white rounded hover:bg-green-700"
            onClick={handleDownload}
            rightIcon="Download"
          >
            Download
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default QrModal;
