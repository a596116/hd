interface ViteEnv {
  VITE_API_URL: string
  VITE_APP_TITLE: string
  VITE_BASEURL: string //數據接口
}

interface ImportMeta {
  readonly env: ViteEnv
}
