import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  id: Number,
  title: String,
  description: String,
  price: Number,
  category: String,
  image: String,
  sold: Boolean,
  dateOfSale: Date,
});

const Product = mongoose.model("product", productSchema);
export default Product;
