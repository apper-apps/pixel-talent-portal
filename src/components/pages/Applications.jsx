import { Routes, Route } from "react-router-dom";
import { motion } from "framer-motion";
import ApplicationList from "@/components/organisms/ApplicationList";
import ApplicationDetail from "@/components/pages/ApplicationDetail";

const Applications = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <Routes>
        <Route index element={<ApplicationList />} />
        <Route path=":id" element={<ApplicationDetail />} />
      </Routes>
    </motion.div>
  );
};

export default Applications;