export function buildCommentTree(comments: any[]) {
  const map: any = {};
  const roots: any[] = [];

  comments.forEach((c) => {
    map[c.id] = { ...c, replies: [] };
  });

  comments.forEach((c) => {
    if (c.parent_id) {
      map[c.parent_id]?.replies.push(map[c.id]);
    } else {
      roots.push(map[c.id]);
    }
  });

  return roots;
}
