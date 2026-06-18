import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchProperties } from "../services/propertyService";
import PropertyCard from "../components/PropertyCard";

function Home() {
  const [properties, setProperties] = useState([]);
  const [query, setQuery] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadProperties = async (citySearch = "", min = "", max = "") => {
    setLoading(true);
    setError("");
    try {
      const result = await fetchProperties({
        city: citySearch,
        minPrice: min,
        maxPrice: max,
      });
      setProperties(result);
    } catch (err) {
      setError(err.message || "Could not load properties.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProperties();
  }, []);

  const handleSearch = (event) => {
    event.preventDefault();
    loadProperties(query.trim(), minPrice, maxPrice);
  };

  return (
    <div className="home-page">
      <div className="home-content hero-content">
        <header className="hero-copy">
          <h1>Find your dream home</h1>
          <p className="hero-sub">
            Discover professionally curated listings and find your perfect property with PropSpace.
          </p>

          <div className="hero-actions">
            <form className="search-box" onSubmit={handleSearch}>
              <input
                className="search-input"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search city, neighbourhood, or ZIP"
              />
              <button className="btn primary" type="submit">
                Search
              </button>
            </form>
            <Link to="/create-listing" className="btn outline">
              List your property
            </Link>
          </div>
        </header>
      </div>

      <section className="listing-section">
        <div className="container">
          <div className="section-header">
            <h2>Featured listings</h2>
            <p>Browse the latest homes added by trusted property owners.</p>
          </div>

          <div className="filter-bar">
            <input
              type="number"
              placeholder="Min price"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
            <input
              type="number"
              placeholder="Max price"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
            <button className="btn primary" onClick={handleSearch}>
              Filter
            </button>
          </div>

          {loading ? (
            <p className="loading-state">Loading listings...</p>
          ) : error ? (
            <p className="error-state">{error}</p>
          ) : properties.length === 0 ? (
            <p className="empty-state">No listings found. Try a broader search.</p>
          ) : (
            <div className="property-grid">
              {properties.map((property) => (
                <PropertyCard key={property._id} property={property} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Home;