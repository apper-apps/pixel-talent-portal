import { createContext, useContext } from "react";
import { useSelector } from "react-redux";

const AuthContext = createContext({});

export const useAuth = () => {
  const userState = useSelector((state) => state.user);
  const context = useContext(AuthContext);
  
  return {
    user: userState?.user,
    isAuthenticated: userState?.isAuthenticated || false,
    loading: false, // ApperUI handles loading internally
    ...context
  };
};

export default AuthContext;
