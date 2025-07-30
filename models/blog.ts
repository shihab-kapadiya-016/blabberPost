import mongoose, { Schema, Document, Types, models } from 'mongoose';

export interface IBlog extends Document {
    _id: string;
    title: string;
    content: string;
    tags?: string[];
    authorId: Types.ObjectId;
    coverImageUrl?: string;
    published: boolean;
    createdAt: Date;
    likes:  Types.ObjectId[],
}
const blogSchema: Schema = new Schema<IBlog>(
    {
        title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 150,
        },
        content: {
        type: String,
        required: true,
        },
        tags: [{
        type: String,
        trim: true,
        default: []
        }],
        authorId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        },
        coverImageUrl: {
        type: String,
        default: '',
        },
        published: {
        type: Boolean,
        default: false,
        },
        likes: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: []
        }]
    },
    {
        timestamps: true,
    }
);

const Blog = models.Blog || mongoose.model<IBlog>('Blog', blogSchema);
export default Blog;
