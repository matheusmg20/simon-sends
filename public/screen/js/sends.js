// ===========================================
// 1. OBTENÇÃO DE REFERÊNCIAS
// ===========================================
const loadingOverlay = document.getElementById("loading-overlay");
// Adicionando o elemento de feedback para que a mensagem apareça
const feedbackMessage = document.getElementById("feedback-message"); 


// ===========================================
// 2. FUNÇÕES AUXILIARES DE UX
// ===========================================

/** Exibe uma mensagem de feedback temporária. */
function showFeedback(message, type = 'success') {
    if (!feedbackMessage) return; 

    feedbackMessage.textContent = message;
    feedbackMessage.className = `feedback-message ${type}`;
    feedbackMessage.style.display = 'block';

    // Faz a mensagem sumir após 4 segundos
    setTimeout(() => {
        feedbackMessage.style.display = 'none';
        feedbackMessage.textContent = '';
    }, 4000);
}


function showLoading(button) {
    loadingOverlay.classList.remove("hidden");
    button.disabled = true;
    button.classList.add("loading");
    
    // ... Lógica para alterar ícone e texto do botão ...
    const icon = button.querySelector('i');
    const span = button.querySelector('span');
    if (icon) {
        icon.className = 'bi bi-arrow-clockwise loading-spin'; 
    }
    if (span) {
        span.textContent = 'Aguarde...';
    }
}

function hideLoading(button, originalIconClass, originalText) {
    loadingOverlay.classList.add("hidden");
    button.disabled = false;
    button.classList.remove("loading");
    
    // ... Lógica para restaurar ícone e texto do botão ...
    const icon = button.querySelector('i');
    const span = button.querySelector('span');
    if (icon) {
        icon.className = originalIconClass;
    }
    if (span) {
        span.textContent = originalText;
    }
}


// ===========================================
// 3. LÓGICA DE EVENTOS (GENÉRICA)
// ===========================================

document.querySelectorAll('button.send[id]').forEach(button => {
    const buttonId = button.id;
    
    const originalIconClass = button.querySelector('i').className;
    const originalText = button.querySelector('span').textContent;

    const endpoint = `/run-${buttonId}`; 
    const fullUrl = `http://127.0.0.1:5000${endpoint}`;

    button.addEventListener("click", function(event) {
        // 🚨 CHAVE PARA EVITAR O RECARREGAMENTO:
        event.preventDefault(); 
        
        showLoading(button); 

        fetch(fullUrl, { method: "POST" })
            .then(response => {
                if (!response.ok) {
                    // Tenta ler o JSON de erro do servidor
                    return response.json().then(errorData => {
                        throw new Error(errorData.message || `Erro HTTP: ${response.statusText}`);
                    }).catch(() => {
                        // Caso a resposta não seja um JSON (e.g., HTML de erro), trata como erro de rede/servidor
                        throw new Error(`Erro na requisição. Status: ${response.status}`);
                    });
                }
                return response.json();
            })
            .then(data => {
                // Sucesso: Exibe mensagem de conclusão
                const successMsg = data.message || "Email enviado com sucesso!";
                showFeedback(successMsg, 'success');
            }) 
            .catch(error => {
                // Falha: Exibe mensagem de erro
                showFeedback(`Falha no envio: ${error.message}`, 'error');
            }) 
            .finally(() => {
                // Esconde o carregamento e reabilita o botão, SEMPRE
                hideLoading(button, originalIconClass, originalText);
            });
    });
});