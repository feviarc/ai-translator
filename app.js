import express from "express";
import dotenv from "dotenv";
import OpenAI from "openai";

const systemPrompt1 = "Eres un traductor profesional de multiples idiomas, solo puedes responder con una traducción directa del texto que el usuario te envíe.";
const systemPrompt2 = "Si el usuario te escribe en un idioma y te pide la traducción hacia ese mismo idioma, entonces dile al usuario que elija otro idioma de destino. Cualquier otra respuesta o conversación está prohibida.";

dotenv.config();
const PORT = process.env.PORT || 3000;
const OPENAI_API_KEY =  process.env.OPENAI_API_KEY;

const openai = new OpenAI({
   apiKey: OPENAI_API_KEY
});

const app = express();

app.use(express.json()); // json
app.use(express.urlencoded({extended: true})); // x-www-form-urlencoded

app.use("/", express.static("public"));

app.post('/api/translate', async (req, res) => {

   console.log(req.body);
   const {textToTranslate, targetLang} = req.body;
   const userPrompt = `Traduce el siguiente texto a ${targetLang}: ${textToTranslate}`;

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

app.listen(PORT, () => {
   console.log(`Servidor corriendo correctamente en http://localhost:${PORT}`);
});
