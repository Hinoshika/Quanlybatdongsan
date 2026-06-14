require("dotenv").config();

const app = require("./src/app");

const PORT = process.env.PORT;

// middleware log
app.use((req, res, next) => {
    console.log(req.method, req.url);
    next();
});
app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});