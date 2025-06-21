# Dependências
from flask import session
import os
import google.generativeai as genai
from dotenv import load_dotenv

#region - Variáveis de ambiente
load_dotenv()  
my_api_key = os.environ.get("API_KEY")                        # Gemini - API_KEY
system_instruction = os.environ.get("SYSTEM_INSTRUCTIONS")    # Gemini - Instruções do Sistema / Informa as caracteristicas do Assistente.
ai_model = os.environ.get("GEMINI_MODEL")                     # Modelo de IA Google Gemini
#endregion

#region - Modelo Google Generative AI
generation_config = {
  "temperature": 1,
  "top_p": 0.95,
  "top_k": 64,
  "max_output_tokens": 8192,
  "response_mime_type": "text/plain",
}
safety_settings = [  
  {
    "category": "HARM_CATEGORY_HARASSMENT",
    "threshold": "BLOCK_LOW_AND_ABOVE"
  },
  {
    "category": "HARM_CATEGORY_HATE_SPEECH",
    "threshold": "BLOCK_LOW_AND_ABOVE"
  },
  {
    "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
    "threshold": "BLOCK_LOW_AND_ABOVE"
  },
  {
    "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
    "threshold": "BLOCK_LOW_AND_ABOVE"
  }
]
genai.configure(api_key=my_api_key)
model = genai.GenerativeModel(model_name=ai_model,
        generation_config=generation_config,
        system_instruction=system_instruction,
        safety_settings=safety_settings)
#endregion - Modelo Google Generative AI

# Interação com a Google Gemini API
def talk(userMessage):        
    # Inicia interação com Gemini AI
    try:
        convo = model.start_chat(history = [])              # Inicia chat
        convo.send_message(userMessage)                     # envia nova mensagem para ser processada pela IA
        bot_response = convo.last.text                      # Obtem resposta da IA
    except:
        bot_response = "error"

    response = {"status": "success", "message": bot_response}
    return response