// A utility function to wrap async controller functions
// This avoids repeating the try-catch block in every controller function
const tryCatch = (controller) => async (req, res, next) => {
    try {
        await controller(req, res, next);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = tryCatch;
