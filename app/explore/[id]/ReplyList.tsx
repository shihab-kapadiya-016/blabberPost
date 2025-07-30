import { ClientUser } from "@/features/userSlice";
import { IComment } from "@/models/comment";
import { IUser } from "@/models/user";
import { useEffect, useState } from "react";

interface ReplyListProps {
    parentId: string;
    allReplies: IComment[];
    commentAuthors: IUser[];
    currentUser: ClientUser | null;
    onDelete: (id: string) => void;
}

export default function ReplyList({
    parentId,
    allReplies,
    commentAuthors,
    currentUser,
    onDelete,
}: ReplyListProps) {
    const [replies, setReplies] = useState<IComment[]>([]);
    const [showReplies, setShowReplies] = useState(false);

    useEffect(() => {
        const filtered = allReplies.filter(
            (reply) => reply.parentId?.toString() === parentId
        );
        setReplies(filtered);
    }, [allReplies, parentId]);

    if (!replies.length) return null;

    return (
        <div className="ml-12 mt-4 space-y-4">
            {!showReplies ? (
                <button
                    onClick={() => setShowReplies(true)}
                    className="text-blue-600 text-sm hover:underline"
                >
                    View {replies.length} {replies.length === 1 ? "reply" : "replies"}
                </button>
            ) : (
                <>
                    <button
                        onClick={() => setShowReplies(false)}
                        className="text-blue-600 text-sm hover:underline"
                    >
                        Hide replies
                    </button>

                    {replies.map((reply) => {
                        const author = commentAuthors.find(
                            (a) => a._id === reply.authorId
                        );

                        return (
                            <div key={reply._id} className="flex items-start space-x-3">
                                {/* Avatar */}
                                <img
                                    src={author?.avatarUrl}
                                    className="w-8 h-8 rounded-full object-cover flex-shrink-0 mt-1"
                                    alt={author?.username}
                                />

                                {/* Reply content */}
                                <div className="flex-1">
                                    <div className="bg-muted rounded-2xl px-4 py-2 shadow-sm">
                                        <div className="flex items-center gap-2 text-sm font-medium mb-1">
                                            <span>{author?.username}</span>
                                            <span className="text-xs text-muted-foreground font-normal">
                                                @{author?.email?.split("@")[0]}
                                            </span>
                                        </div>

                                        <p className="text-sm leading-relaxed text-foreground">
                                            {reply.content}
                                        </p>
                                    </div>

                                    {/* Metadata and actions */}
                                    <div className="text-xs text-muted-foreground mt-1 flex gap-4 ml-1">
                                        <span>
                                            {new Date(reply.createdAt).toLocaleDateString()}
                                        </span>

                                        {author?.username === currentUser?.username && (
                                            <button
                                                onClick={() => onDelete(reply._id)}
                                                className="hover:text-red-600 transition"
                                            >
                                                Delete
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </>
            )}
        </div>
    );
}
