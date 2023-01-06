import { join } from "path";
import { readFileSync } from "fs";
import express from "express";
import serveStatic from "serve-static";
import shopify from "./shopify.js";
import productCreator from "./product-creator.js";
import GDPRWebhookHandlers from "./gdpr.js";
import mongoose from "mongoose";
import { productSchim } from "./schemas/product.js";
import bodyParser from "body-parser";

const jsonParser = bodyParser.json();

const password = encodeURIComponent("*Nsl50tX[4D^j3h-");
const user = "mentisdev";
const host = "34.194.238.231"

let mongoURL = `mongodb://${user}:${password}@${host}/dev`;

mongoose.set('strictQuery', false);

mongoose.connect(mongoURL, (err, db) => {
  if (err) {
    console.error(
      "---> An error occured while connecting to MongoDB",
      err.message
    );
  } else {
    console.log("--> Connected to MongoDB");
  }
});


const PORT = parseInt(process.env.BACKEND_PORT || process.env.PORT, 10);

const STATIC_PATH =
  process.env.NODE_ENV === "production"
    ? `${process.cwd()}/frontend/dist`
    : `${process.cwd()}/frontend/`;

const app = express();

// Set up Shopify authentication and webhook handling
app.get(shopify.config.auth.path, shopify.auth.begin());
app.get(
  shopify.config.auth.callbackPath,
  shopify.auth.callback(),
  shopify.redirectToShopifyOrAppRoot()
);
app.post(
  shopify.config.webhooks.path,
  shopify.processWebhooks({ webhookHandlers: GDPRWebhookHandlers })
);

// All endpoints after this point will require an active session
app.use("/api/*", shopify.validateAuthenticatedSession());

app.use(express.json());

app.get("/api/products/all", async (_req, res) => {
  const allData = await shopify.api.rest.Product.all({
    session: res.locals.shopify.session,
  });
  res.status(200).send(allData);
});

app.put("/api/products/update", async (_req, res) => {
  try {
    console.log('res.locals.shopify.session :>> ', res.locals.shopify.session);
    const product = new shopify.api.rest.Product({session: res.locals.shopify.session});
    product.id = _req.body.id;
    product.tags = _req.body.tag;
    let response = await product.save({
      update: true,
    });
    console.log('product..................... :>> ', product);
    if(product) {
      let obj = {
        product_id: product.id,
        product_tags: product.tags,
        product_type: product.product_type,
        session: res.locals.shopify.session.id,
        product_image: product.image.src,
        product_title: product.title,
        product_handle: product.handle,
        product_query_id: product.admin_graphql_api_id
      }
      var productMong = new productSchim(obj);
      productMong.save(function (err, prod) {
        if (err) return console.error(err);
        console.log(prod.product_id + " saved to bookstore collection.");
      });
    }
    res.status(200).send(product);
  } catch (e) {
    console.log(`Failed to process products/save: ${e.message}`);
  }
});

app.get("/api/products/show", async(_req, res) => {
  try {
    const allProducts = await productSchim.find({ session: res.locals.shopify.session.id });
    let tagArray = [];
    let prodArray = [];
    let productQuery = [];
    if(allProducts && allProducts.length) {
      allProducts.forEach((prod,index) => {
        if(prod.product_query_id) {
          productQuery.push(prod.product_query_id);
        }
        if(!tagArray.includes(prod.product_tags)) {
          tagArray.push(prod.product_tags)
        }
      })
      tagArray.forEach((tag,i) => {
        let arr = [];
        allProducts.forEach((prod,index) => {
          if(tag === prod.product_tags) {
            arr.push(prod);
          }
        })
        prodArray.push(arr);
      })
    }
    // console.log('prodArray :>> ', prodArray);
    // console.log('tagArray :>> ', tagArray);
    console.log('productQuery ............................ ', productQuery);
    res.status(200).send({prodArray, productQuery});
  } catch (error) {
    console.log('error..... :>> ', error);
  }
})

app.delete("/api/products/delete", jsonParser, async(_req,res) => {
  // console.log('req.body :>> ', _req.body.id);
  try {
    const deleteProduct = await productSchim.deleteOne({ product_id: _req.body.id }).then((response) => {
      if(response.deletedCount == 1) {
        res.status(200).json({
          message: "product deleted successfully"
        })
      } else {
        res.status(400).json({
          message: "Record doesn't exist or already deleted"
        })
      }
    }).catch((error) => {
        console.log(error);
    })
  } catch (error) {
    console.log('error :>> ', error);
  }
})


app.use(serveStatic(STATIC_PATH, { index: false }));

app.use("/*", shopify.ensureInstalledOnShop(), async (_req, res, _next) => {
  return res
    .status(200)
    .set("Content-Type", "text/html")
    .send(readFileSync(join(STATIC_PATH, "index.html")));
});

app.listen(PORT);
