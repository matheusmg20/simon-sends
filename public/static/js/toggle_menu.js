// toggle_menu.js (substituir)
document.addEventListener("DOMContentLoaded", () => {
    const menuToggle = document.getElementById("menu-toggle");
    const sidebar = document.getElementById("sidebar");
    const spans = sidebar.querySelectorAll("a span");

    // garante que o transitionend trate apenas a largura
    sidebar.addEventListener("transitionend", (e) => {
        if (e.propertyName === "width") {
        sidebar.classList.remove("collapsing");
        }
    });

    menuToggle.addEventListener("click", () => {
    if (sidebar.classList.contains("collapsed")) {
        // Expandir
        sidebar.classList.add("collapsing");
        sidebar.classList.remove("collapsed");

        // Anima entrada dos spans
        spans.forEach(span => {
        span.style.opacity = "0";
        span.style.transform = "translateX(-20px)";
        setTimeout(() => {
            span.style.opacity = "1";
            span.style.transform = "translateX(0)";
        }, 100); // pequeno delay para garantir transição
        });

        setTimeout(() => sidebar.classList.remove("collapsing"), 400);
    } else {
        // Recolher
        sidebar.classList.add("collapsing");

        // Anima saída dos spans
        spans.forEach(span => {
        span.style.opacity = "0";
        span.style.transform = "translateX(-20px)";
        });

        setTimeout(() => {
        sidebar.classList.add("collapsed");
        }, 100);

        setTimeout(() => sidebar.classList.remove("collapsing"), 600);
    }
    });
});
