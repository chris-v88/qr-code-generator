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
