import { Auth } from "firebase-admin/lib/auth/auth";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { doc, getDoc, onSnapshot, Unsubscribe } from "firebase/firestore";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { auth, db } from "../firebase/client";
import { User } from "../types/user";

type ContextType = {
  fbUser: FirebaseUser | null | undefined;
  isLoading: boolean;
  user: User | null | undefined;
};

const AuthContext = createContext<ContextType>({
  fbUser: undefined,
  isLoading: true,
  user: undefined,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>();
  const [isLoading, setIsLoading] = useState(true);
  const [fbUser, setFbUser] = useState<FirebaseUser | null>();

  useEffect(() => {
    let unsubribe: Unsubscribe;

    onAuthStateChanged(auth, (resultUser) => {
      unsubribe?.();
      setFbUser(resultUser);

      if (resultUser) {
        setIsLoading(true);
        const ref = doc(db, `users/${resultUser.uid}`);
        unsubribe = onSnapshot(ref, (snap) => {
          setUser(snap.data() as User);
          setIsLoading(false);
        });
      } else {
        setUser(null);
        setIsLoading(false);
      }
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        fbUser,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
