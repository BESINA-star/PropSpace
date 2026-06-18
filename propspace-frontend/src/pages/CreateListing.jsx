import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProperty } from "../services/propertyService";

function CreateListing() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [propertyType, setPropertyType] = useState("Apartment");
  const [imageUrls, setImageUrls] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!title || !description || !price || !city || !country || !propertyType) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      await createProperty({
        title,
        description,
        price: Number(price),
        city,
        country,
        propertyType,
        imageUrls: imageUrls
          .split(",")
          .map((url) => url.trim())
          .filter(Boolean),
      });
      navigate("/my-listings");
    } catch (err) {
      setError(err.message || "Failed to create listing");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="listing-form-page">
      <h1>Create a new listing</h1>
      <form className="listing-form" onSubmit={handleSubmit}>
        <label>Title</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="House for sale" />

        <label>Description</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the property" />

        <label>Price</label>
        <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="200000" />

        <label>City</label>
        <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Nairobi" />

        <label>Country</label>
        <input value={country} onChange={(e) => setCountry(e.target.value)} placeholder="Kenya" />

        <label>Property type</label>
        <select value={propertyType} onChange={(e) => setPropertyType(e.target.value)}>
          <option>Apartment</option>
          <option>House</option>
          <option>Studio</option>
        </select>

        <label>Image URLs (comma-separated)</label>
        <input value={imageUrls} onChange={(e) => setImageUrls(e.target.value)} placeholder="https://... , https://..." />

        {error && <p className="form-error">{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Listing"}
        </button>
      </form>
    </div>
  );
}

export default CreateListing;
