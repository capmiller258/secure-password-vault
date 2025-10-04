import { Schema, models, model, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  passwordHash: string;
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
}, { timestamps: true });

const User = models.User || model<IUser>('User', UserSchema);
export default User;

