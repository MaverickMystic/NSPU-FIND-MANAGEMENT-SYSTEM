import { createContext, useContext, useEffect, useState } from "react";
import supabase from "src/superbase";

// Define the shape of the context
type AuthContextType = {
  session: any | null;
  user: any | null;
  isloading: boolean;
  setUser: React.Dispatch<any>;
  setSession: React.Dispatch<any>;
};

// Create the context with default values
const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  isloading: true,
  setUser: () => {},
  setSession: () => {},
});

// Custom hook to use AuthContext
export const useAuthContext = () => useContext(AuthContext);

// Provider component
function AuthContextProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<any | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const [isloading, setIsloading] = useState<boolean>(true);

  useEffect(() => {
    //  Get initial session
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null); //  Safe access
      setIsloading(false);
    });

    //  Listen for auth state changes
    const { data: Listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null); // Safe access
      setIsloading(false);
    });

   
    return () => {
      Listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ session, user, isloading, setUser, setSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContextProvider;
