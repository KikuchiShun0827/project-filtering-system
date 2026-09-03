import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from '../components/Layout'
import Assignments from '../pages/Assignments'
import Dashboard from '../pages/Dashboard'
import EngineerDetail from '../pages/EngineerDetail'
import EngineerEdit from '../pages/EngineerEdit'
import EngineerNew from '../pages/EngineerNew'
import Engineers from '../pages/Engineers'
import Login from '../pages/Login'
import ProjectDetail from '../pages/ProjectDetail'
import SettingsPage from '../pages/SettingsPage'
import RequireAuth from './RequireAuth'

const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route
      element={
        <RequireAuth>
          <Layout />
        </RequireAuth>
      }
    >
      <Route path="/" element={<Dashboard />} />
      <Route path="/projects/:projectId" element={<ProjectDetail />} />
      <Route path="/assignments" element={<Assignments />} />
      <Route path="/engineers" element={<Engineers />} />
      {/* 静的セグメントが優先されるので :engineerId には吸われない */}
      <Route path="/engineers/new" element={<EngineerNew />} />
      <Route path="/engineers/:engineerId" element={<EngineerDetail />} />
      <Route path="/engineers/:engineerId/edit" element={<EngineerEdit />} />
      <Route path="/settings" element={<SettingsPage />} />
    </Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
)

export default AppRoutes
