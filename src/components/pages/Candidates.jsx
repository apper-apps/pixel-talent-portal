import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import { candidateService } from "@/services/api/candidateService";

const Candidates = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadCandidates = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await candidateService.getAll();
      setCandidates(data);
    } catch (err) {
      setError("Failed to load candidates");
      toast.error("Failed to load candidates");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCandidates();
  }, []);

  if (loading) {
    return <Loading type="list" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadCandidates} />;
  }

const [activeView, setActiveView] = useState('pool');
  const [hiredCandidates, setHiredCandidates] = useState([]);
  const [hiredLoading, setHiredLoading] = useState(false);
  const [clients, setClients] = useState([]);

  useEffect(() => {
    if (activeView === 'hired') {
      loadHiredCandidates();
      loadClients();
    }
  }, [activeView]);

  async function loadHiredCandidates() {
    try {
      setHiredLoading(true);
      const hiredData = await candidateService.getHiredCandidates();
      setHiredCandidates(hiredData);
    } catch (error) {
      console.error('Error loading hired candidates:', error);
      toast.error('Failed to load hired candidates');
    } finally {
      setHiredLoading(false);
    }
  }

  async function loadClients() {
    try {
      const { clientService } = await import('@/services/api/clientService');
      const clientsData = await clientService.getAll();
      setClients(clientsData);
    } catch (error) {
      console.error('Error loading clients:', error);
    }
  }

  function getClientName(clientId) {
    const client = clients.find(c => c.Id === clientId);
    return client ? client.company : 'Unknown Client';
  }

  if (candidates.length === 0 && activeView === 'pool') {
    return (
      <Empty
        title="No Candidates Yet"
        message="Your candidate pool will appear here as applications come in."
        icon="Users"
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Candidates</h2>
        <p className="text-gray-600 mt-1">
          {activeView === 'pool' 
            ? `${candidates.length} total candidates` 
            : `${hiredCandidates.length} hired candidates`
          }
        </p>
      </div>

      {/* View Toggle */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveView('pool')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            activeView === 'pool'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center">
            <ApperIcon name="Users" size={16} className="mr-2" />
            Active Pool
          </div>
        </button>
        <button
          onClick={() => setActiveView('hired')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            activeView === 'hired'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center">
            <ApperIcon name="CheckCircle" size={16} className="mr-2" />
            Hired Candidates
          </div>
        </button>
      </div>

      {/* Active Pool View */}
      {activeView === 'pool' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Candidate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Skills
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Experience
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Contact
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {candidates.map((candidate, index) => (
                  <motion.tr
                    key={candidate.Id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-medium text-sm">
                            {candidate.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{candidate.name}</div>
                          <div className="text-sm text-gray-500">{candidate.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {candidate.skills.slice(0, 3).map((skill, i) => (
                          <Badge key={i} variant="primary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {candidate.skills.length > 3 && (
                          <Badge variant="default" className="text-xs">
                            +{candidate.skills.length - 3}
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{candidate.experience}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge 
                        variant={
                          candidate.status === "available" ? "success" :
                          candidate.status === "interviewing" ? "warning" : "default"
                        }
                      >
                        {candidate.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <ApperIcon name="Calendar" size={16} className="mr-1" />
                        {new Date(candidate.lastContact).toLocaleDateString()}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Hired Candidates View */}
      {activeView === 'hired' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {hiredLoading ? (
            <div className="p-8">
              <Loading />
            </div>
          ) : hiredCandidates.length === 0 ? (
            <div className="p-8">
              <Empty
                title="No Hired Candidates Yet"
                message="Hired candidates will appear here once placements are made."
                icon="CheckCircle"
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Candidate
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Position
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Client
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hire Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Experience
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {hiredCandidates.map((candidate, index) => (
                    <motion.tr
                      key={candidate.Id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center">
                            <ApperIcon name="CheckCircle" size={16} className="text-white" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{candidate.name}</div>
                            <div className="text-sm text-gray-500">{candidate.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 font-medium">{candidate.position}</div>
                        <div className="text-sm text-gray-500">
                          {candidate.skills.slice(0, 2).join(', ')}
                          {candidate.skills.length > 2 && '...'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <ApperIcon name="Building" size={16} className="text-gray-400 mr-2" />
                          <div className="text-sm text-gray-900">{getClientName(candidate.clientId)}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <ApperIcon name="Calendar" size={16} className="text-gray-400 mr-2" />
                          <div className="text-sm text-gray-900">
                            {new Date(candidate.hireDate).toLocaleDateString()}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant="success" className="text-xs">
                          {candidate.experience}
                        </Badge>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default Candidates;