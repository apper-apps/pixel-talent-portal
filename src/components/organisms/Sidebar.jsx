import { motion, AnimatePresence } from "framer-motion";
import NavItem from "@/components/molecules/NavItem";
import ApperIcon from "@/components/ApperIcon";

const Sidebar = ({ isMobileMenuOpen, onMobileMenuClose }) => {
const navigationItems = [
    { to: "/", icon: "Briefcase", label: "Job Postings" },
    { to: "/applications", icon: "FileText", label: "Applications" },
    { to: "/candidates", icon: "Users", label: "Candidates" },
    { to: "/clients", icon: "Building2", label: "Clients" },
    { to: "/assignments", icon: "UserCheck", label: "Assignments" }
  ];

  // Desktop Sidebar (Static)
  const DesktopSidebar = (
    <div className="hidden lg:block fixed inset-y-0 left-0 z-50 w-60 bg-gradient-to-b from-primary-900 to-primary-800 shadow-xl">
      <div className="flex flex-col h-full">
        <div className="flex items-center px-6 py-6 border-b border-primary-700">
          <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <ApperIcon name="Users" size={24} className="text-white" />
          </div>
          <div className="ml-3">
            <h2 className="text-lg font-bold text-white">Talent Portal</h2>
            <p className="text-xs text-primary-200">HR Dashboard</p>
          </div>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigationItems.map((item) => (
            <NavItem key={item.to} {...item} />
          ))}
        </nav>
        
        <div className="px-6 py-4 border-t border-primary-700">
          <div className="flex items-center text-primary-200 text-sm">
            <ApperIcon name="Shield" size={16} className="mr-2" />
            <span>Internal Use Only</span>
          </div>
        </div>
      </div>
    </div>
  );

  // Mobile Sidebar (Overlay)
  const MobileSidebar = (
    <AnimatePresence>
      {isMobileMenuOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            onClick={onMobileMenuClose}
          />
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-primary-900 to-primary-800 shadow-2xl"
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between px-6 py-6 border-b border-primary-700">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <ApperIcon name="Users" size={24} className="text-white" />
                  </div>
                  <div className="ml-3">
                    <h2 className="text-lg font-bold text-white">Talent Portal</h2>
                    <p className="text-xs text-primary-200">HR Dashboard</p>
                  </div>
                </div>
                <button
                  onClick={onMobileMenuClose}
                  className="p-2 text-primary-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  <ApperIcon name="X" size={20} />
                </button>
              </div>
              
              <nav className="flex-1 px-4 py-6 space-y-2">
                {navigationItems.map((item) => (
                  <NavItem 
                    key={item.to}
                    {...item}
                    onClick={onMobileMenuClose}
                  />
                ))}
              </nav>
              
              <div className="px-6 py-4 border-t border-primary-700">
                <div className="flex items-center text-primary-200 text-sm">
                  <ApperIcon name="Shield" size={16} className="mr-2" />
                  <span>Internal Use Only</span>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return (
    <>
      {DesktopSidebar}
      {MobileSidebar}
    </>
  );
};

export default Sidebar;