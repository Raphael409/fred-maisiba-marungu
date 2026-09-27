// src/App.jsx
// App is intentionally thin — routing and providers live in main.jsx.
// Add any future global wrappers (theme provider, analytics init) here.
import AppRoutes from '@/routes/AppRoutes'

export default function App() {
  return <AppRoutes />
}
