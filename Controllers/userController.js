const userService = require('../services/userService');

const updateBalance = async (req, res) => {
  const { userId, amount } = req.body;

  if (!Number.isSafeInteger(amount)) {
    return res.status(400).json({
      error: 'Invalid amount format',
      code: 'INVALID_INPUT'
    });
  }

  try {
    const start = Date.now();
    const balance = await userService.updateBalance(userId, amount);
    const duration = Date.now() - start;

    console.log(`Success: ${duration}ms`);
    return res.json({ balance });

  } catch (error) {
    console.error(`Failed: ${error.message}`);

    return res.status(400).json({
      error: error.message,
      code: error.message.includes('funds') ? 'INSUFFICIENT_FUNDS'
            : error.message.includes('User') ? 'USER_NOT_FOUND'
            : 'DATABASE_ERROR'
    });
  }
};

module.exports = { updateBalance };