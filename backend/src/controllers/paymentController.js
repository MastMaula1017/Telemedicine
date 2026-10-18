// Simple internal payment controller without external Razorpay dependencies

const createOrder = async (req, res) => {
    try {
        const { amount } = req.body;
        return res.status(200).json({
            success: true,
            order: {
                id: `ORD_${Date.now()}`,
                amount: amount || 0,
                currency: "INR",
                status: "created"
            }
        });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

const verifyPayment = async (req, res) => {
    return res.status(200).json({ success: true, message: "Payment verified" });
};

module.exports = {
    createOrder,
    verifyPayment
};
