import React, { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import type { IFormInput } from './resources/types';

import QrModal from './components/QrModal';
import Button from './components/ui/Button';

const App = () => {
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
            validate: (value) => {
              try {
                const url = new URL(value);
                if (url.protocol !== 'https:') {
                  return 'Please enter a valid and secure URL (https only)';
                }
                return true;
              } catch (error) {
                return 'Please enter a valid and secure URL (https only)';
              }
            },
          })}
          className={`p-2 mt-5 border rounded w-72 text-lg ${errors.url ? 'border-red-500' : 'border-gray-300'}`}
        />
        {errors.url && (
          <small className="text-red-500 text-xs mt-1.5">
            {errors.url.message}
          </small>
        )}
        <Button
          type="submit"
          className="mt-5 p-2"
          tone="primary"
          variant="solid"
          size="md"
        >
          Submit
        </Button>
      </form>

      {qrCodeUrl && (
        <QrModal qrText={qrCodeUrl} handleClose={handleCloseModal}>
          {/* <div className="mx-auto">
            <QRCodeSVG value={qrCodeUrl} />
          </div> */}
        </QrModal>
      )}
    </div>
  );
};

export default App;
