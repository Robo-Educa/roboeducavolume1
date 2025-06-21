/**
 * Verifica se existe permissão para uso dos dispositivos de mídia (microfone e/ou câmera)
 *
 * @async
 * @param {string} device - Tipo do dispositivo: 'microphone' OR 'camera'.
 * @returns {Promise<Object>} - Status atual da permissão: 'granted', 'prompt', 'denied' ou 'notFound'.
 */
async function devices_getStatusPermission(device) {
    let permission;
    await navigator.permissions
        .query({ name: device })
        .then(function (result) { permission = result.state; })
        .catch(function (error) { permission = "notFound"; });
    return permission;
}

/**
 * Solicita permissão para uso de Microfone
 *
 * @async
  * @returns {string} - 'granted', 'denied', 'notFound' ou 'error'
 */
async function devices_micPrompt() {
    let permission;
    await navigator.mediaDevices
        .getUserMedia({
            audio: true
        })
        .then(function (stream) {
            permission = "granted"        
        })
        .catch(function (error) {
            if (error.message == "Requested device not found") {
                permission = "notFound";
            } else if (error.message == "Permission denied") {
                permission = "denied";
            } else {
                console.log(error.message)
                permission = 'error';
            }
        });
    return permission;
}

/**
 * Verifica se Recurso de reconhecimento de fala está disponível no Browser.
 *
 * @returns {string} - 'granted', 'error'
 */
async function devices_getStatusSpeechRecognition() {
    var response;
    var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
    if (!SpeechRecognition) {
        console.log("Recurso de reconhecimento de fala não disponível neste Browser. Utilize outro navegador")
        response = "error";
    } else {
        response = "granted";
    }
    return response;
}