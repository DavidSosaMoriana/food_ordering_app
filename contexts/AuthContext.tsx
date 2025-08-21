import LoadingScreen from "@/components/LoadingScreen";
import {
  signOut as appwriteSignOut,
  getCurrentUser,
  isUserLoggedIn,
} from "@/lib/appwrite";
import { User } from "@/type";
import { router } from "expo-router";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  signOut: () => Promise<void>;
  refetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const fetchUser = async () => {
    setIsLoading(true);
    try {
      const loggedIn = await isUserLoggedIn();
      setIsLoggedIn(loggedIn);

      if (loggedIn) {
        const currentUser = await getCurrentUser();
        setUser(currentUser as unknown as User);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      setUser(null);
      setIsLoggedIn(false);
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await appwriteSignOut();
      setUser(null);
      setIsLoggedIn(false);
      router.replace("/(auth)/sign-in");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const refetchUser = async () => {
    await fetchUser();
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // Handle navigation based on auth state
  useEffect(() => {
    if (!isLoading) {
      if (isLoggedIn && user) {
        // User is logged in, redirect to home if currently on auth pages
        const currentPath = router.canGoBack() ? undefined : "/(tabs)";
        if (currentPath) {
          router.replace(currentPath);
        }
      } else {
        // User is not logged in, redirect to sign-in
        router.replace("/(auth)/sign-in");
      }
    }
  }, [isLoading, isLoggedIn, user]);

  const contextValue: AuthContextType = {
    user,
    isLoading,
    isLoggedIn,
    signOut,
    refetchUser,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {isLoading ? <LoadingScreen /> : children}
    </AuthContext.Provider>
  );
};
