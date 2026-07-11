export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  avatar: string | null;
};

export type AuthContextType = {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
  updateUser: (user: User | null) => void;
};
