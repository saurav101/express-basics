const express = require("express");
const cookieParser = require("cookie-parser");
require("express-async-errors");
const cors = require("cors");
const connectDB = require("./config/db");
const productRoutes = require("./routes/product.route");
const authRoutes = require("./routes/auth.route");
const Product = require("./models/Product");
const Order = require("./models/order");
const stripe = require("stripe")(
  "sk_test_51QVUNBFYZdoxzDjJ04igkyJEXynllW96i5VUMfeelZ9skJnad4URiYCUxSL8ty1aTIa5nff2Vi1M02tZn5Nqcx2w00Sp0CZNzy"
);

const app = express();
const port = 3001;

connectDB();

app.use(express.static("uploads"));

app.use(cors());

app.use(cookieParser());

const endPointSecret =
  "whsec_eb7efee959b744ab1e6df306968ae3583f9254bb50b3bd4f67de1b94c08d1cd4";
app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (request, response) => {
    const signature = request.headers["stripe-signature"];
    const event = stripe.webhooks.constructEvent(
      request.body,
      signature,
      endPointSecret
    );
    switch (event.type) {
      case "checkout.session.completed":
        const { orderId } = event.data.object.metadata;
        await Order.updateOne({ _id: orderId }, { status: "completed" });
        break;
      default:
        console.log(`Unhandled event type ${event.type}.`);
    }
    response.send();
  }
);

app.use(express.json());

app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);

app.use((err, req, res, next) => {
  //save the error somewhere.
  console.log(err);
  res.status(500).json({
    message: "something went wrong",
  });
});
app.listen(port, () => {
  console.log(`example app listening to ${port}`);
});
