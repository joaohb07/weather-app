import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// Initialize i18next translation resources before rendering the component tree
import './i18n'
import App from './App.jsx'

// Mount the root React component into the `#root` DOM container.
// `StrictMode` enables extra development-only checks (e.g., double-invoking effects)
// to catch impure renders and missing cleanup logic early.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)