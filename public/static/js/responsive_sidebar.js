document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menu-toggle");
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("overlay");

  function closeSidebar() {
    sidebar.classList.remove("open");
    sidebar.classList.add("collapsed");
    overlay.classList.remove("active");
  }

  function openSidebar() {
    sidebar.classList.add("open");
    sidebar.classList.remove("collapsed");
    overlay.classList.add("active");
  }

  menuToggle.addEventListener("click", () => {
    if (sidebar.classList.contains("open")) {
      closeSidebar();
    } else {
      openSidebar();
    }
  });

  overlay.addEventListener("click", () => {
    closeSidebar();
  });

  // Inicia recolhido em telas menores
  if (window.innerWidth <= 1024) {
    sidebar.classList.remove("open");
    sidebar.classList.add("collapsed");
  }
});
