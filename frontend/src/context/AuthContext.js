import { createContext, useContext, useState, useEffect } from "react";
import usePublicAPI from "../hooks/usePublicApi";

export const AuthContext = createContext(null);

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const publicApi = usePublicAPI();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      const response = await publicApi.getCurrentUser();
      if (response.success) {
        setUser(response.data.user);
      } else {
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
