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
import { applicationService } from "@/services/api/applicationService";
import { candidateService } from "@/services/api/candidateService";
import { clientService } from "@/services/api/clientService";

const ApplicationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
const [application, setApplication] = useState(null);
  const [candidate, setCandidate] = useState(null);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [assignmentLoading, setAssignmentLoading] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState("");
  const [showAssignmentDialog, setShowAssignmentDialog] = useState(false);

  const statusOptions = [
    { value: "New", label: "New", variant: "default" },
    { value: "Under Review", label: "Under Review", variant: "warning" },
    { value: "Approved", label: "Approved", variant: "success" },
    { value: "Rejected", label: "Rejected", variant: "error" },
    { value: "Assigned to Client", label: "Assigned to Client", variant: "primary" }
  ];
useEffect(() => {
    loadApplicationDetail();
    loadClients();
  }, [id]);

const loadApplicationDetail = async () => {
    try {
      setLoading(true);
      setError("");
      
      const applicationData = await applicationService.getById(parseInt(id));
      setApplication(applicationData);

      // Find candidate by matching email
      const allCandidates = await candidateService.getAll();
      const matchedCandidate = allCandidates.find(
        candidate => candidate.email === applicationData.candidateEmail
      );
      
      if (matchedCandidate) {
        setCandidate(matchedCandidate);
      }
    } catch (err) {
      setError(err.message || "Failed to load application details");
      toast.error("Failed to load application details");
    } finally {
      setLoading(false);
    }
  };

  const loadClients = async () => {
    try {
      const clientsData = await clientService.getAll();
      setClients(clientsData.filter(client => client.status === 'active'));
    } catch (err) {
      console.error("Failed to load clients:", err);
    }
  };
const handleStatusChange = async (newStatus) => {
    if (!application || newStatus === application.status) return;
    
    try {
      setStatusUpdating(true);
      const updates = {
        status: newStatus,
        statusHistory: [
          ...(application.statusHistory || []),
          {
            status: newStatus,
            changedAt: new Date().toISOString(),
            changedBy: "Current User" // In real app, this would be the logged-in user
          }
        ]
      };
      
      const updatedApplication = await applicationService.update(application.Id, updates);
      setApplication(updatedApplication);
      toast.success(`Application status updated to "${newStatus}"`);
    } catch (err) {
      toast.error("Failed to update application status");
    } finally {
      setStatusUpdating(false);
    }
};

  const handleAssignToClient = async () => {
    if (!selectedClientId || !candidate) return;
    
    try {
      setAssignmentLoading(true);
      await candidateService.assignToClient(candidate.Id, selectedClientId);
      
      // Reload candidate data to show updated assignment
      const updatedCandidate = await candidateService.getById(candidate.Id);
      setCandidate(updatedCandidate);
      
      const client = clients.find(c => c.Id === parseInt(selectedClientId));
      toast.success(`Successfully assigned ${candidate.name} to ${client?.company}`);
      
      setShowAssignmentDialog(false);
      setSelectedClientId("");
    } catch (err) {
      toast.error(err.message || "Failed to assign candidate");
    } finally {
      setAssignmentLoading(false);
    }
  };

  const handleUnassignCandidate = async () => {
    if (!candidate?.currentAssignment) return;
    
    try {
      setAssignmentLoading(true);
      await candidateService.unassignFromClient(candidate.Id, "Manual unassignment");
      
      // Reload candidate data
      const updatedCandidate = await candidateService.getById(candidate.Id);
      setCandidate(updatedCandidate);
      
      toast.success(`Successfully unassigned ${candidate.name}`);
    } catch (err) {
      toast.error(err.message || "Failed to unassign candidate");
    } finally {
      setAssignmentLoading(false);
    }
  };
const getStatusVariant = (status) => {
    switch (status) {
      case "New": return "default";
      case "Under Review": return "warning";
      case "Approved": return "success";
      case "Rejected": return "error";
      case "Assigned to Client": return "primary";
      // Backwards compatibility
      case "pending": return "warning";
      case "reviewed": return "warning";
      case "accepted": return "success";
      case "rejected": return "error";
      default: return "default";
    }
  };

const handleBack = () => {
    navigate("/applications");
  };
  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={loadApplicationDetail} />;
  }

  if (!application) {
    return <Error message="Application not found" onRetry={handleBack} />;
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
            <span>Back to Applications</span>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Application Details
            </h1>
            <p className="text-gray-600">
              Detailed view of {application.candidateName}'s application
            </p>
          </div>
        </div>
        <Badge variant={getStatusVariant(application.status)} size="lg">
          {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Application Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-lg border border-gray-200 p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <ApperIcon name="FileText" size={20} className="mr-2" />
              Application Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Position Applied For</label>
                <p className="text-gray-900 font-medium">{application.appliedPosition}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Application Date</label>
                <p className="text-gray-900">
                  {format(new Date(application.appliedDate), "MMMM dd, yyyy 'at' hh:mm a")}
                </p>
              </div>
<div>
                <label className="text-sm font-medium text-gray-500">Status</label>
                <div className="mt-1 flex items-center gap-3">
                  <Badge variant={getStatusVariant(application.status)}>
                    {application.status}
                  </Badge>
                  <div className="flex-1">
                    <select
                      value={application.status}
                      onChange={(e) => handleStatusChange(e.target.value)}
                      disabled={statusUpdating}
                      className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                      {statusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

{/* Candidate Information */}
          {candidate && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-lg border border-gray-200 p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <ApperIcon name="User" size={20} className="mr-2" />
                Candidate Profile
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Full Name</label>
                  <p className="text-gray-900 font-medium">{candidate.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Email Address</label>
                  <p className="text-gray-900">{candidate.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Experience Level</label>
                  <p className="text-gray-900">{candidate.experience}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Current Status</label>
                  <div className="mt-1">
                    <Badge variant={candidate.status === 'available' ? 'success' : 
                                  candidate.status === 'assigned' ? 'primary' :
                                  candidate.status === 'hired' ? 'primary' : 
                                  candidate.status === 'interviewing' ? 'warning' : 'default'}>
                      {candidate.status.charAt(0).toUpperCase() + candidate.status.slice(1)}
                    </Badge>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Assignment Management */}
          {candidate && application?.status === 'Approved' && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-lg border border-gray-200 p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <ApperIcon name="Building2" size={20} className="mr-2" />
                Client Assignment
              </h2>

              {/* Current Assignment */}
              {candidate.currentAssignment ? (
                <div className="bg-blue-50 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-blue-900 mb-1">Currently Assigned</h3>
                      <p className="text-blue-700">
                        {clients.find(c => c.Id === candidate.currentAssignment.clientId)?.company || 'Unknown Client'}
                      </p>
                      <p className="text-sm text-blue-600 mt-1">
                        Assigned on {format(new Date(candidate.currentAssignment.assignedAt), 'MMM d, yyyy')}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleUnassignCandidate}
                      disabled={assignmentLoading}
                      className="text-red-600 border-red-200 hover:bg-red-50"
                    >
                      {assignmentLoading ? (
                        <ApperIcon name="Loader2" size={16} className="animate-spin" />
                      ) : (
                        <>
                          <ApperIcon name="X" size={16} className="mr-1" />
                          Unassign
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <p className="text-gray-600 text-center">No current client assignment</p>
                </div>
              )}

              {/* Assignment Actions */}
              {!candidate.currentAssignment && candidate.status === 'available' && (
                <div className="space-y-4">
                  {!showAssignmentDialog ? (
                    <Button
                      onClick={() => setShowAssignmentDialog(true)}
                      className="w-full"
                    >
                      <ApperIcon name="Plus" size={16} className="mr-2" />
                      Assign to Client
                    </Button>
                  ) : (
                    <div className="space-y-4 border border-gray-200 rounded-lg p-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Select Client
                        </label>
                        <select
                          value={selectedClientId}
                          onChange={(e) => setSelectedClientId(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Choose a client...</option>
                          {clients.map(client => (
                            <option key={client.Id} value={client.Id}>
                              {client.company} - {client.industry}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          onClick={handleAssignToClient}
                          disabled={!selectedClientId || assignmentLoading}
                          className="flex-1"
                        >
                          {assignmentLoading ? (
                            <ApperIcon name="Loader2" size={16} className="mr-2 animate-spin" />
                          ) : (
                            <ApperIcon name="Check" size={16} className="mr-2" />
                          )}
                          Confirm Assignment
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setShowAssignmentDialog(false);
                            setSelectedClientId("");
                          }}
                          disabled={assignmentLoading}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Assignment History */}
              {candidate.assignmentHistory && candidate.assignmentHistory.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-medium text-gray-900 mb-3">Assignment History</h3>
                  <div className="space-y-3">
                    {candidate.assignmentHistory
                      .sort((a, b) => new Date(b.assignedAt) - new Date(a.assignedAt))
                      .map((assignment) => {
                        const client = clients.find(c => c.Id === assignment.clientId);
                        return (
                          <div key={assignment.Id} className="border border-gray-200 rounded-lg p-3">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium text-gray-900">
                                  {client?.company || 'Unknown Client'}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {format(new Date(assignment.assignedAt), 'MMM d, yyyy')}
                                  {assignment.endedAt && (
                                    <span> - {format(new Date(assignment.endedAt), 'MMM d, yyyy')}</span>
                                  )}
                                </p>
                              </div>
                              <Badge 
                                variant={assignment.status === 'assigned' ? 'primary' : 'default'}
                              >
                                {assignment.status === 'assigned' ? 'Active' : 'Completed'}
                              </Badge>
                            </div>
                            {assignment.endReason && (
                              <p className="text-sm text-gray-500 mt-1">
                                Reason: {assignment.endReason}
                              </p>
                            )}
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Skills */}
          {candidate && candidate.skills && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-lg border border-gray-200 p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <ApperIcon name="Award" size={18} className="mr-2" />
                Skills & Expertise
              </h3>
              <div className="flex flex-wrap gap-2">
                {candidate.skills.map((skill, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
            </motion.div>
          )}

          {/* Contact & Links */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg border border-gray-200 p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <ApperIcon name="ExternalLink" size={18} className="mr-2" />
              Resume & Portfolio
            </h3>
            <div className="space-y-3">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => toast.info("Resume download feature coming soon")}
              >
                <ApperIcon name="Download" size={16} className="mr-2" />
                Download Resume
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => toast.info("Portfolio link feature coming soon")}
              >
                <ApperIcon name="Globe" size={16} className="mr-2" />
                View Portfolio
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => window.open(`mailto:${application.candidateEmail}`, '_blank')}
              >
                <ApperIcon name="Mail" size={16} className="mr-2" />
                Send Email
              </Button>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-lg border border-gray-200 p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Button
                variant="primary"
                size="sm"
                className="w-full"
                onClick={() => toast.success("Interview scheduled successfully!")}
              >
                Schedule Interview
              </Button>
{/* Status History */}
              {application.statusHistory && application.statusHistory.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Status History</h3>
                  <div className="space-y-3">
                    {application.statusHistory.map((entry, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Badge variant={getStatusVariant(entry.status)} size="sm">
                            {entry.status}
                          </Badge>
                          <span className="text-sm text-gray-600">
                            Changed by {entry.changedBy}
                          </span>
                        </div>
                        <span className="text-sm text-gray-500">
                          {format(new Date(entry.changedAt), "MMM dd, yyyy 'at' HH:mm")}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Button
                variant="primary"
                size="sm"
                className="w-full"
                onClick={() => handleStatusChange("Approved")}
                disabled={statusUpdating || application.status === "Approved"}
              >
                {statusUpdating ? "Updating..." : "Quick Approve"}
              </Button>
              <Button
                variant="error"
                size="sm"
                className="w-full"
                onClick={() => handleStatusChange("Rejected")}
                disabled={statusUpdating || application.status === "Rejected"}
              >
                Reject Application
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default ApplicationDetail;