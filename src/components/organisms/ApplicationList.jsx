import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApplicationItem from "@/components/molecules/ApplicationItem";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { applicationService } from "@/services/api/applicationService";

const ApplicationList = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

  const loadApplications = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await applicationService.getAll();
      setApplications(data);
    } catch (err) {
      setError("Failed to load applications");
      toast.error("Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const filteredApplications = applications.filter(app => {
    if (filter === "all") return true;
    return app.status.toLowerCase() === filter;
  });

  const statusCounts = applications.reduce((acc, app) => {
    const status = app.status.toLowerCase();
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  if (loading) {
    return <Loading type="list" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadApplications} />;
  }

  if (applications.length === 0) {
    return (
      <Empty
        title="No Applications Yet"
        message="Applications will appear here once candidates start applying to your job postings."
        icon="FileText"
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Applications</h2>
          <p className="text-gray-600 mt-1">
            {filteredApplications.length} of {applications.length} applications
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          {["all", "pending", "reviewed", "accepted", "rejected"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                filter === status
                  ? "bg-primary-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {status === "all" ? "All" : status.charAt(0).toUpperCase() + status.slice(1)}
              {status !== "all" && statusCounts[status] && (
                <span className="ml-1 text-xs">({statusCounts[status]})</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <motion.div layout className="space-y-4">
        {filteredApplications.map((application, index) => (
          <ApplicationItem
            key={application.Id}
            application={application}
            index={index}
          />
        ))}
      </motion.div>

      {filteredApplications.length === 0 && filter !== "all" && (
        <div className="text-center py-8">
          <ApperIcon name="Filter" size={48} className="text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No {filter} applications
          </h3>
          <p className="text-gray-500">
            Try selecting a different filter to view applications.
          </p>
        </div>
      )}
    </div>
  );
};

export default ApplicationList;