const z = require("zod");

module.exports = z.object({
  userId: z.string(),
  otp: z.string().length(5, "OTP must be 5 characters long"),
});
