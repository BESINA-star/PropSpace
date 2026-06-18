import { Link } from "react-router-dom";

function PropertyCard({ property, onDelete, showEdit }) {
  return (
    <article className="property-card">
      <div className="property-card__body">
        <h3>{property.title}</h3>
        <p className="property-card__type">{property.propertyType}</p>
        <p>{property.description}</p>
        <div className="property-card__meta">
          <span>{property.city}, {property.country}</span>
          <span>${property.price.toLocaleString()}</span>
        </div>
        <div className="property-card__footer">
          <span>Owner: {property.author?.username || "Unknown"}</span>
          {showEdit && (
            <>
              <Link to={`/edit-listing/${property._id}`} className="btn outline">
                Edit
              </Link>
              {onDelete && (
                <button className="btn outline" onClick={() => onDelete(property._id)}>
                  Delete
                </button>
              )}
            </>
          )}
          {onDelete && !showEdit && (
            <button className="btn outline" onClick={() => onDelete(property._id)}>
              Delete
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

export default PropertyCard;
