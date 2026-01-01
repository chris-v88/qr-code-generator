import { QRCodeSVG } from 'qrcode.react';
import React, { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import type { IFormInput } from './resources/types';

import Modal from './components/Modal';

const App: React.FC = () => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    setQrCodeUrl(data.url);
  };

  const handleCloseModal = () => {
    setQrCodeUrl(null);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-xl font-semibold">Type in your URL</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
        <input
          type="text"
          placeholder="Enter URL"
          {...register('url', {
            required: 'Please enter a URL',
            pattern: {
              value: /^(https:\/\/)[^\s$.?#].[^\s]*$/,
              message: 'Please enter a valid and secure URL (https only)',
            },
          })}
          className={`p-2 mt-5 border rounded w-72 text-lg ${errors.url ? 'border-red-500' : 'border-gray-300'}`}
        />
        {errors.url && (
          <small className="text-red-500 text-xs mt-1.5">
            {errors.url.message}
          </small>
        )}
        <button
          type="submit"
          className="mt-5 p-2 bg-blue-500 text-white rounded hover:bg-customBlue"
        >
          Submit
        </button>
      </form>

      {qrCodeUrl && (
        <Modal qrText={qrCodeUrl} handleClose={handleCloseModal}>
          <div className="mx-auto">
            <QRCodeSVG value={qrCodeUrl} />
          </div>
        </Modal>
      )}
    </div>
  );
};

export default App;
