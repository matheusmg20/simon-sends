// item_ativo.js
document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll(".sidebar ul li a");

  links.forEach(link => {
    link.addEventListener("click", () => {
      // remove classe ativo de todos
      links.forEach(l => l.classList.remove("ativo"));
      // adiciona no clicado
      link.classList.add("ativo");
    });
  });
});
