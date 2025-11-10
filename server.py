from flask import Flask, jsonify
from flask_cors import CORS
import subprocess
import os

app = Flask(__name__)
CORS(app)  # Permite requisições de outros domínios (Live Server)

@app.route("/run-script", methods=["POST"])
def run_script():
    try:
        script_path = os.path.join(os.getcwd(), "public", "mail", "main.py")
        subprocess.run(["python", script_path], check=True)
        return jsonify({"status": "success", "message": "Script executado com sucesso!"})
    except subprocess.CalledProcessError as e:
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)