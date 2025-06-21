# Importa bibliotecas
from flask import Flask, render_template, request, redirect, url_for, make_response, jsonify
import talkService as talkService
import os
from dotenv import load_dotenv
load_dotenv()  

app = Flask(__name__)

# Página inicial/Index
@app.route('/')
def home():
    return render_template('index.html')

# Solicitação de permissão de uso de microfone e câmera
@app.route('/devicePrompt')
def devicePrompt():
    return render_template('devicePrompt.html')

# Informação de bloqueio de uso de microfone e câmera - como desbloquear
@app.route('/deviceDenied')
def deviceDenied():
    return render_template('deviceDenied.html')

# Informação de erros referente ao uso de microfone e câmera
@app.route('/deviceError')
def deviceError():
    return render_template('deviceError.html')

# Informação de dispositivos não encontrados - microfone e câmera
@app.route('/deviceNotFound')
def deviceNotFound():
    return render_template('deviceNotFound.html') 

# Página de interação entre usuário e bot
@app.route('/interaction')
def interaction():   
    return render_template('interaction.html')   

# Troca de mensagens entre usuário e bot
@app.route('/talk', methods=['POST']) 
def talk():    
    # obtem dados da requisição - mensagem do usuário
    data = request.get_json()
    userMessage = data.get('message')    

    # Envia mensagem para Bot e aguarda respectiva resposta
    botResponse = talkService.talk(userMessage)
    
    # retorna ao Front com resposta do Bot
    return botResponse

if __name__ == '__main__':
    app.run(debug=True)

