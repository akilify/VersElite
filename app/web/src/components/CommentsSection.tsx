import { useEffect, useState, useContext } from "react";
import { fetchComments, addComment } from "@/features/comments/comments.api";
import { buildCommentTree } from "@/utils/buildCommentTree";
import { CommentItem } from "./CommentItem";
import { AuthContext } from "@/features/auth/AuthProvider";

export function CommentsSection({ poemId }: any) {
  const { session } = useContext(AuthContext);
  const [comments, setComments] = useState<any[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    loadComments();
  }, []);

  const loadComments = async () => {
    const data = await fetchComments(poemId);
    setComments(buildCommentTree(data));
  };

  const handlePost = async () => {
    if (!input) return;

    await addComment({
      poemId,
      userId: session.user.id,
      content: input,
    });

    setInput("");
    loadComments();
  };

  return (
    <div className="mt-10">
      <h3 className="text-lg font-serif mb-4">Discussion</h3>

      {/* Add comment */}
      <div className="mb-6">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full bg-black border border-[#2a2a2e] p-3 rounded"
          placeholder="Write your thoughts..."
        />
        <button
          onClick={handlePost}
          className="mt-2 bg-[#D4AF37] text-black px-4 py-2 rounded"
        >
          Post
        </button>
      </div>

      {/* Thread */}
      {comments.map((c) => (
        <CommentItem key={c.id} comment={c} />
      ))}
    </div>
  );
}