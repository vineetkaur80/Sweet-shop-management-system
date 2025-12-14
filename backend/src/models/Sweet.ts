import mongoose, { Schema, Document } from 'mongoose';

export interface ISweet extends Document {
  name: string;
  category: string;
  price: number;
  quantity: number;
  image: string; // <--- Add this
}

const SweetSchema: Schema = new Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 0 }, image: { 
    type: String, 
    required: false, 
    default: 'https://placehold.co/400x300?text=No+Image' 
  }
});

export default mongoose.model<ISweet>('Sweet', SweetSchema);