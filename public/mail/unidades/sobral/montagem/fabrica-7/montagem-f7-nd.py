import os
import time
import base64
from PIL import Image
import win32com.client
from selenium import webdriver
from selenium.webdriver.chrome.options import Options

# ===== CONFIGURAÇÕES =====
link = "https://app.powerbi.com/view?r=eyJrIjoiYWQ4OGFhZTUtODg0MS00NTBiLWE0YTQtNTNhZDJjMjgxODdhIiwidCI6ImI3ZWQ2N2FmLWJhNDAtNDA0MC1hMzg2LWFiNTNhMGFkM2U5NiJ9"
destinatarios = ["matheus.graciano@grendene.com.br"]
titulo_email = "Análise de OEE/OPE Fábrica 07 | Gestão de Indicadores - Célula de Excelência Operacional - Unidade Sobral"
nome_remetente = "Matheus Mesquita"

print("Abrindo navegador em modo headless...")
chrome_options = Options()
chrome_options.add_argument("--headless")
chrome_options.add_argument("--disable-gpu")
chrome_options.add_argument("--window-size=1920,2880")

driver = webdriver.Chrome(options=chrome_options)
print("Carregando página...")
driver.get(link)

print("Aguardando carregamento completo (35s)...")
time.sleep(35)

print("Gerando print da página...")
width = driver.execute_script("return document.documentElement.scrollWidth")
height = driver.execute_script("return document.documentElement.scrollHeight")

os.makedirs("public/mail", exist_ok=True)
screenshot_path = os.path.abspath("public/mail/print.png")
result = driver.execute_cdp_cmd("Page.captureScreenshot", {
    "format": "png",
    "clip": {
        "x": 0,
        "y": 0,
        "width": width,
        "height": height,
        "scale": 1
    }
})

with open(screenshot_path, "wb") as f:
    f.write(base64.b64decode(result['data']))

driver.quit()

# ===== TRATAMENTO DA IMAGEM =====
print("Cortando imagem (removendo 30px direita, 1px superior e 60px inferior)...")
img = Image.open(screenshot_path)
w, h = img.size
crop_area = (0, 1, w - 30, h - 60)  # (left, top, right, bottom)
img_cropped = img.crop(crop_area)
img_cropped.save(screenshot_path)

# Redimensiona (por exemplo, para 1920px de largura)
print("Redimensiondo a imagem no corpo do e-mail...")
nova_largura = 1920
proporcao = nova_largura / w
nova_altura = int(h * proporcao)
img_redimensionada = img_cropped.resize((nova_largura, nova_altura), Image.LANCZOS)

# Salva novamente
img_redimensionada.save(screenshot_path)

# ===== ENVIO PELO OUTLOOK =====
print("Preparando e-mail...")
outlook = win32com.client.Dispatch("Outlook.Application")
mail = outlook.CreateItem(0)
mail.Subject = titulo_email
mail.To = ";".join(destinatarios)

# Anexar imagem do cabeçalho
header_path = os.path.abspath("public/mail/img/header.png")  # Caminho da imagem local
header_attachment = mail.Attachments.Add(header_path)
header_attachment.PropertyAccessor.SetProperty(
    "http://schemas.microsoft.com/mapi/proptag/0x3712001F", "header_image"
)

# Anexar imagem do footer
footer_path = os.path.abspath("public/mail/img/footer.png")  # Caminho da imagem local
footer_attachment = mail.Attachments.Add(footer_path)
footer_attachment.PropertyAccessor.SetProperty(
    "http://schemas.microsoft.com/mapi/proptag/0x3712001F", "footer_image"
)

print("Aplicando estilos ao corpo do e-mail...")
mail.HTMLBody = f"""
<div style="width: calc(100vw); border: solid 10px #A8A8A8;">
    <img src="cid:header_image" style="width: 100%;">
</div>
<div style="border: solid 10px #A8A8A8; border-top: 0px !important; padding: 10px 0; width: calc(100vw);">
    <h3 style="font-family: Arial, Helvetica, sans-serif; font-weight: bold; padding-left: 20px; margin: 0;">Análise:</h3>
</div>
<div style="width: 100vw; border: solid 10px #A8A8A8; border-top: 0px !important;">
    <img src="cid:print_image" width="100%" style=" display: block; box-sizing: border-box; margin: 0;">
</div>
<div style="width: 100vw; border: solid 10px #A8A8A8; border-top: 0px !important;">
    <img src="cid:footer_image" style="width: 100%;">
</div>
<p style="font-family: Arial, Helvetica, sans-serif;">Link: <a href="{link}">{titulo_email}</a></p>
"""

attachment = mail.Attachments.Add(screenshot_path)
attachment.PropertyAccessor.SetProperty(
    "http://schemas.microsoft.com/mapi/proptag/0x3712001F", "print_image"
)

print("Enviando e-mail...")
mail.Send()
print("✅ E-mail enviado com sucesso!")