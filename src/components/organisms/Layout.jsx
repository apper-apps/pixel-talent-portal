import { useState } from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/organisms/Header";
import Sidebar from "@/components/organisms/Sidebar";
const Layout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMobileMenuClose = () => {
    setIsMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar 
        isMobileMenuOpen={isMobileMenuOpen}
        onMobileMenuClose={handleMobileMenuClose}
        user={user}
        onLogout={handleLogout}
      />
      
      <div className="lg:ml-60">
        <Header 
          onMenuClick={handleMobileMenuToggle}
          isMobileMenuOpen={isMobileMenuOpen}
          user={user}
          onLogout={handleLogout}
        />
        
        <main className="p-4 lg:p-6">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;