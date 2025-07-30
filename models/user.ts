import mongoose, { Schema, Document, models } from 'mongoose';

export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    avatarUrl: string;
    bio: string;
    createdAt: Date
}

const UserSchema: Schema = new Schema(
    {
        username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 30,
        match: /^[a-zA-Z0-9_]+$/,
        },
        email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        },
        password: {
        type: String,
        required: true,
        minlength: 6,
        },
        avatarUrl: {
        type: String,
        required: true, // based on your interface
        },
        bio: {
        type: String,
        default: "",
        maxlength: 160,
        },
    },
    {
        timestamps: true,
    }
);

const User = models.User || mongoose.model<IUser>('User', UserSchema);
export default User;
