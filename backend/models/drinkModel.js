import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const DrinkSchema = new Schema ({
  name: { type: String, required: True },
  price: { type: Number, required: True },
});

export default DrinkSchema;