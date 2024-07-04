import Product from "../model/product.js";

//controller to get list of all transactions
export const getTransactions = async (req, res) => {
  try {
    const { search, page = 1, perPage = 10 } = req.query;
    const query = {};
    if (search) {
      query.$or = [
        //$or operator id is to specify that we want to match documents where at least one of the conditions is true.
        { title: new RegExp(search, "i") }, //RegExp creates a regular expression from the search text. The i flag makes the search case-insensitive.
        { description: new RegExp(search, "i") },
        { price: parseFloat(search) }, //serch !== number ---> NaN
      ];
    }

    const result = await Product.aggregate([
      { $match: query }, //match query
      {
        $facet: {
          // for parallel operation
          transaction: [
            { $skip: (parseInt(page) - 1) * parseInt(perPage) }, // if page=2 (2-1)*10 it skip first 10 document
            { $limit: parseInt(perPage) },
          ],
          totalCount: [{ $count: "count" }],
        },
      },
    ]);
    const transaction = result[0].transaction;
    const totalCount =
      result[0].totalCount.length > 0 ? result[0].totalCount[0].count : 0;
    res.status(200).json({
      transaction,
      totalCount,
      page: parseInt(page),
      perPage: parseInt(perPage),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//controller to get statistics by month and year
export const getStatistics = async (req, res) => {
  try {
    const { year, month } = req.query;
    if (!year || !month) {
      return res.status(400).json({
        message: "year and month are required",
      });
    }

    const start_date = new Date(parseInt(year, 10), parseInt(month, 10) - 1, 1); //create new date object
    const end_date = new Date(parseInt(year, 10), parseInt(month, 10), 1);
    const result = await Product.aggregate([
      {
        $match: {
          dateOfSale: {
            $gte: start_date,
            $lt: end_date,
          },
        },
      },
      {
        $facet: {
          //$facet stage in an aggregation pipeline allows you to perform multiple independent aggregations within a single stage and output the result
          totalSaleAmount: [
            { $match: { sold: true } },
            {
              $group: {
                _id: null, // group by null
                totalAmount: { $sum: "$price" },
              },
            },
          ],
          totalSoldItems: [{ $match: { sold: true } }, { $count: "count" }],
          totalNotSoldItems: [{ $match: { sold: false } }, { $count: "count" }],
        },
      },
    ]);
    const totalSaleAmount = result[0].totalSaleAmount[0]?.totalAmount || 0;
    const totalSoldItems = result[0].totalSoldItems[0]?.count || 0;
    const totalNotSoldItems = result[0].totalNotSoldItems[0]?.count || 0;

    res.status(200).json({
      totalSaleAmount,
      totalSoldItems,
      totalNotSoldItems,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//controller for number of product in given price range for bar chart
export const number_of_product_in_price_range = async (req, res) => {
  try {
    const { month } = req.query;
    if (!month) {
      res.status(400).json({
        message: "month is required",
      });
    }
    const monthInt = parseInt(month, 10);
    const result = await Product.aggregate([
      {
        $match: {
          $expr: { $eq: [{ $month: "$dateOfSale" }, monthInt] },
        },
      },
      {
        $bucket: {
          // bucket used to group documents into buckets based on  ranges
          groupBy: "$price",
          boundaries: [0, 101, 201, 301, 401, 501, 601, 701, 801, 901], //price ranges
          default: "901-above",
          output: {
            count: { $sum: 1 },
          },
        },
      },
    ]);
    const priceRanges = [
      { range: "0-100", count: 0 },
      { range: "101-200", count: 0 },
      { range: "201-300", count: 0 },
      { range: "301-400", count: 0 },
      { range: "401-500", count: 0 },
      { range: "501-600", count: 0 },
      { range: "601-700", count: 0 },
      { range: "701-800", count: 0 },
      { range: "801-900", count: 0 },
      { range: "901-above", count: 0 },
    ];

    result.forEach((bucket) => {
      let label;
      if (bucket._id === "901-above") {
        label = "901-above";
      } else if (bucket._id === 0) {
        label = "0-100";
      } else {
        label = `${bucket._id}-${bucket._id + 99}`;
      }

      const range = priceRanges.find((r) => {
        return r.range === label;
      });
      if (range) {
        range.count = bucket.count;
      }
    });

    res.status(200).json({
      priceRanges,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getUniqueCategoryWithCount = async (req, res) => {
  try {
    const { month } = req.query;
    if (!month) {
      return res.status(400).json({
        message: "month is required",
      });
    }

    const monthInt = parseInt(month, 10);
    if (isNaN(monthInt) || monthInt < 1 || monthInt > 12) {
      return res.status(400).json({
        message: "month should be a valid number between 1 and 12",
      });
    }

    const result = await Product.aggregate([
      {
        $match: {
          $expr: { $eq: [{ $month: "$dateOfSale" }, monthInt] },
        },
      },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          count: 1,
        },
      },
    ]);

    res.status(200).json({
      categories: result,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
