import mongoose, { Document, Schema, model, models } from "mongoose";

export interface IComment extends Document {
    postId: mongoose.Types.ObjectId;
    content: string;
    authorId: mongoose.Types.ObjectId;
    parentId?: mongoose.Types.ObjectId | null;
    createdAt: Date;
    updatedAt: Date;
    _id: string
}

const commentSchema = new Schema<IComment>(
    {
        postId: {
            type: Schema.Types.ObjectId,
            ref: "Blog",
            required: true,
        },
        content: {
            type: String,
            required: true,
            trim: true,
        },
        authorId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        parentId: {
            type: Schema.Types.ObjectId,
            ref: "Comment",
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

const Comment = models.Comment || model<IComment>("Comment", commentSchema);
export default Comment;
