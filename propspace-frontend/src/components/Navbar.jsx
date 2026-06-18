import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCurrentUser, logoutUser } from "../services/authService";

function Navbar() {
  const [currentUser, setCurrentUser] = useState(getCurrentUser());
  const navigate = useNavigate();

  useEffect(() => {
    const handleStorage = () => setCurrentUser(getCurrentUser());
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const handleLogout = () => {
    logoutUser();
    setCurrentUser(null);
    navigate("/login");
  };

  return (
    <nav className="site-nav">
      <div className="nav-inner">
        <ul className="nav-links">
          <li>
            <Link to="/">Home</Link>
          </li>
          {currentUser ? (
            <>
              <li>
                <Link to="/dashboard">Dashboard</Link>
              </li>
              <li>
                <button className="btn ghost" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/register">Register</Link>
              </li>
            </>
          )}
        </ul>

        <div className="nav-brand">
          <Link to="/">PropSpace</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;