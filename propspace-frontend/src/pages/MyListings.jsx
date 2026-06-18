import { useEffect, useState } from "react";
import { fetchMyListings, deleteProperty } from "../services/propertyService";
import PropertyCard from "../components/PropertyCard";

function MyListings() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadMyListings = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await fetchMyListings();
      setProperties(result);
    } catch (err) {
      setError(err.message || "Unable to load your listings.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (propertyId) => {
    if (!window.confirm("Delete this listing?")) {
      return;
    }

    try {
      await deleteProperty(propertyId);
      setProperties((prev) => prev.filter((item) => item._id !== propertyId));
    } catch (err) {
      setError(err.message || "Could not delete listing.");
    }
  };

  useEffect(() => {
    loadMyListings();
  }, []);

  return (
    <div className="my-listings-page">
      <div className="container">
        <header className="section-header">
          <h1>My Listings</h1>
          <p>Manage the properties you have posted to PropSpace.</p>
        </header>

        {loading ? (
          <p className="loading-state">Loading your listings...</p>
        ) : error ? (
          <p className="error-state">{error}</p>
        ) : properties.length === 0 ? (
          <p className="empty-state">No listings yet. Create one to get started.</p>
        ) : (
          <div className="property-grid">
            {properties.map((property) => (
              <PropertyCard key={property._id} property={property} onDelete={handleDelete} showEdit />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyListings;