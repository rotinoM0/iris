import express from "express"
import cors from "cors"
import helmet from "helmet"
import routes from "./routes/index.js"
import errorHandler from "./middlewares/errorHandler.js"

const App = express()

App.use(helmet())
App.use(cors({
    origin(origin, cb) {
        const allowed = [
            "http://localhost:5173",
            "http://localhost:5000",
        ];
        if (!origin || allowed.includes(origin)) {
            cb(null, true);
        } else {
            const err = new Error("Origem não permitida");
            err.statusCode = 403;
            cb(err);
        }
    }
}))
App.use(express.json());

App.use("/api", routes)

App.use(errorHandler)
export default App