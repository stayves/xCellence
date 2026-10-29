import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import '@fontsource-variable/unbounded/wght.css'
import '@fontsource-variable/onest/wght.css'
import { initI18n } from './i18n'
import './index.css'
import App from './App.tsx'

document.documentElement.classList.add('js-reveal')

initI18n().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
})
