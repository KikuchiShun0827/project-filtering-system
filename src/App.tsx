import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './routes/AppRoutes'
import { AuthProvider } from './store/AuthContext'
import { DataProvider } from './store/DataContext'
import { SettingsProvider } from './store/SettingsContext'

const App = () => (
  <BrowserRouter>
    <SettingsProvider>
      <AuthProvider>
        <DataProvider>
          <AppRoutes />
        </DataProvider>
      </AuthProvider>
    </SettingsProvider>
  </BrowserRouter>
)

export default App
