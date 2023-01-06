import mongoose from "mongoose";

var productSchema = mongoose.Schema({
  // _id: mongoose.Schema.Types.ObjectId,
  product_type: String,
  product_tags: String,
  product_id: String,
  session: String,
  product_image: String,
  product_title: String,
  product_handle: String,
  product_query_id: String,
  created: { 
    type: Date,
    default: Date.now
  }
});

var productSchim = mongoose.model('product', productSchema);

export {productSchim};