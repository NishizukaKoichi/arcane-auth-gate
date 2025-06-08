from flask import Flask, redirect, request, jsonify
import os
from dotenv import load_dotenv
from app.patreon_client import get_campaign_members, CAMPAIGN_ID
import requests

load_dotenv()

CLIENT_ID = os.getenv("PATREON_CLIENT_ID")
CLIENT_SECRET = os.getenv("PATREON_CLIENT_SECRET")
REDIRECT_URI = os.getenv("PATREON_REDIRECT_URI")

app = Flask(__name__)

@app.route('/auth/patreon')
def auth_patreon():
    """Start Patreon OAuth flow by redirecting user to Patreon."""
    params = {
        'response_type': 'code',
        'client_id': CLIENT_ID,
        'redirect_uri': REDIRECT_URI,
        'scope': 'identity',
    }
    query = '&'.join(f"{k}={v}" for k, v in params.items())
    return redirect(f"https://www.patreon.com/oauth2/authorize?{query}")

@app.route('/api/callback')
def patreon_callback():
    """Handle OAuth callback and fetch token from Patreon."""
    code = request.args.get('code')
    if not code:
        return jsonify({'error': 'missing code'}), 400

    token_url = 'https://www.patreon.com/api/oauth2/token'
    data = {
        'code': code,
        'grant_type': 'authorization_code',
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET,
        'redirect_uri': REDIRECT_URI,
    }
    res = requests.post(token_url, data=data)
    if res.status_code != 200:
        return jsonify({'error': 'token request failed', 'details': res.text}), 400

    tokens = res.json()
    # Example usage of patreon_client
    get_campaign_members(CAMPAIGN_ID)
    return jsonify(tokens)

if __name__ == '__main__':
    app.run(debug=True)
