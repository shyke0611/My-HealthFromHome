import { createContext, useContext, useState, useEffect, useRef } from "react";
import usePublicAPI from "../hooks/usePublicApi";
import { setupAxiosInterceptors, refreshAccessToken } from "../services/http-service";

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
  const isFetchingRef = useRef(false);

  useEffect(() => {
    const fetchUser = async () => {
      if (isFetchingRef.current) return;
      isFetchingRef.current = true;
      try {
        let response = await publicApi.getCurrentUser();
        if (!response.success) {
          const refreshedToken = await refreshAccessToken();
          if (refreshedToken) {
            response = await publicApi.getCurrentUser();
          }
        }

        if (response.success) {
          setUser(response.data.user);
          setupAxiosInterceptors(setUser);
        } else {
          setUser(null);
        }
      } catch (error) {
        setUser(null);
      } finally {
        isFetchingRef.current = false;
        setLoading(false);
      }
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
