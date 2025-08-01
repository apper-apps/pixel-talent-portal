import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import JobCard from "@/components/molecules/JobCard";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { jobPostingService } from "@/services/api/jobPostingService";

const JobPostingList = ({ onCreateNew, refreshTrigger }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadJobs = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await jobPostingService.getAll();
      setJobs(data);
    } catch (err) {
      setError("Failed to load job postings");
      toast.error("Failed to load job postings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, [refreshTrigger]);

  const handleJobClick = (job) => {
    toast.info(`Viewing details for: ${job.title}`);
  };

  if (loading) {
    return <Loading type="cards" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadJobs} />;
  }

  if (jobs.length === 0) {
    return (
      <Empty
        title="No Job Postings Yet"
        message="Start building your talent pipeline by creating your first job posting."
        action={onCreateNew}
        actionLabel="Create First Job"
        icon="Briefcase"
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Active Job Postings</h2>
          <p className="text-gray-600 mt-1">{jobs.length} position{jobs.length !== 1 ? "s" : ""} available</p>
        </div>
        <Button onClick={onCreateNew} className="shadow-lg">
          <ApperIcon name="Plus" size={16} className="mr-2" />
          Add Job Posting
        </Button>
      </div>

      <motion.div 
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence>
          {jobs.map((job) => (
            <JobCard
              key={job.Id}
              job={job}
              onClick={handleJobClick}
            />
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default JobPostingList;