import { NavLink } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const NavItem = ({ to, icon, label, className }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 group",
          isActive
            ? "bg-primary-800 text-white shadow-lg"
            : "text-gray-300 hover:text-white hover:bg-primary-800/50",
          className
        )
      }
    >
      <ApperIcon 
        name={icon} 
        size={20} 
        className="mr-3 transition-transform group-hover:scale-110" 
      />
      {label}
    </NavLink>
  );
};

export default NavItem;