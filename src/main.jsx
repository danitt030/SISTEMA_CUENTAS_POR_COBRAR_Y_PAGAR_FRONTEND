import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './styles/professional-modules.css'
import App from './App.jsx'
import { suppressExtensionErrors } from './utils/suppressExtensionErrors.js'
import { applyUiPreferences } from './utils/uiPreferences.js'

// Suprimir errores causados por extensiones de Chrome
suppressExtensionErrors();
applyUiPreferences();

const rootElement = document.getElementById('root');
const bootStartedAt = typeof performance !== 'undefined' ? performance.now() : Date.now();

const hideBootSplash = () => {
  const splash = document.getElementById('app-boot-splash');

  if (!splash || splash.dataset.state === 'hiding') {
    return;
  }

  splash.dataset.state = 'hiding';

  const elapsed = (typeof performance !== 'undefined' ? performance.now() : Date.now()) - bootStartedAt;
  const minVisibleTime = 620;
  const waitTime = Math.max(0, minVisibleTime - elapsed);

  window.setTimeout(() => {
    splash.classList.add('is-hidden');
    window.setTimeout(() => splash.remove(), 460);
  }, waitTime);
};

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

if (rootElement && rootElement.childElementCount > 0) {
  hideBootSplash();
} else if (rootElement) {
  const observer = new MutationObserver(() => {
    if (rootElement.childElementCount > 0) {
      observer.disconnect();
      hideBootSplash();
    }
  });

  observer.observe(rootElement, { childList: true });

  // Fallback para garantizar cierre del splash aunque el observer tarde.
  window.setTimeout(() => {
    observer.disconnect();
    hideBootSplash();
  }, 2800);
}
