import mongoose, { Schema, Document } from 'mongoose';

export interface IOrder extends Document {
  user: mongoose.Types.ObjectId;
  items: Array<{
    sweet: mongoose.Types.ObjectId; // Reference to Sweet
    name: string; // Snapshot of name in case it changes
    quantity: number;
    price: number; // Snapshot of price at time of purchase
  }>;
  totalAmount: number;
  createdAt: Date;
}

const OrderSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      sweet: { type: Schema.Types.ObjectId, ref: 'Sweet' },
      name: String,
      quantity: Number,
      price: Number,
    }
  ],
  totalAmount: { type: Number, required: true },
}, { timestamps: true });

export default mongoose.model<IOrder>('Order', OrderSchema);