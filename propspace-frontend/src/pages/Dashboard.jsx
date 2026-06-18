import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCurrentUser } from "../services/authService";
import { fetchMyListings } from "../services/propertyService";

function Dashboard() {
  const currentUser = getCurrentUser();
  const [listingCount, setListingCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadListingCount = async () => {
      setLoading(true);
      setError("");
      try {
        const listings = await fetchMyListings();
        setListingCount(listings.length);
      } catch (err) {
        setError(err.message || "Unable to load your listings.");
      } finally {
        setLoading(false);
      }
    };

    loadListingCount();
  }, []);

  return (
    <div className="dashboard-page">
      <div className="container">
        <header className="section-header">
          <h1>Welcome back, {currentUser?.username || "agent"}</h1>
          <p>Manage your account and property listings from one place.</p>
        </header>

        <div className="dashboard-grid">
          <div className="dashboard-card">
            <h2>Your active listings</h2>
            {loading ? (
              <p>Loading listing count…</p>
            ) : error ? (
              <p className="error-state">{error}</p>
            ) : (
              <p className="stat-value">{listingCount}</p>
            )}
            <Link to="/my-listings" className="btn outline">
              View my listings
            </Link>
          </div>

          <div className="dashboard-card">
            <h2>Quick actions</h2>
            <Link to="/create-listing" className="btn primary">
              Create new listing
            </Link>
            <Link to="/profile" className="btn outline" style={{ marginTop: "1rem" }}>
              Update profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
