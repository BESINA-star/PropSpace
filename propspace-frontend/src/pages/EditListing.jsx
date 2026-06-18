import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { updateProperty } from "../services/propertyService";

function EditListing() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [propertyType, setPropertyType] = useState("Apartment");
  const [imageUrls, setImageUrls] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/properties/${id}`);
        if (!response.ok) {
          throw new Error("Property not found");
        }
        const data = await response.json();
        setTitle(data.title);
        setDescription(data.description);
        setPrice(data.price);
        setCity(data.city);
        setCountry(data.country);
        setPropertyType(data.propertyType);
        setImageUrls(data.imageUrls.join(", "));
      } catch (err) {
        setError(err.message || "Unable to load property.");
      }
    };

    fetchProperty();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!title || !description || !price || !city || !country || !propertyType) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      await updateProperty(id, {
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
      setError(err.message || "Failed to update listing");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="listing-form-page">
      <h1>Edit listing</h1>
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
          {loading ? "Updating..." : "Update Listing"}
        </button>
      </form>
    </div>
  );
}

export default EditListing;
