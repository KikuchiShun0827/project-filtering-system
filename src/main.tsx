import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// グローバル CSS を先に読み込み、各コンポーネントの Emotion スタイルが後から上書きできるようにする
import './styles.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
