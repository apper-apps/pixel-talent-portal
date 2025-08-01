import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { jobPostingService } from "@/services/api/jobPostingService";
import { applicationService } from "@/services/api/applicationService";
import { candidateService } from "@/services/api/candidateService";
import ApperIcon from "@/components/ApperIcon";
import ApplicationItem from "@/components/molecules/ApplicationItem";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Applications from "@/components/pages/Applications";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";

const ApplicationList = () => {
const navigate = useNavigate();
const [applications, setApplications] = useState([]);
  const [jobPostings, setJobPostings] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Filter states
  const [statusFilter, setStatusFilter] = useState("all");
  const [jobPostingFilter, setJobPostingFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const handleViewDetail = (applicationId) => {
    navigate(`/applications/${applicationId}`);
  };

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [applicationsData, jobPostingsData, candidatesData] = await Promise.all([
        applicationService.getAll(),
        jobPostingService.getAll(),
        candidateService.getAll()
      ]);
      setApplications(applicationsData);
      setJobPostings(jobPostingsData);
      setCandidates(candidatesData);
    } catch (err) {
      setError("Failed to load data");
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setStatusFilter("all");
    setJobPostingFilter("all");
    setSearchQuery("");
    setDateFrom("");
    setDateTo("");
    toast.success("Filters cleared");
  };

  useEffect(() => {
    loadData();
  }, []);

// Enhanced filtering logic
  const filteredApplications = applications.filter(app => {
    // Status filter
    if (statusFilter !== "all" && app.status.toLowerCase() !== statusFilter) {
      return false;
    }

    // Job posting filter
    if (jobPostingFilter !== "all" && app.appliedPosition !== jobPostingFilter) {
      return false;
    }

    // Search by candidate name or skills
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const matchesName = app.candidateName.toLowerCase().includes(query);
      
      // Find candidate to check skills
      const candidate = candidates.find(c => c.name === app.candidateName);
      const matchesSkills = candidate && candidate.skills.some(skill => 
        skill.toLowerCase().includes(query)
      );
      
      if (!matchesName && !matchesSkills) {
        return false;
      }
    }

    // Date range filter
    if (dateFrom || dateTo) {
      const appDate = new Date(app.appliedDate);
      if (dateFrom && appDate < new Date(dateFrom)) {
        return false;
      }
      if (dateTo && appDate > new Date(dateTo + "T23:59:59")) {
        return false;
      }
    }

    return true;
  });

  const statusCounts = applications.reduce((acc, app) => {
    const status = app.status;
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const uniqueJobPostings = [...new Set(applications.map(app => app.appliedPosition))];

if (loading) {
    return <Loading type="list" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadData} />;
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Applications</h2>
          <p className="text-gray-600 mt-1">
            {filteredApplications.length} of {applications.length} applications
          </p>
        </div>
        
        <Button
          onClick={clearFilters}
          variant="outline"
          className="self-start sm:self-center"
        >
          <ApperIcon name="RotateCcw" size={16} className="mr-2" />
          Clear Filters
        </Button>
      </div>

      {/* Enhanced Filters */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-4">
        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <ApperIcon name="Search" size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search by candidate name or skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          {/* Date Range */}
          <div className="flex gap-2">
            <div className="flex-1 min-w-[140px]">
              <Input
                type="date"
                placeholder="From date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="text-sm"
              />
            </div>
            <div className="flex-1 min-w-[140px]">
              <Input
                type="date"
                placeholder="To date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="text-sm"
              />
            </div>
          </div>
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Job Posting Filter */}
          <div className="flex-1">
            <select
              value={jobPostingFilter}
              onChange={(e) => setJobPostingFilter(e.target.value)}
              className="w-full h-10 px-3 py-2 text-sm border border-gray-300 rounded-md bg-white text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            >
              <option value="all">All Job Postings</option>
              {uniqueJobPostings.map(posting => (
                <option key={posting} value={posting}>
                  {posting}
                </option>
              ))}
            </select>
          </div>
          
          {/* Status Filter Dropdown for Mobile */}
          <div className="flex-1 sm:hidden">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full h-10 px-3 py-2 text-sm border border-gray-300 rounded-md bg-white text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            >
              <option value="all">All Statuses</option>
              <option value="new">New</option>
              <option value="under review">Under Review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="assigned to client">Assigned to Client</option>
            </select>
          </div>
        </div>

        {/* Status Filter Buttons for Desktop */}
        <div className="hidden sm:flex items-center space-x-2 flex-wrap">
          {["all", "new", "under review", "approved", "rejected", "assigned to client"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                statusFilter === status
                  ? "bg-primary-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {status === "all" ? "All" : status.split(' ').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1)
              ).join(' ')}
              {status !== "all" && statusCounts[status.split(' ').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1)
              ).join(' ')] && (
                <span className="ml-1 text-xs">
                  ({statusCounts[status.split(' ').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                  ).join(' ')]})
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <motion.div layout className="space-y-4">
        {filteredApplications.map((application, index) => (
          <ApplicationItem
            key={application.Id}
            application={application}
            index={index}
            onViewDetail={handleViewDetail}
          />
        ))}
      </motion.div>

      {/* Empty States */}
      {filteredApplications.length === 0 && applications.length > 0 && (
        <div className="text-center py-12">
          <ApperIcon name="Filter" size={48} className="text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No applications match your filters
          </h3>
          <p className="text-gray-500 mb-4">
            Try adjusting your search criteria or clearing filters to see more results.
          </p>
          <Button onClick={clearFilters} variant="outline">
            Clear All Filters
          </Button>
        </div>
      )}

      {applications.length === 0 && (
        <Empty
          title="No applications yet"
          description="Applications will appear here once candidates start applying for job postings."
          icon="FileText"
        />
      )}
</div>
  );
};

export default ApplicationList;