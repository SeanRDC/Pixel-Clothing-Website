import mongoose from 'mongoose';

const ItemSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, // e.g., 'iroha'
  name: { type: String, required: true },
  price: { type: Number, required: true },
  desc: { type: String, required: true },
  passive: { type: String, required: true },
  img: { type: String, required: true },
});

export default mongoose.models.Item || mongoose.model('Item', ItemSchema);