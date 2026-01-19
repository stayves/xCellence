import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './i18n'
import './index.css'
import App from './App.tsx'

const applyBaseAssets = () => {
  const base = import.meta.env.BASE_URL ?? '/'
  const normalizedBase = base.endsWith('/') ? base : `${base}/`
  const toUrl = (fileName: string) => `url('${normalizedBase}${fileName}')`
  const root = document.documentElement

  root.style.setProperty('--app-bg-image-light', toUrl('Background2.png'))
  root.style.setProperty('--app-bg-image-dark', toUrl('Background.jpg'))
  root.style.setProperty('--app-bg-image-light-mobile', toUrl('Background2-mobile.png'))
  root.style.setProperty('--app-bg-image-dark-mobile', toUrl('Background1-mobile.png'))
}

applyBaseAssets()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
