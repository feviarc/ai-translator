// Importar dependencias.
import express from "express";
import dotenv from "dotenv";
import OpenAI from "openai";

const systemPrompt1 = "Eres un traductor profesional de multiples idiomas.";
const systemPrompt2 = "Solo puedes responder con una traducción directa del texto que el usuario te envíe."
                    + "Cualquier otra respuesta o conversación está prohibida";

// Cargar configuración del Environment.
dotenv.config();
const PORT = process.env.PORT || 3000;
const OPENAI_API_KEY =  process.env.OPENAI_API_KEY;

// Crear instancia de OpenAI y pasar el API Key.
const openai = new OpenAI({
   apiKey: OPENAI_API_KEY
});

// Cargar Express.
const app = express();

// Middleware para procesar lo que el usuario envía en el body a través de POST.
app.use(express.json()); // json
app.use(express.urlencoded({extended: true})); // x-www-form-urlencoded

// Servir frontend.
app.use("/", express.static("public"));

// Endpoint para OpenAI.
app.post('/api/translate', async (req, res) => {

   const {userText, targetLang} = req.body;
   const userPrompt = `Traduce el siguiente texto a ${targetLang}: ${userText}`;

   //Llamar al LLM o modelo de OpenAI.
   try {
      const completion = await openai.chat.completions.create({
         model: "gpt-3.5-turbo",
         messages: [
            {role: "system", content: systemPrompt1},
            {role: "system", content: systemPrompt2},
            {role: "user", content: userPrompt}
         ],
         max_tokens: 500,
         response_format: {type: "text"}
      });

      const translatedText = completion.choices[0].message.content;
      return res.status(200).json({translatedText});

   } catch(e) {
      return res.status(500).json({translatedText: 'No puedo traducir tu texto en este momento.'});
   }
});

// Servir el Backend.
app.listen(PORT, () => {
   console.log(`Servidor corriendo correctamente en http://localhost:${PORT}`);
});
