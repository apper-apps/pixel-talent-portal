import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { clientService } from "@/services/api/clientService";
import { candidateService } from "@/services/api/candidateService";
import { applicationService } from "@/services/api/applicationService";

const ClientDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusUpdating, setStatusUpdating] = useState({});

const interviewStatusOptions = [
    { value: "Pending Interview", label: "Pending Interview", variant: "default" },
    { value: "Interviewed", label: "Interviewed", variant: "primary" },
    { value: "Offer Extended", label: "Offer Extended", variant: "warning" },
    { value: "Hired", label: "Hired", variant: "success" },
    { value: "Not Selected", label: "Not Selected", variant: "error" }
  ];

  useEffect(() => {
    loadClientDetail();
  }, [id]);

  const loadClientDetail = async () => {
    try {
      setLoading(true);
      setError("");
      
      // Load client information
      const clientData = await clientService.getById(parseInt(id));
      setClient(clientData);

      // Load assigned candidates
      const assignedCandidates = await candidateService.getAssignedCandidates(parseInt(id));
      setCandidates(assignedCandidates);

      // Load applications for assigned candidates
      const allApplications = await applicationService.getAll();
      const candidateApplications = allApplications.filter(app => 
        assignedCandidates.some(candidate => candidate.email === app.candidateEmail)
      );
      setApplications(candidateApplications);

    } catch (err) {
      setError(err.message || "Failed to load client details");
      toast.error("Failed to load client details");
    } finally {
      setLoading(false);
    }
  };

const handleInterviewStatusChange = async (candidateId, newStatus) => {
    try {
      setStatusUpdating(prev => ({ ...prev, [candidateId]: true }));
      
      await candidateService.updateInterviewStatus(candidateId, newStatus);
      
      // Update local state
      setCandidates(prev => prev.map(candidate => 
        candidate.Id === candidateId 
          ? { ...candidate, interviewStatus: newStatus }
          : candidate
      ));
      
      toast.success(`Interview status updated to "${newStatus}"`);
      
    } catch (err) {
      toast.error("Failed to update interview status");
    } finally {
      setStatusUpdating(prev => ({ ...prev, [candidateId]: false }));
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case "available": return "success";
      case "assigned": return "primary";
      case "hired": return "primary";
      case "interviewing": return "warning";
      case "unavailable": return "error";
      default: return "default";
    }
  };

  const getApplicationStatus = (candidateEmail) => {
    const application = applications.find(app => app.candidateEmail === candidateEmail);
    return application?.status || "No Application";
  };

  const getApplicationStatusVariant = (status) => {
    switch (status) {
      case "New": return "default";
      case "Under Review": return "warning";
      case "Approved": return "success";
      case "Rejected": return "error";
      case "Assigned to Client": return "primary";
      default: return "default";
    }
  };

  const handleBack = () => {
    navigate("/clients");
  };

  const handleViewApplication = (candidateEmail) => {
    const application = applications.find(app => app.candidateEmail === candidateEmail);
    if (application) {
      navigate(`/applications/${application.Id}`);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={loadClientDetail} />;
  }

  if (!client) {
    return <Error message="Client not found" onRetry={handleBack} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleBack}
            className="flex items-center space-x-2"
          >
            <ApperIcon name="ArrowLeft" size={16} />
            <span>Back to Clients</span>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {client.company}
            </h1>
            <p className="text-gray-600">
              Client Details & Assigned Candidates
            </p>
          </div>
        </div>
        <Badge variant={client.status === 'active' ? 'success' : 'error'} size="lg">
          {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Client Information */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-lg border border-gray-200 p-6 sticky top-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <ApperIcon name="Building2" size={20} className="mr-2" />
              Client Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Company</label>
                <p className="text-gray-900 font-medium">{client.company}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Industry</label>
                <p className="text-gray-900">{client.industry}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Contact Person</label>
                <p className="text-gray-900">{client.contactPerson}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <p className="text-gray-900">{client.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Active Positions</label>
                <p className="text-gray-900 font-medium">{client.activePositions}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Last Contact</label>
                <p className="text-gray-900">
                  {format(new Date(client.lastContact), "MMM dd, yyyy")}
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="font-medium text-gray-900 mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => window.open(`mailto:${client.email}`, '_blank')}
                >
                  <ApperIcon name="Mail" size={16} className="mr-2" />
                  Send Email
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => toast.info("Schedule meeting feature coming soon")}
                >
                  <ApperIcon name="Calendar" size={16} className="mr-2" />
                  Schedule Meeting
                </Button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Assigned Candidates */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-lg border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <ApperIcon name="Users" size={20} className="mr-2" />
                Assigned Candidates ({candidates.length})
              </h2>
            </div>

            {candidates.length === 0 ? (
              <Empty 
                message="No candidates assigned to this client yet"
                actionText="View All Candidates"
                onAction={() => navigate("/candidates")}
              />
            ) : (
              <div className="space-y-4">
                {candidates.map((candidate, index) => {
                  const applicationStatus = getApplicationStatus(candidate.email);
                  const isUpdating = statusUpdating[candidate.Id];

                  return (
                    <motion.div
                      key={candidate.Id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <h3 className="text-lg font-medium text-gray-900">
                              {candidate.name}
                            </h3>
                            <Badge variant={getStatusVariant(candidate.status)}>
                              {candidate.status.charAt(0).toUpperCase() + candidate.status.slice(1)}
                            </Badge>
                            <Badge variant={getApplicationStatusVariant(applicationStatus)}>
                              {applicationStatus}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <label className="text-sm font-medium text-gray-500">Email</label>
                              <p className="text-gray-900 text-sm">{candidate.email}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-500">Experience</label>
                              <p className="text-gray-900 text-sm">{candidate.experience}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-500">Assigned Date</label>
                              <p className="text-gray-900 text-sm">
                                {candidate.currentAssignment && 
                                  format(new Date(candidate.currentAssignment.assignedAt), "MMM dd, yyyy")}
                              </p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-500">Last Contact</label>
                              <p className="text-gray-900 text-sm">
                                {format(new Date(candidate.lastContact), "MMM dd, yyyy")}
                              </p>
                            </div>
                          </div>

                          {/* Skills */}
                          {candidate.skills && candidate.skills.length > 0 && (
                            <div className="mb-4">
                              <label className="text-sm font-medium text-gray-500 block mb-2">Skills</label>
                              <div className="flex flex-wrap gap-1">
                                {candidate.skills.slice(0, 5).map((skill, skillIndex) => (
                                  <Badge key={skillIndex} variant="outline" className="text-xs">
                                    {skill}
                                  </Badge>
                                ))}
                                {candidate.skills.length > 5 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{candidate.skills.length - 5} more
                                  </Badge>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Interview Status Management */}
<div className="flex items-center space-x-4">
                            <div className="flex-1">
                              <label className="text-sm font-medium text-gray-500 block mb-1">
                                Interview Status
                              </label>
                              <select
                                value={candidate.interviewStatus || "Pending Interview"}
                                onChange={(e) => handleInterviewStatusChange(candidate.Id, e.target.value)}
                                disabled={isUpdating}
                                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100"
                              >
                                {interviewStatusOptions.map((option) => (
                                  <option key={option.value} value={option.value}>
                                    {option.label}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col space-y-2 ml-4">
                          {applications.find(app => app.candidateEmail === candidate.email) && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewApplication(candidate.email)}
                              className="text-xs"
                            >
                              <ApperIcon name="FileText" size={14} className="mr-1" />
                              View App
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(`mailto:${candidate.email}`, '_blank')}
                            className="text-xs"
                          >
                            <ApperIcon name="Mail" size={14} className="mr-1" />
                            Email
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toast.info("Schedule interview feature coming soon")}
                            className="text-xs"
                          >
                            <ApperIcon name="Calendar" size={14} className="mr-1" />
                            Schedule
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default ClientDetail;