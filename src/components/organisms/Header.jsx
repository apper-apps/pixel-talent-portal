import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import MobileMenuButton from "@/components/molecules/MobileMenuButton";

const Header = ({ onMenuClick, isMobileMenuOpen }) => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4 lg:ml-60"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <MobileMenuButton
            isOpen={isMobileMenuOpen}
            onClick={onMenuClick}
          />
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg flex items-center justify-center">
              <ApperIcon name="Users" size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary-700 to-primary-900 bg-clip-text text-transparent">
                Talent Portal
              </h1>
              <p className="text-sm text-gray-500 hidden sm:block">Streamline your recruitment process</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600">
            <ApperIcon name="Clock" size={16} />
            <span>{new Date().toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;