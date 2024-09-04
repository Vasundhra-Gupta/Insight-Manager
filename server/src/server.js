import dotenv from "dotenv";
dotenv.config({ path: "./src/config/.env" });
import { app } from "./app.js";

const PORT = process.env.PORT || 4000;


app.listen(PORT, () => console.log(`server is listening on port ${PORT}...`));