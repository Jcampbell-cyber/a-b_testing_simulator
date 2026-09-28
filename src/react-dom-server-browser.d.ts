// React 18 only offers the web-streams renderer (used by src/entry-server.tsx) from this entry point
declare module 'react-dom/server.browser' {
  export { renderToReadableStream } from 'react-dom/server';
}
