export const errorHandler = (err, req, res, next) => {
  console.error("Unhandled error:", err.stack || err.message);
  res.status(500).json({ error: "Internal server error" });
};
