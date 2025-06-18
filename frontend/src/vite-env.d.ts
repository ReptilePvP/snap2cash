/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SERPAPI_API_KEY: string;
  readonly VITE_GOOGLE_APPLICATION_CREDENTIALS: string;
  // Add other VITE_ prefixed environment variables here if needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
