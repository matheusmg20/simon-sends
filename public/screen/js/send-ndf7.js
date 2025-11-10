document.getElementById("ndf7").addEventListener("click", function() {
    fetch("http://127.0.0.1:5000/run-script", { method: "POST" })
        .then(response => {
            if (!response.ok) throw new Error("Erro na requisição");
            return response.json();
        })
        .then(data => alert(data.message))
        .catch(error => alert("Erro: " + error));
});