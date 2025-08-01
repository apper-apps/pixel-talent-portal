import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import { format } from "date-fns";

const JobCard = ({ job, onClick }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 cursor-pointer transition-all duration-200 hover:shadow-lg hover:border-primary-200 group"
      onClick={() => onClick && onClick(job)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-700 transition-colors">
            {job.title}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Posted {format(new Date(job.createdAt), "MMM d, yyyy")}
          </p>
        </div>
        <Badge variant="primary" className="ml-4">
          {job.applicationCount} applications
        </Badge>
      </div>
      
      <p className="text-gray-600 text-sm line-clamp-3 mb-4">
        {job.description}
      </p>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center text-sm text-gray-500">
          <ApperIcon name="Clock" size={16} className="mr-1" />
          <span className="capitalize">{job.status}</span>
        </div>
        <div className="flex items-center text-primary-600 text-sm font-medium group-hover:text-primary-700 transition-colors">
          <span>View Details</span>
          <ApperIcon name="ArrowRight" size={16} className="ml-1 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </motion.div>
  );
};

export default JobCard;