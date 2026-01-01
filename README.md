# Generate Your QR Code

## Overview

This application allows users to generate QR codes by entering a URL. The QR code is displayed in a modal, and users can close the modal when they are done.

## Prerequisites

To run this application, you need to have the following packages installed with the specified versions:

- **`react`** : `^18.3.1`
- **`react-dom`** : `^18.3.1`
- **`react-hook-form`** : `^7.53.1`
- **`qrcode.react`** : `^4.1.0`
- **`qr-image`** : `^3.2.0`
- **`typescript`** : `^4.9.5`
- **`react-scripts`** : `5.0.1`
- **`browserify-zlib`** : `^0.2.0`
- **`stream-browserify`** : `^3.0.0`

## Webpack Configuration

### Issue

The `webpack.config.js` file was created to bundle application code and its dependencies into a format that can run in a web browser. Some **Node.js modules**, like `zlib` (used for compression) and `stream` (used for handling data streams), are not available in the browser by default

### Resolve

The project use `polyfills` -- substitute implementations of these modules that work in the browser: The `browserify-zlib` (used as a replacement for the `zlib` module) and `stream-browserify` (used as a replacement for the `stream` module) packages are included in the `package.json`. The `webpack.config.js` file includes the following configuration to resolve these modules:

```js
resolve: {
  extensions: ['.tsx', '.ts', '.js'], // which file extensions to look for when resolving module imports
  fallback: { // alternative implementations (polyfills) for modules that are not available in the browser
    zlib: require.resolve('browserify-zlib'),
    stream: require.resolve('stream-browserify'),
  },
},
```

## TypeScript Declarations

### `qrcode.react.d.ts`

#### Issue

The `qrcode.react` package does not provide its own TypeScript type declarations.

#### Explanation

To use `qrcode.react` in a TypeScript project, we need to create a custom type declaration file, `qrcode.react.d.ts`, to define the types for the components provided by the package. This file includes the type definitions for `QRCodeCanvas` and `QRCodeSVG` components:

```ts
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
```

### `qr-image.d.ts`

#### Issue

The `qr-image` package does not provide its own TypeScript type declarations.

#### Explanation

To use `qr-image` in a TypeScript project, we need to create a custom type declaration file, `qr-image`.d.ts, to define the types for the functions provided by the package. This file includes the type definitions for the `imageSync` function:

```ts
declare module 'qr-image' {
  interface Options {
    type?: 'png' | 'svg' | 'pdf' | 'eps';
    size?: number;
    margin?: number;
    ec_level?: 'L' | 'M' | 'Q' | 'H';
  }

  function imageSync(text: string, options?: Options): Buffer;

  export { imageSync };
}
```

### We ended up using qrcode.react.d.ts

In the provided codebase, the qrcode.react package is used to generate and display QR codes within the React application. Specifically, the QRCodeSVG component from the qrcode.react package is imported and used in the `App.tsx` file:

```ts
import { QRCodeSVG } from 'qrcode.react';
```

This component is then rendered inside the Modal component to display the generated QR code:

```tsx
{
  qrCodeUrl && (
    <Modal qrText={qrCodeUrl} handleClose={handleCloseModal}>
      <div className="mx-auto">
        <QRCodeSVG value={qrCodeUrl} />
      </div>
    </Modal>
  );
}
```

Since `qrcode.react` does not provide its own TypeScript type declarations, we created the `qrcode.react.d.ts` file to define the types for the components provided by the package. This allows us to use the `QRCodeSVG` component with proper type checking in our TypeScript project.

On the other hand, the `qr-image` package is not used in the provided codebase. Therefore, the `qr-image.d.ts` file, which defines the types for the `qr-image` package, is not utilized in this project.

## Usage of `react-hook-form`

The `react-hook-form` library is used in this application to manage form state and validation. Here is how it is being used in `App.tsx` :

1. **Form Registration**: The `useForm` hook is used to register the form fields and manage their state.

```ts
const {
  register,
  handleSubmit,
  formState: { errors },
} = useForm<IFormInput>();
```

2. **Form Submission**: The `handleSubmit` function is used to handle form submission. The `onSubmit` function is called when the form is successfully submitted.

```ts
const onSubmit: SubmitHandler<IFormInput> = (data) => {
  setQrCodeUrl(data.url);
};
```

3. **Field Validation**: The `register` function is used to register the input field and apply validation rules.

```ts
<input
  type='text'
  placeholder='Enter URL'
  {...register('url', {
    required: 'Please enter a URL',
    pattern: {
      value: /^(https:\/\/)[^\s$.?#].[^\s]*$/,
      message: 'Please enter a valid and secure URL (https only)',
    },
  })}
  className={`p-2 mt-5 border rounded w-72 text-lg ${errors.url ? 'border-red-500' : 'border-gray-300'}`}
/>
```

4. **Error Handling**: Validation `errors` are displayed using the errors object.

```ts
{errors.url && (
  <small className='text-red-500 text-xs mt-1.5'>
    {errors.url.message}
  </small>
)}
```

By using `react-hook-form`, the application efficiently manages form state and validation with minimal boilerplate code.
