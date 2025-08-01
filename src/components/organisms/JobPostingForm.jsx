import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import FormField from "@/components/molecules/FormField";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const JobPostingForm = ({ onSubmit, onCancel, initialData = null }) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    requirements: initialData?.requirements || ""
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (field) => (e) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = "Job title is required";
    }
    
    if (!formData.description.trim()) {
      newErrors.description = "Job description is required";
    }
    
    if (!formData.requirements.trim()) {
      newErrors.requirements = "Job requirements are required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await onSubmit(formData);
      toast.success(initialData ? "Job posting updated successfully!" : "Job posting created successfully!");
    } catch (error) {
      toast.error("Failed to save job posting. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
            <ApperIcon name="Plus" size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {initialData ? "Edit Job Posting" : "Create New Job Posting"}
            </h2>
            <p className="text-sm text-gray-500">Fill in the details below</p>
          </div>
        </div>
        {onCancel && (
          <Button variant="ghost" onClick={onCancel}>
            <ApperIcon name="X" size={16} />
          </Button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <FormField
          label="Job Title"
          placeholder="e.g. Senior Virtual Assistant"
          value={formData.title}
          onChange={handleChange("title")}
          error={errors.title}
        />

        <FormField
          label="Job Description"
          multiline
          rows={4}
          placeholder="Describe the role, responsibilities, and what you're looking for..."
          value={formData.description}
          onChange={handleChange("description")}
          error={errors.description}
        />

        <FormField
          label="Requirements"
          multiline
          rows={3}
          placeholder="List the required skills, experience, and qualifications..."
          value={formData.requirements}
          onChange={handleChange("requirements")}
          error={errors.requirements}
        />

        <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <ApperIcon name="Loader2" size={16} className="mr-2 animate-spin" />
                {initialData ? "Updating..." : "Creating..."}
              </>
            ) : (
              <>
                <ApperIcon name="Save" size={16} className="mr-2" />
                {initialData ? "Update Job" : "Create Job"}
              </>
            )}
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default JobPostingForm;