import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ProtectedRoute } from "./routes/ProtectedRoutes";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Helper component to resolve root path ("/") routing
function RootRedirect() {
  const { user, loading } = useAuth();

  if (loading) return null; // Avoid flicker while verifying auth token

  if (!user) {
    return <Navigate to="/register" replace />;
  }

  // Redirect logged-in users to their respective dashboard
  switch (user.role) {
    case "ADMIN":
      return <Navigate to="/admin/dashboard" replace />;
    case "WORKER":
      return <Navigate to="/worker/dashboard" replace />;
    case "STUDENT":
    default:
      return <Navigate to="/student/dashboard" replace />;
  }
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Smart Root Path */}
          <Route path="/" element={<RootRedirect />} />

          {/* Public Authentication Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Role-Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={["STUDENT"]} />}>
            <Route path="/student/dashboard" element={<div className="p-8">Student Dashboard</div>} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["WORKER"]} />}>
            <Route path="/worker/dashboard" element={<div className="p-8">Worker Dashboard</div>} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
            <Route path="/admin/dashboard" element={<div className="p-8">Admin Dashboard</div>} />
          </Route>

          {/* Fallback Catch-all Route */}
          <Route path="*" element={<RootRedirect />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}