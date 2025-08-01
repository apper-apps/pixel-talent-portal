import { motion } from "framer-motion";
import ApplicationList from "@/components/organisms/ApplicationList";

const Applications = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <ApplicationList />
    </motion.div>
  );
};

export default Applications;