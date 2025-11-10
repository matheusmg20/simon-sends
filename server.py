from flask import Flask, jsonify
from flask_cors import CORS
import subprocess
import os

app = Flask(__name__)
CORS(app)  # Permite requisições de outros domínios (Live Server)

# ------------------------------ Núcleo Duro F7 --------------------------------------
@app.route("/run-montagem-f7-nd", methods=["POST"])
def run_montagem_f7_nd():
    try:
        script_path = os.path.join(os.getcwd(), "public", "mail", "sobral", "montagem", "fabrica-7", "montagem-f7-nd.py")
        result = subprocess.run(["python", script_path], capture_output=True, text=True)
        logs = result.stdout.splitlines()  # Captura os prints do script
        return jsonify({"status": "success", "logs": logs})
    except subprocess.CalledProcessError as e:
        return jsonify({"status": "error", "message": str(e)}), 500

# ------------------------------ Boletim Manutenção F7 --------------------------------------
@app.route("/run-montagem-f7-bman", methods=["POST"])
def run_montagem_f7_bman():
    try:
        script_path = os.path.join(os.getcwd(), "public", "mail", "sobral", "montagem", "fabrica-7", "montagem-f7-bman.py")
        result = subprocess.run(["python", script_path], capture_output=True, text=True)
        logs = result.stdout.splitlines()
        return jsonify({"status": "success", "logs": logs})
    except subprocess.CalledProcessError as e:
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)