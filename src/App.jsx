import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/organisms/Layout";
import JobPostings from "@/components/pages/JobPostings";
import Applications from "@/components/pages/Applications";
import Candidates from "@/components/pages/Candidates";
import Clients from "@/components/pages/Clients";
import ClientDetail from "@/components/pages/ClientDetail";
import Assignments from "@/components/pages/Assignments";
import Login from "@/components/auth/Login";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

const AppRoutes = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <Routes>
      <Route path="/" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={<JobPostings />} />
        <Route path="applications/*" element={<Applications />} />
        <Route path="candidates" element={<Candidates />} />
        <Route path="clients" element={<Clients />} />
        <Route path="clients/:id" element={<ClientDetail />} />
        <Route path="assignments" element={<Assignments />} />
      </Route>
      <Route path="*" element={<JobPostings />} />
    </Routes>
  );
};
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="App">
          <AppRoutes />
          
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            style={{ zIndex: 9999 }}
          />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;