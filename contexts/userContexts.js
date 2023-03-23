
import { createContext } from "react";
import { User } from "../const/user";

export const UserContext = createContext({
    user: null,
    setUser: () => {},
  });