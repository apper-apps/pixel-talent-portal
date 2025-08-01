import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { format, parseISO } from 'date-fns';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import ApperIcon from '@/components/ApperIcon';
import Badge from '@/components/atoms/Badge';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import { assignmentService } from '@/services/api/assignmentService';

const Assignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [filteredAssignments, setFilteredAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [interviewFilter, setInterviewFilter] = useState('all');

  const loadAssignments = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await assignmentService.getAssignments();
      setAssignments(data);
      setFilteredAssignments(data);
    } catch (err) {
      setError(err.message || 'Failed to load assignments');
      toast.error('Failed to load assignments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssignments();
  }, []);

  useEffect(() => {
    let filtered = assignments;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(assignment =>
        assignment.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assignment.clientCompany.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assignment.clientContactPerson.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(assignment => assignment.status === statusFilter);
    }

    // Apply interview status filter
    if (interviewFilter !== 'all') {
      filtered = filtered.filter(assignment => assignment.interviewStatus === interviewFilter);
    }

    setFilteredAssignments(filtered);
  }, [assignments, searchTerm, statusFilter, interviewFilter]);

  const handleUpdateInterviewStatus = async (candidateId, newStatus) => {
    try {
      await assignmentService.updateInterviewStatus(candidateId, newStatus);
      toast.success(`Interview status updated to ${newStatus}`);
      loadAssignments();
    } catch (err) {
      toast.error('Failed to update interview status');
    }
  };

  const handleUnassignCandidate = async (candidateId, candidateName) => {
    if (!window.confirm(`Are you sure you want to unassign ${candidateName}? This action cannot be undone.`)) {
      return;
    }

    try {
      await assignmentService.unassignCandidate(candidateId, 'Unassigned from assignments page');
      toast.success(`${candidateName} has been unassigned successfully`);
      loadAssignments();
    } catch (err) {
      toast.error('Failed to unassign candidate');
    }
  };

  const getInterviewStatusBadge = (status) => {
    const statusConfig = {
      pending: { variant: 'secondary', icon: 'Clock' },
      scheduled: { variant: 'default', icon: 'Calendar' },
      completed: { variant: 'success', icon: 'CheckCircle' },
      failed: { variant: 'destructive', icon: 'XCircle' },
      cancelled: { variant: 'outline', icon: 'Ban' }
    };

    const config = statusConfig[status] || statusConfig.pending;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <ApperIcon name={config.icon} size={12} />
        {status}
      </Badge>
    );
  };

  const getAssignmentStatusBadge = (status) => {
    const statusConfig = {
      active: { variant: 'success', icon: 'CheckCircle' },
      pending: { variant: 'secondary', icon: 'Clock' },
      completed: { variant: 'default', icon: 'Check' },
      cancelled: { variant: 'destructive', icon: 'X' }
    };

    const config = statusConfig[status] || statusConfig.active;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <ApperIcon name={config.icon} size={12} />
        {status}
      </Badge>
    );
  };

  if (loading) return <Loading type="assignments" />;
  if (error) return <Error message={error} onRetry={loadAssignments} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Assignments</h1>
          <p className="text-gray-600">Manage candidate-client assignments and interview statuses</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={loadAssignments}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <ApperIcon name="RefreshCw" size={16} />
            Refresh
          </Button>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white p-4 rounded-lg border space-y-4 sm:space-y-0 sm:flex sm:items-center sm:gap-4"
      >
        <div className="flex-1">
          <Input
            placeholder="Search candidates or companies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="flex gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
          <select
            value={interviewFilter}
            onChange={(e) => setInterviewFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Interviews</option>
            <option value="pending">Pending</option>
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </motion.div>

      {/* Assignments Table */}
      {filteredAssignments.length === 0 ? (
        <Empty 
          message={searchTerm || statusFilter !== 'all' || interviewFilter !== 'all' 
            ? "No assignments match your filters" 
            : "No assignments found"
          }
          description={searchTerm || statusFilter !== 'all' || interviewFilter !== 'all'
            ? "Try adjusting your search or filter criteria"
            : "Assignments will appear here when candidates are assigned to clients"
          }
        />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg border overflow-hidden"
        >
          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Candidate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assigned Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Interview Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAssignments.map((assignment) => (
                  <tr key={assignment.Id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                            <ApperIcon name="User" size={20} className="text-primary-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {assignment.candidateName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {assignment.candidateEmail}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {assignment.clientCompany}
                      </div>
                      <div className="text-sm text-gray-500">
                        {assignment.clientContactPerson}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(parseISO(assignment.assignedAt), 'MMM dd, yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getAssignmentStatusBadge(assignment.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getInterviewStatusBadge(assignment.interviewStatus)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <select
                          value={assignment.interviewStatus}
                          onChange={(e) => handleUpdateInterviewStatus(assignment.candidateId, e.target.value)}
                          className="text-xs px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        >
                          <option value="pending">Pending</option>
                          <option value="scheduled">Scheduled</option>
                          <option value="completed">Completed</option>
                          <option value="failed">Failed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                        <Button
                          onClick={() => handleUnassignCandidate(assignment.candidateId, assignment.candidateName)}
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <ApperIcon name="UserX" size={14} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden divide-y divide-gray-200">
            {filteredAssignments.map((assignment) => (
              <div key={assignment.Id} className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                        <ApperIcon name="User" size={20} className="text-primary-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">
                        {assignment.candidateName}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {assignment.candidateEmail}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {getAssignmentStatusBadge(assignment.status)}
                    {getInterviewStatusBadge(assignment.interviewStatus)}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <ApperIcon name="Building2" size={16} className="mr-2 text-gray-400" />
                    <span className="font-medium">{assignment.clientCompany}</span>
                    <span className="mx-2">•</span>
                    <span>{assignment.clientContactPerson}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <ApperIcon name="Calendar" size={16} className="mr-2 text-gray-400" />
                    <span>Assigned {format(parseISO(assignment.assignedAt), 'MMM dd, yyyy')}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-2">
                  <select
                    value={assignment.interviewStatus}
                    onChange={(e) => handleUpdateInterviewStatus(assignment.candidateId, e.target.value)}
                    className="text-xs px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="pending">Pending</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="completed">Completed</option>
                    <option value="failed">Failed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <Button
                    onClick={() => handleUnassignCandidate(assignment.candidateId, assignment.candidateName)}
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 flex items-center gap-1"
                  >
                    <ApperIcon name="UserX" size={14} />
                    Unassign
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Stats Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white p-4 rounded-lg border"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-gray-900">{assignments.length}</div>
            <div className="text-sm text-gray-500">Total Assignments</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {assignments.filter(a => a.status === 'active').length}
            </div>
            <div className="text-sm text-gray-500">Active</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">
              {assignments.filter(a => a.interviewStatus === 'completed').length}
            </div>
            <div className="text-sm text-gray-500">Interviews Completed</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-600">
              {assignments.filter(a => a.interviewStatus === 'pending').length}
            </div>
            <div className="text-sm text-gray-500">Pending Interviews</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Assignments;