const synth = window.speechSynthesis;
var recognitionAction;
var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;

recognition = new SpeechRecognition();
recognition.lang = "pt-BR";
recognition.continuous = true;      // Reconhecimento contínuo em loop
recognition.interimResults = false; // resultados parciais

var speakStatus=false;  // Speaking  on=true  off=false
var timestampParam;

// =======================================
// PENSAR
// =======================================

// Envia mensagem para backend interagir com a API de Inteligência Artificial.
async function talk(userMessage) {
    let botMessage;

    hideAllExceptClose();                       // Oculta elementos que estiverem visiveis na tela
    showElement("divSpinnerHourglass");         // Exibe Spinner indicando processo em andamento

    await fetch('/talk', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: userMessage })
    })
        .then(response => response.json())
        .then(data => {
            switch (data.status) {
                case 'success':
                    botMessage = data.message;                    
                    break;
                case 'error':
                    botMessage = "Erro na requisição";
                    break;
                default:
                    botMessage = "Resposta inesperada";
                    break;
            }
        });

    speak(botMessage);  // Reproduz mensagem de audio 
    console.log(botMessage);
}


// =======================================
// FALAR 
// =======================================

// Sintese de Fala - faz o dispositivo reproduzir uma mensagem através de seus autofalantes/fones
function speak(message) {
    message = removerEmojis(message);
    const utterThis = new SpeechSynthesisUtterance(message);
    utterThis.pitch = 2;
    utterThis.rate = 4;

    utterThis.onstart = function () {
        hideAllExceptClose();                   // Oculta elementos que estiverem visiveis na tela
        showElement("divSpinnerWaves");                
    };

    utterThis.onend = function () {        
        speakStatus=false;
        hideAllExceptClose();                   // Oculta elementos que estiverem visiveis na tela
        showElement("divSpinnerRipple");        // Exibe Spinner simulando ondulaçao de escuta 
        recognition.start();                    // Inicia o reconhecimento de voz 
        timestampParam = Date.now();       
    };

    recognition.stop();                         // Ao iniciar a fala (reprodução do audio) Interrompe o reconhecimento de voz
    speakStatus=true;                           // Speaking     on=true  off=false
    synth.speak(utterThis);                     // inicia a reprodução da mensagem    
}

// Remove emojis da mensagem, para que a mesma possa ser reproduzida via sintese de fala
function removerEmojis(texto) {
    return texto
        .replace(/\p{Emoji}/gu, '') // Remove emojis
        .replace(/\s+/g, ' ') // Remove espaços em branco extras
        .trim(); // Remove espaços em branco no início e no fim
}


// =======================================
// OUVIR
// =======================================

// Este evento é acionado quando o reconhecimento de voz captura um resultado
recognition.onresult = event => {    
    const transcript = event.results[event.resultIndex][0].transcript;    
    talk(transcript);           // Envia transcrição do audio falado pelo usuário para o backend processar junto à Inteligência Artificial e dar uma respectiva resposta
};

recognition.onstart = () => {    
    //showMessage('reconhecimento de voz iniciado.');
};

// Verifica se usuário não estiver falando (reproduzindo audio). Após 1 minuto de inatividade, interrrompe reconhecimento e exibe botão de pausa
recognition.onend = () => {
    if (speakStatus == false) {     
        timestampAtual = Date.now();
        var diferenca = timestampAtual - timestampParam;
        var minutosPassados = diferenca / (1000 * 60);
        if (minutosPassados < 1) {
            recognition.start(); // Inicia o reconhecimento de voz
        } else {
            hideAllExceptClose();
            showElement("divPauseStart");
        }
    }        
};

recognition.onerror = (event) => {
    showMessage('Erro:', event.error);
};