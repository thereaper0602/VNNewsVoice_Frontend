import { useContext } from "react";
import { AppContext } from "../contexts/AppContext";
import { useNavigate } from "react-router-dom";

export function RequireAuth({ children }) {
  const { isAuthenticated } = useContext(AppContext);
  const nav = useNavigate();
  return isAuthenticated ? children : nav('/login');
}
