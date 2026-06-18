const Property = require("../models/Property");

const createProperty = async (req, res) => {
  const { title, description, price, city, country, propertyType, imageUrls } = req.body;

  if (!title || !description || !price || !city || !country || !propertyType) {
    return res.status(400).json({ message: "All required property fields must be provided" });
  }

  const property = await Property.create({
    title,
    description,
    price,
    city,
    country,
    propertyType,
    imageUrls: Array.isArray(imageUrls) ? imageUrls : [],
    author: req.user.id,
  });

  res.status(201).json(property);
};

const getProperties = async (req, res) => {
  const { city, minPrice, maxPrice, author } = req.query;
  const filter = {};

  if (city) {
    filter.city = { $regex: new RegExp(city, "i") };
  }

  if (author) {
    filter.author = author;
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    filter.price = {};
    if (minPrice !== undefined) filter.price.$gte = Number(minPrice);
    if (maxPrice !== undefined) filter.price.$lte = Number(maxPrice);
  }

  const properties = await Property.find(filter).populate("author", "username email");
  res.status(200).json(properties);
};

const getPropertyById = async (req, res) => {
  const property = await Property.findById(req.params.id).populate("author", "username email");
  if (!property) {
    return res.status(404).json({ message: "Property not found" });
  }
  res.status(200).json(property);
};

const updateProperty = async (req, res) => {
  const property = await Property.findById(req.params.id);
  if (!property) {
    return res.status(404).json({ message: "Property not found" });
  }

  if (property.author.toString() !== req.user.id) {
    return res.status(403).json({ message: "You are not authorized to update this property" });
  }

  const updates = ["title", "description", "price", "city", "country", "propertyType", "imageUrls"];
  updates.forEach((field) => {
    if (req.body[field] !== undefined) {
      property[field] = req.body[field];
    }
  });

  await property.save();
  res.status(200).json(property);
};

const deleteProperty = async (req, res) => {
  const property = await Property.findById(req.params.id);
  if (!property) {
    return res.status(404).json({ message: "Property not found" });
  }

  if (property.author.toString() !== req.user.id) {
    return res.status(403).json({ message: "You are not authorized to delete this property" });
  }

  await property.deleteOne();
  res.status(200).json({ message: "Property deleted successfully" });
};

module.exports = {
  createProperty,
  getProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
};
