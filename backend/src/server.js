import App from "./app.js"
import connectDB from "./config/database.js"

const PORT = process.env.PORT || 5000;
await connectDB();

App.listen(PORT, () => console.log(`servidor ativo em ${PORT}`))

export default App;