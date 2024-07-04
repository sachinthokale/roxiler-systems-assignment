import express from "express";
import {
  getStatistics,
  getTransactions,
  getUniqueCategoryWithCount,
  number_of_product_in_price_range,
} from "../controllers/product.js";

export const productRoute = express.Router();
productRoute.route("/transactions").get(getTransactions);
productRoute.route("/statistics").get(getStatistics);
productRoute.route("/barchart").get(number_of_product_in_price_range);
productRoute.route("/piechart").get(getUniqueCategoryWithCount);
