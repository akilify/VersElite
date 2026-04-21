export const createPaymentIntent = (req, res) => {
  // We'll implement Stripe or Paystack integration later
  res.status(501).json({ message: "Payment endpoint not yet implemented" });
};
