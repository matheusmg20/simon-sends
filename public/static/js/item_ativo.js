// item_ativo.js - Lógica de Rolagem Atualizada
document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll(".sidebar ul li a");

  // [Manter seu loop de clique aqui]
  links.forEach(link => {
    link.addEventListener("click", () => {
      // remove classe ativo de todos
      links.forEach(l => l.classList.remove("ativo"));
      // adiciona no clicado
      link.classList.add("ativo");
    });
  });

  if (links.length > 0) {
    links.forEach(l => l.classList.remove("ativo"));
    links[0].classList.add("ativo");

    const targetHash = links[0].getAttribute('href');

    // Usa 'load' para garantir que o DOM esteja completamente estável
    window.addEventListener('load', () => {
      
      // 1. TENTATIVA FORÇADA DE RESETAR O SCROLL DO NAVEGADOR
      document.body.scrollTop = 0; // Para Safari e Chrome
      document.documentElement.scrollTop = 0; // Para a maioria dos navegadores
      window.scrollTo(0, 0); // Outra forma de resetar

      // 2. Remove o hash atual (limpando a posição anterior)
      if (window.location.hash) {
        history.pushState("", document.title, window.location.pathname + window.location.search);
      }

      // 3. Força a rolagem imediata para o alvo (#sobral)
      if (targetHash.startsWith('#')) {
        // Define o hash, que irá rolar
        window.location.hash = targetHash; 

        // Adicionalmente, usa scrollIntoView para garantir o alinhamento instantâneo
        const targetElement = document.querySelector(targetHash);
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'auto', // Rolagem instantânea
            block: 'start' // Alinha o topo do elemento ao topo da viewport
          });
        }
      }
    });
  }
});