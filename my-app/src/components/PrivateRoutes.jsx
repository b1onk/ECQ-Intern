import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

function PrivateRoute({ children }) {
  const { sessionId, isLoading } = useAuth();

  if (isLoading) {
    // Bạn có thể thay bằng spinner hoặc skeleton UI tùy ý
    return <div>Loading...</div>;
  }

  return sessionId ? children : <Navigate to="/login" replace />;
}

export default PrivateRoute;
