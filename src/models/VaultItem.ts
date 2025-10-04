// src/models/VaultItem.ts

import mongoose, { Schema, models, model, Document } from 'mongoose';

export interface IVaultItem extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  title: string;
  username: string;
  password: string;
  url: string;
  notes: string;
}

const VaultItemSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  url: { type: String },
  notes: { type: String },
}, { timestamps: true });

const VaultItem = models.VaultItem || model<IVaultItem>('VaultItem', VaultItemSchema);
export default VaultItem;



