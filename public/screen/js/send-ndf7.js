document.getElementById("montagem-f7-nd").addEventListener("click", function() {
    fetch("http://127.0.0.1:5000/run-montagem-f7-nd", { method: "POST" })
        .then(response => {
            if (!response.ok) throw new Error("Erro na requisição");
            return response.json();
        })
        .then(data => alert(data.message))
        .catch(error => alert("Erro: " + error));
});

document.getElementById("montagem-f7-bman").addEventListener("click", function() {
    fetch("http://127.0.0.1:5000/run-montagem-f7-bman", { method: "POST" })
        .then(response => {
            if (!response.ok) throw new Error("Erro na requisição");
            return response.json();
        })
        .then(data => alert(data.message))
        .catch(error => alert("Erro: " + error));
});
