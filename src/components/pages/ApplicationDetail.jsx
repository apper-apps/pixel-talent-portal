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
import { notesService } from "@/services/api/notesService";

const ApplicationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newNote, setNewNote] = useState("");
  const [isAddingNote, setIsAddingNote] = useState(false);

  useEffect(() => {
    loadApplicationDetail();
  }, [id]);

  const loadApplicationDetail = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [applicationData, notesData] = await Promise.all([
        applicationService.getById(parseInt(id)),
        notesService.getByApplicationId(parseInt(id))
      ]);
      
      setApplication(applicationData);
      setNotes(notesData);
    } catch (err) {
      setError(err.message || "Failed to load application details");
      toast.error("Failed to load application details");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/applications");
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    
    try {
      setIsAddingNote(true);
      await applicationService.addNote(parseInt(id), {
        content: newNote,
        type: "Note"
      });
      setNewNote("");
      toast.success("Note added successfully");
      loadApplicationDetail();
    } catch (err) {
      toast.error("Failed to add note");
    } finally {
      setIsAddingNote(false);
    }
  };

  const getStatusVariant = (status) => {
    switch (status?.toLowerCase()) {
      case "new": return "default";
      case "under review": return "warning";
      case "approved": return "success";
      case "rejected": return "error";
      case "assigned to client": return "primary";
      default: return "default";
    }
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
              {application.candidateName}
            </h1>
            <p className="text-gray-600">
              Application for {application.appliedPosition}
            </p>
          </div>
        </div>
        <Badge variant={getStatusVariant(application.status)} size="lg">
          {application.status}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Application Details */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-lg border border-gray-200 p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <ApperIcon name="FileText" size={20} className="mr-2" />
              Application Details
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Candidate Name</label>
                <p className="text-gray-900 font-medium">{application.candidateName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <p className="text-gray-900">{application.candidateEmail}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Position Applied</label>
                <p className="text-gray-900">{application.appliedPosition}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Applied Date</label>
                <p className="text-gray-900">
                  {format(new Date(application.appliedDate), "MMM dd, yyyy 'at' h:mm a")}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Status</label>
                <div className="mt-1">
                  <Badge variant={getStatusVariant(application.status)}>
                    {application.status}
                  </Badge>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Notes Section */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-lg border border-gray-200 p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <ApperIcon name="MessageSquare" size={20} className="mr-2" />
              Notes ({notes.length})
            </h2>
            
            {/* Add Note */}
            <div className="mb-4">
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Add a note..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              />
              <Button
                onClick={handleAddNote}
                disabled={!newNote.trim() || isAddingNote}
                size="sm"
                className="mt-2 w-full"
              >
                {isAddingNote ? (
                  <>
                    <ApperIcon name="Loader2" size={14} className="mr-2 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <ApperIcon name="Plus" size={14} className="mr-2" />
                    Add Note
                  </>
                )}
              </Button>
            </div>

            {/* Notes List */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {notes.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-4">
                  No notes yet. Add the first one above.
                </p>
              ) : (
                notes.map((note) => (
                  <div key={note.Id} className="border border-gray-200 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-gray-600">
                        {note.author}
                      </span>
                      <span className="text-xs text-gray-500">
                        {format(new Date(note.createdAt), "MMM dd, h:mm a")}
                      </span>
                    </div>
                    <p className="text-sm text-gray-900">{note.content}</p>
                    {note.type && (
                      <Badge variant="outline" className="text-xs mt-2">
                        {note.type}
                      </Badge>
                    )}
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default ApplicationDetail;