# Generate Your QR Code

## Overview

This app is built for easily make QR codes without needing fancy tools. It's simple, but it had some tricky problems to make it work in a browser.

## Prerequisites

To make this app work, I need these "packages" installed, which are listed in `package.json` file:

- **react** and **react-dom** (`^18.3.1`): the building blocks for the app.
- **react-hook-form** (`^7.53.1`): where you type the link, it checks if what you type is okay and shows errors. I used it because it makes handling forms.
- **qrcode.react** (`^4.1.0`): tool for drawing the QR code picture. It's made for React and works great in browsers.
- **qr-image** (`^3.2.0`): Another QR tool
- **typescript** (`^4.9.5`): instead of `javascript`, it helps with data type and catches mistakes early (I'm used to write react with typescript).
- **react-scripts** (`5.0.1`): helps run the app and build it.
- **browserify-zlib** (`^0.2.0`) and **stream-browserify** (`^3.0.0`): fake helpers for things that don't work in browsers. I used them to fix problems with the QR code tool.

## Webpack

Webpack that takes all the pieces of this app (like the React code, the QR code maker, and other stuff) and put them into one file that the web browser can understand and run. Without it, the app wouldn't load.

- **The Problem**: Some tools, like `"zlib"` (for squeezing data to make it smaller) and `"stream"` (for handling data in pieces, like a video loading), come from "Node.js" (a special way to run code on computers). Browsers don't have these tools built-in, so they can't use them. But the QR code tool (`qrcode.react`) needs them secretly to work.

- **The Fix**: I use "polyfills"—fake versions that pretend to be the real tools. `browserify-zlib` acts like zlib, and `stream-browserify` acts like stream. In the `webpack.config.js` file, I tell webpack:

```js
resolve: {
  // which file extensions to look for when resolving module imports
  extensions: ['.tsx', '.ts', '.js'],

  // alternative implementations (polyfills) for modules that are not available in the browser
  fallback: {
    zlib: require.resolve('browserify-zlib'),
    stream: require.resolve('stream-browserify'),
  },
},
```

This way, when the QR code maker tries to use zlib or stream, it gets the fake ones that work in browsers. I did this because without polyfills, the app would crash when making QR codes.

## TypeScript Declarations

The QR code tools (`qrcode.react`) are made in plain JavaScript, not TypeScript. So, TypeScript doesn't know how to use them. It doesn't know what buttons or settings they have.

To fix this, I made "instruction books" or blueprint called `.d.ts` files.

- **qrcode.react.d.ts** : This then being imported into `App.tsx` like this:

```ts
import { QRCodeSVG } from 'qrcode.react';
```

Then in the code, it shows the QR code:

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

- **qr-image.d.ts**: This is for another QR tool

## Form with `react-hook-form`

The input where you type the link uses `react-hook-form`

```ts
const {
  register,
  handleSubmit,
  formState: { errors },
} = useForm<IFormInput>();
```

- `register` the box so it knows what you type.
- Checks if the link is real and safe (must be `https`)
- Shows error messages if something's wrong
- When you submit, it makes the QR code:

I used this because it handles forms with checks without us writing tons of code.

---

### Note:

API key is client-side for demo purposes—do not use sensitive keys
