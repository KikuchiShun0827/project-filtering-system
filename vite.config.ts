import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // GitHub Pages のプロジェクトページ（/<リポジトリ名>/）配下に置くため
  base: '/project-filtering-system/',
})
