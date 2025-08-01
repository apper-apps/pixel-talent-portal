import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import { format } from "date-fns";

const ApplicationItem = ({ application, index }) => {
  const getStatusVariant = (status) => {
    switch (status.toLowerCase()) {
      case "pending": return "warning";
      case "reviewed": return "primary";
      case "accepted": return "success";
      case "rejected": return "error";
      default: return "default";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.01 }}
      className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md hover:border-primary-200 transition-all duration-200"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
            <span className="text-white font-medium text-sm">
              {application.candidateName.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h4 className="font-medium text-gray-900">{application.candidateName}</h4>
            <p className="text-sm text-gray-500">{application.candidateEmail}</p>
          </div>
        </div>
        <Badge variant={getStatusVariant(application.status)}>
          {application.status}
        </Badge>
      </div>
      
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center text-gray-600">
          <ApperIcon name="Briefcase" size={16} className="mr-2" />
          <span className="font-medium">{application.appliedPosition}</span>
        </div>
        <div className="flex items-center text-gray-500">
          <ApperIcon name="Calendar" size={16} className="mr-1" />
          <span>{format(new Date(application.appliedDate), "MMM d")}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default ApplicationItem;