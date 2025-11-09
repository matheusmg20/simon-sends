document.addEventListener('DOMContentLoaded', () => {
    // Seleciona todos os detalhes (fabricas e transformadores) que queremos animar
    const detailsElements = document.querySelectorAll('.fabricas, .transformadores');

    detailsElements.forEach(details => {
        const summary = details.querySelector('summary');
        
        if (!summary) return;

        // 🚨 O Ponto Crítico: Prevenir o comportamento padrão do clique.
        // Isso impede que o navegador abra/feche o <details> por conta própria.
        summary.addEventListener('click', (e) => {
            e.preventDefault(); 
            
            if (details.hasAttribute('open')) {
                // Se o atributo 'open' existe, feche (animando)
                closeDetails(details);
            } else {
                // Se o atributo 'open' não existe, abra (animando)
                openDetails(details);
            }
        });
    });
});

// --- Funções de Animação ---

function openDetails(details) {
    const content = details.querySelector('.content');
    if (!content) return;

    // 1. Define o estado 'open' imediatamente
    details.setAttribute('open', '');
    
    // 2. Define a altura inicial do <details> (que é apenas a altura do summary)
    details.style.maxHeight = details.querySelector('summary').offsetHeight + 'px';
    
    // 3. Usa requestAnimationFrame para garantir que o navegador aplique a altura inicial
    // antes de calcular e aplicar a altura final.
    requestAnimationFrame(() => {
        // 4. Calcula a altura final (summary + scrollHeight do conteúdo)
        const finalHeight = details.querySelector('summary').offsetHeight + content.scrollHeight;

        // 5. Inicia a transição CSS definindo a altura máxima para o valor real
        details.style.maxHeight = finalHeight + 'px';

        // 6. Limpeza após a transição
        const transitionEndHandler = () => {
            // Remove a altura fixa para permitir que o conteúdo se ajuste dinamicamente
            details.style.maxHeight = ''; 
            content.removeEventListener('transitionend', transitionEndHandler);
        };

        // Escuta o fim da transição (definida no CSS)
        content.addEventListener('transitionend', transitionEndHandler, { once: true });
    });
}


function closeDetails(details) {
    const content = details.querySelector('.content');
    if (!content) return;

    // 1. Define a altura atual (altura real do <details> no momento)
    details.style.maxHeight = details.offsetHeight + 'px';
    
    // 2. Obtém a altura final (altura do summary)
    const summaryHeight = details.querySelector('summary').offsetHeight;
    
    // 3. Usa requestAnimationFrame
    requestAnimationFrame(() => {
        // 4. Inicia a transição CSS, definindo a altura para o tamanho do summary (fechado)
        details.style.maxHeight = summaryHeight + 'px';

        // 5. Remove o atributo 'open' e a altura fixa quando a transição terminar
        const transitionEndHandler = () => {
            details.removeAttribute('open');
            details.style.maxHeight = '';
            content.removeEventListener('transitionend', transitionEndHandler);
        };
        
        content.addEventListener('transitionend', transitionEndHandler, { once: true });
    });
}