// models/User.model.ts
import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';

interface IUser extends Document {
    userId: string;
    username: string;
    email: string;
    phone?: string;
    password: string;
}

const UserSchema: Schema<IUser> = new Schema({
    userId: { type: String, required: true },
    username: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    password: { type: String, required: true }
});

UserSchema.pre<IUser>('save', async function (next) {
    const user = this;
    if (!user.isModified('password')) return next();
    try {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        user.password = hashedPassword;
        next();
    } catch (error: any) {
        return next(error);
    }
});

const User = mongoose.model<IUser>('User', UserSchema);
export default User;
