import express from "express"
import cors from "cors"
import helmet from "helmet"
import routes from "./routes/index.js"
import errorHandler from "./middlewares/errorHandler.js"

const App = express()

App.use(helmet())
App.use(cors())
App.use(express.json());

App.use("/api", routes)

App.use(errorHandler)
export default App