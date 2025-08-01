import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const MobileMenuButton = ({ isOpen, onClick, className }) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "lg:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors",
        className
      )}
    >
      <ApperIcon name={isOpen ? "X" : "Menu"} size={24} />
    </button>
  );
};

export default MobileMenuButton;