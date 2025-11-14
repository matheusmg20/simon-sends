from flask import Flask, jsonify
from flask_cors import CORS
import subprocess
import os
import csv
from datetime import datetime, time

app = Flask(__name__)
CORS(app)

# ---------------- Função auxiliar para log ----------------
def calcular_turno():
    agora = datetime.now().time()

    turno1_inicio = time(5, 25)
    turno1_fim = time(15, 13)

    turno2_inicio = time(15, 14)
    turno2_fim = time(23, 59, 59)
    turno2_extra_fim = time(0, 47)

    if turno1_inicio <= agora <= turno1_fim:
        return "1º Turno"
    elif turno2_inicio <= agora or agora <= turno2_extra_fim:
        return "2º Turno"
    else:
        return "3º Turno"

def get_next_id(log_path):
    """Lê o último ID do CSV e retorna o próximo."""
    if not os.path.isfile(log_path):
        return "ENV1"
    try:
        with open(log_path, mode="r", encoding="utf-8") as file:
            reader = list(csv.reader(file))
            if len(reader) <= 1:  # só cabeçalho
                return "ENV1"
            last_row = reader[-1]
            last_id = last_row[0]  # primeira coluna é o ID
            num = int(last_id.replace("ENV", ""))
            return f"ENV{num+1}"
    except Exception:
        return "ENV1"

def registrar_log(nome_envio, tempo_execucao):
    log_path = os.path.join(os.getcwd(), "simon_sends_log.csv")
    turno = calcular_turno()
    agora = datetime.now()
    data = agora.strftime("%Y-%m-%d")
    hora = agora.strftime("%H:%M:%S")
    next_id = get_next_id(log_path)

    file_exists = os.path.isfile(log_path)
    with open(log_path, mode="a", newline="", encoding="utf-8") as file:
        writer = csv.writer(file)
        if not file_exists:
            writer.writerow(["ID", "Data", "Hora", "Envio", "Turno", "Tempo_execução"])
        writer.writerow([next_id, data, hora, nome_envio, turno, f"{tempo_execucao:.2f}"])

# ------------------------------ Núcleo Duro F7 --------------------------------------
@app.route("/run-montagem-f7-nd", methods=["POST"])
def run_montagem_f7_nd():
    try:
        script_path = os.path.join(os.getcwd(), "public", "mail", "unidades", "sobral", "montagem", "fabrica-7", "montagem-f7-nd.py")
        
        inicio = datetime.now()
        result = subprocess.run(["python", script_path], capture_output=True, text=True)
        fim = datetime.now()
        
        tempo_execucao = (fim - inicio).total_seconds()
        logs = result.stdout.splitlines()

        registrar_log("Núcleo Duro OEE TS_SOB - F7", tempo_execucao)

        """ return jsonify({"status": "success", "logs": logs, "tempo_execucao_s": tempo_execucao}) """
    
        # Aqui você retorna explicitamente o status de sucesso
        return jsonify({
            "status": "success",
            "message": "✅ E-mail enviado com sucesso!",
            "logs": logs,
            "tempo_execucao_s": tempo_execucao
        }), 200

    except subprocess.CalledProcessError as e:
        return jsonify({"status": "error", "message": str(e)}), 500

# ------------------------------ Boletim Manutenção F7 --------------------------------------
@app.route("/run-montagem-f7-bman", methods=["POST"])
def run_montagem_f7_bman():
    try:
        script_path = os.path.join(os.getcwd(), "public", "mail", "unidades", "sobral", "montagem", "fabrica-7", "montagem-f7-bman.py")
        
        inicio = datetime.now()
        result = subprocess.run(["python", script_path], capture_output=True, text=True)
        fim = datetime.now()
        
        tempo_execucao = (fim - inicio).total_seconds()
        logs = result.stdout.splitlines()

        registrar_log("Boletim Manutenção TS_SOB - F7", tempo_execucao)

        """ return jsonify({"status": "success", "logs": logs, "tempo_execucao_s": tempo_execucao}) """
    
        # Aqui você retorna explicitamente o status de sucesso
        return jsonify({
            "status": "success",
            "message": "✅ E-mail enviado com sucesso!",
            "logs": logs,
            "tempo_execucao_s": tempo_execucao
        }), 200

    except subprocess.CalledProcessError as e:
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
