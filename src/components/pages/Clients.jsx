import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import { clientService } from "@/services/api/clientService";

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadClients = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await clientService.getAll();
      setClients(data);
    } catch (err) {
      setError("Failed to load clients");
      toast.error("Failed to load clients");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClients();
  }, []);

  if (loading) {
    return <Loading type="cards" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadClients} />;
  }

  if (clients.length === 0) {
    return (
      <Empty
        title="No Clients Yet"
        message="Client companies will appear here as you expand your recruitment network."
        icon="Building2"
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
        <h2 className="text-2xl font-bold text-gray-900">Client Companies</h2>
        <p className="text-gray-600 mt-1">{clients.length} active clients</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clients.map((client, index) => (
          <motion.div
            key={client.Id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -2, scale: 1.02 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg hover:border-primary-200 transition-all duration-200"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
                  <ApperIcon name="Building2" size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{client.company}</h3>
                  <p className="text-sm text-gray-500">{client.industry}</p>
                </div>
              </div>
              <Badge 
                variant={client.status === "active" ? "success" : "default"}
              >
                {client.status}
              </Badge>
            </div>

            <div className="space-y-3">
              <div className="flex items-center text-sm text-gray-600">
                <ApperIcon name="User" size={16} className="mr-2" />
                <span>{client.contactPerson}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <ApperIcon name="Mail" size={16} className="mr-2" />
                <span>{client.email}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <ApperIcon name="Briefcase" size={16} className="mr-2" />
                <span>{client.activePositions} active positions</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Last contact</span>
                <span className="text-gray-700">
                  {new Date(client.lastContact).toLocaleDateString()}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Clients;