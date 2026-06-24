import urllib.request
import json
import sys

token = "8911215530:AAFTZUJhkisflZqrpl0bnhCmmxtNK3PerPY"

if len(sys.argv) < 2:
    print("Usage: python set_webhook.py <your_public_url>")
    print("Example: python set_webhook.py https://xxxx.ngrok-free.app")
    sys.exit(1)

public_url = sys.argv[1].rstrip('/')
webhook_url = f"{public_url}/api/bot/webhook"

url = f"https://api.telegram.org/bot{token}/setWebhook?url={webhook_url}"

print(f"Setting webhook to: {webhook_url}")
try:
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req, timeout=10) as response:
        res_data = json.loads(response.read().decode())
        if res_data.get("ok"):
            print("✅ Webhook set successfully!")
            print("Webhook Info:", res_data.get("description"))
        else:
            print("❌ Failed to set webhook:", res_data)
except Exception as e:
    print("Error:", e)
