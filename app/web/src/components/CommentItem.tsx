import { useState, useContext } from "react";
import { AuthContext } from "@/features/auth/AuthProvider";
import { addComment } from "@/features/comments/comments.api";

export function CommentItem({ comment }: any) {
  const { session } = useContext(AuthContext);
  const [reply, setReply] = useState("");
  const [showReply, setShowReply] = useState(false);

  const handleReply = async () => {
    if (!reply) return;

    await addComment({
      poemId: comment.poem_id,
      userId: session.user.id,
      content: reply,
      parentId: comment.id,
    });

    setReply("");
    setShowReply(false);
  };

  return (
    <div className="mt-4">
      <div className="bg-[#121214] p-4 rounded-xl">
        <p className="text-sm text-[#F5F5F5]">{comment.profiles?.username}</p>

        <p className="text-[#A1A1AA] mt-2">{comment.content}</p>

        <button
          onClick={() => setShowReply(!showReply)}
          className="text-xs mt-2 text-[#D4AF37]"
        >
          Reply
        </button>

        {showReply && (
          <div className="mt-2">
            <input
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              className="w-full bg-black border border-[#2a2a2e] p-2 rounded"
              placeholder="Write a reply..."
            />
            <button
              onClick={handleReply}
              className="mt-2 text-sm text-[#D4AF37]"
            >
              Post
            </button>
          </div>
        )}
      </div>

      {/* Replies */}
      <div className="ml-6 border-l border-[#2a2a2e] pl-4">
        {comment.replies?.map((r: any) => (
          <CommentItem key={r.id} comment={r} />
        ))}
      </div>
    </div>
  );
}
