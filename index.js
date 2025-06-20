const express = require ('express')
const dotenv = require ('dotenv')
const cors = require ('cors')
const { GoogleGenerativeAI } = require ('@google/generative-ai')
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())
app.use(express.static("public"))

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
const model = genAI.getGenerativeModel({model: process.env.MODEL})


app.post("/api/chat", async(req, res) => {
  const { userMessage } = req.body.message 
  
  if (!userMessage) {
    return res.status(400).json({ message: "Message is required" })
  }

  try {
    const result = await model.generateContent(userMessage)
    res.json({ message: result.response.text()})
    
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
})

app.listen(PORT, ()=> {
  console.log(`Server is running on port: ${PORT}`)
})