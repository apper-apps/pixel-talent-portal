import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();
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

  const handleAddClient = () => {
    setShowForm(true);
  };

  const handleFormSubmit = async (clientData) => {
    try {
      await clientService.create(clientData);
      toast.success("Client added successfully");
      setShowForm(false);
      loadClients();
    } catch (err) {
      toast.error("Failed to add client");
    }
};

  const handleClientClick = (clientId) => {
    navigate(`/clients/${clientId}`);
  };
  useEffect(() => {
    loadClients();
  }, []);

  // Client Form Component
  const ClientForm = ({ onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
      company: "",
      industry: "",
      contactPerson: "",
      email: "",
      status: "active"
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (field) => (e) => {
      setFormData(prev => ({
        ...prev,
        [field]: e.target.value
      }));
      if (errors[field]) {
        setErrors(prev => ({
          ...prev,
          [field]: ""
        }));
      }
    };

    const validateForm = () => {
      const newErrors = {};
      if (!formData.company.trim()) {
        newErrors.company = "Company name is required";
      }
      if (!formData.industry.trim()) {
        newErrors.industry = "Industry is required";
      }
      if (!formData.contactPerson.trim()) {
        newErrors.contactPerson = "Contact person is required";
      }
      if (!formData.email.trim()) {
        newErrors.email = "Email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = "Please enter a valid email address";
      }
      return newErrors;
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      const newErrors = validateForm();
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      setIsSubmitting(true);
      try {
        await onSubmit(formData);
      } finally {
        setIsSubmitting(false);
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Add New Client</h3>
              <button
                onClick={onCancel}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <ApperIcon name="X" size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name *
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={handleChange('company')}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    errors.company ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter company name"
                />
                {errors.company && (
                  <p className="text-sm text-red-600 mt-1">{errors.company}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Industry *
                </label>
                <input
                  type="text"
                  value={formData.industry}
                  onChange={handleChange('industry')}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    errors.industry ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter industry"
                />
                {errors.industry && (
                  <p className="text-sm text-red-600 mt-1">{errors.industry}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Person *
                </label>
                <input
                  type="text"
                  value={formData.contactPerson}
                  onChange={handleChange('contactPerson')}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    errors.contactPerson ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter contact person name"
                />
                {errors.contactPerson && (
                  <p className="text-sm text-red-600 mt-1">{errors.contactPerson}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={handleChange('email')}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter email address"
                />
                {errors.email && (
                  <p className="text-sm text-red-600 mt-1">{errors.email}</p>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onCancel}
                  className="flex-1 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 transition-colors"
                >
                  {isSubmitting ? "Adding..." : "Add Client"}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    );
  };

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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Client Companies</h2>
          <p className="text-gray-600 mt-1">{clients.length} active clients</p>
        </div>
        <button
          onClick={handleAddClient}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
        >
          <ApperIcon name="Plus" size={16} />
          Add Client
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clients.map((client, index) => (
<motion.div
            key={client.Id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -2, scale: 1.02 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg hover:border-primary-200 transition-all duration-200 cursor-pointer"
            onClick={() => handleClientClick(client.Id)}
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

      {showForm && (
        <ClientForm
          onSubmit={handleFormSubmit}
          onCancel={() => setShowForm(false)}
        />
      )}
    </motion.div>
  );
};

export default Clients;