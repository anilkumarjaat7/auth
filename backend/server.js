import config from "./src/config/config.js";
import dbConnect from "./src/config/database.js";
import app from "./src/app.js";


dbConnect();

app.listen(config.PORT, () => {
    console.log("Server is running on port 3000");
});