require("dotenv").config();
const mongoos = require("mongoose")
const products = require("../models/productSchema");
const jwt = require("jsonwebtoken");
const { joiProductSchema } = require("../models/validationSchema");
const Users = require("../models/UsersSchema");
const Order = require("../models/orderSchema");

module.exports = {
  // admin login

  login: async (req, res) => {
    const { email, password } = req.body;
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const toekn = jwt.sign(
        { email: email },
        process.env.ADMIN_ACCES_TOKEN_SECRET
      );
      return res.status(200).send({
        statu: "Succes",
        message: "Admin registratin succs full",
        data: toekn,
      });
    } else {
      return res.status(404).json({
        status: "error",
        message: "Thsi is no an admin🧐 ",
      });
    }
  },

  // finding all users

  allUsers: async (req, res) => {
    const allUsers = await Users.find();
    // console.log(allUsers);

    if (allUsers.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "Users not found",
      });
    }
    res.status(200).json({
      status: "Succesfull",
      message: "Succs fully fetched used data",
      data: allUsers,
    });
  },

  //View a specific user details by id

  useById: async (req, res) => {
    const userId = req.params.id;
    const user = await Users.findById(userId);
    // console.log(user);
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not fount",
      });
    }

    res.status(200).send({
      status: "Succes",
      message: "Succesfuly find user",
      data: user,
    });
  },

  ///View all the products by category

  allProducts: async (req, res) => {
    const prods = await products.find();
    if (!prods) {
      return (
        res.status(404),
        send({
          status: "error",
          message: "Products not fount",
        })
      );
    }
    res.status(200).json({
      status: "success",
      message: "Successfully fetched products detail.",
      data: prods,
    });
  },

  // Products by Id

  productsById: async (req, res) => {
    const producId = req.params.id;
    const product = await products.findById(producId);
    if (!product) {
      return res.status(404).send({
        status: "error",
        message: "Product not fount",
      });
    }
    res.status(200).json({
      status: "success",
      message: "Successfully fetched product details.",
      data: product,
    });
  },

  ///-> Create a product.

  creatProduct: async (req, res) => {
    // console.log(req.body);
    const { value, error } = joiProductSchema.validate(req.body);
    const { title, description, price, image, category } = value;
    // console.log(title);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
      //    return res.send(error.message)
    } else {
      await products.create({
        title,
        description,
        price,
        image,
        category,
      });

      res.status(201).json({
        status: "success",
        message: "Successfully Created products .",
        data: products,
      });
    }
  },

  // admin Delete a product

  // deleteProduct: async (req, res) => {
  //   const {producId} = req.body;
  //   console.log(producId)
  //   const product = products.findOneAndRemove({producId});
  //   // console.log("working or ")
  //   // console.log(product)
  //   if (!product) {
  //     return res
  //       .status(404)
  //       .json({ status: "failure", message: "product not found on database" });
  //   }
   
  //    res.status(404)
  //     .json({ status: "failure", message: "product not found on database" });
  // },

  deleteProduct: async (req, res) => {
    const { productId } = req.body;

    
    if (!productId || !mongoos.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({
            status: 'failure',
            message: 'Invalid productId provided',
        });
    }

   
        const deletedProduct = await products.findOneAndDelete({ _id: productId });

        if (!deletedProduct) {
            return res.status(404).json({
                status: 'failure',
                message: 'Product not found in the database',
            });
        }

        return res.status(200).json({
            status: 'success',
            message: 'Product deleted successfully',
        });
    
},
  // admin update product

  updateProduct: async (req, res) => {
    const { value, error } = joiProductSchema.validate(req.body);
    console.log(value);

    if (error) {
      return res.status(401).send({ message: error.details[0].message });
    }
    const { id, title, description, price, image, category } = value;

    const product = await products.find();
    if (!product) {
      return res
        .send(404)
        .json({ status: "Failear", message: "Producnt not fount in database" });
    }
    await products.findByIdAndUpdate(
      { _id: id },
      {
        title,
        description,
        price,
        image,
        category,
      }
    );
    res
      .status(201)
      .json({ status: "Success", message: "Product succes fully updated" });
  },

  // admin Order details

  orderDtails: async (req, res) => {
    const products = await Order.find();
    if (products.length === 0) {
      return res.status(200).json({
        message: "No products ",
      });
    }
    res.status(200).json({
      status: "Success",
      message: "Successfully fetched order details",
      products,
    });
  },
  //Total revenue generated

  status: async (req, res) => {
    const totalRevenue = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalProduct: { $sum: { $size: "$products" } },
          totalRevenue: { $sum: "$total_amount" },
        },
      },
    ]);

    if (totalRevenue.length > 0) {
      // You have results
      res.status(200).json({ status: "Success", data: totalRevenue[0] });
    } else {
      // No results found
      res
        .status(200)
        .json({
          status: "Success",
          data: { totalProduct: 0, totalRevenue: 0 },
        });
    }
  },
};
