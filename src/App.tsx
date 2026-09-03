import { HashRouter } from 'react-router-dom'
import AppRoutes from './routes/AppRoutes'
import { AuthProvider } from './store/AuthContext'
import { DataProvider } from './store/DataContext'
import { SettingsProvider } from './store/SettingsContext'

// GitHub Pages はパスごとのファイルしか返せないため、リロードで 404 にならない HashRouter を使う
const App = () => (
  <HashRouter>
    <SettingsProvider>
      <AuthProvider>
        <DataProvider>
          <AppRoutes />
        </DataProvider>
      </AuthProvider>
    </SettingsProvider>
  </HashRouter>
)

export default App
