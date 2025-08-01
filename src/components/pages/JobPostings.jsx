import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import JobPostingList from "@/components/organisms/JobPostingList";
import JobPostingForm from "@/components/organisms/JobPostingForm";
import { jobPostingService } from "@/services/api/jobPostingService";

const JobPostings = () => {
  const [showForm, setShowForm] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleCreateNew = () => {
    setShowForm(true);
  };

  const handleFormSubmit = async (formData) => {
    try {
await jobPostingService.create({
        ...formData,
        status: "active",
        applicationCount: 0
      });
      setShowForm(false);
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      throw error;
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <AnimatePresence mode="wait">
        {showForm ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <JobPostingForm
              onSubmit={handleFormSubmit}
              onCancel={handleFormCancel}
            />
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <JobPostingList
              onCreateNew={handleCreateNew}
              refreshTrigger={refreshTrigger}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default JobPostings;