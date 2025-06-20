# Arcane Auth Gate

Arcane Auth Gate is a secure, modular authentication system that enables access to digital products or content *only* for verified Patreon paying members, using Patreon’s API and email matching.  
Designed for creators and indie devs who wish to offer truly exclusive “magic-linked” access to supporters.

## Features

- OAuth2 integration with Patreon API (paid member verification)
- User registration with email matching
- One-time magic link generation for login/access
- Automated access revocation on membership change
- Stepwise development/test ready for OpenAI Codex

## Project Structure

arcane-auth-gate/
│
├── README.md
├── LICENSE
├── .gitignore
│
├── app/ # Main application code
│ ├── init.py
│ ├── auth.py # Core authentication logic
│ ├── patreon_client.py # Patreon API interaction
│ ├── magic_link.py # Magic link generator/validator
│ └── config.py # App configuration/settings
│
├── tests/ # Automated and Codex test scripts
│ └── test_auth.py
│
├── requirements.txt # Python dependencies
└── .env.example # Example environment variables


## Getting Started

1. **Clone this repository**
2. **Install Python dependencies:**  
   `pip install -r requirements.txt`
3. **Set up your `.env` file:**  
   See `.env.example` for all required keys (Patreon client ID/secret etc)
4. **Run the first test script:**  
   `python app/patreon_client.py`
   (Should fetch and print a list of paying members if credentials are correct)

## Running the OAuth demo

The included Flask server starts the Patreon OAuth flow at `/auth/patreon` and
handles the callback at `/api/callback`.

1. Ensure your `.env` contains valid values for `PATREON_CLIENT_ID`,
   `PATREON_CLIENT_SECRET`, `PATREON_REDIRECT_URI`, `PATREON_CAMPAIGN_ID` and
   `PATREON_ACCESS_TOKEN`.
2. Start the server with `python -m app.server` (or `python app/server.py`).
3. Open `http://localhost:5000/auth/patreon` in your browser and follow the
   Patreon login prompts.
4. After authorizing the app you will be redirected to `/api/callback` where the
   server exchanges the code for access tokens.

**Note:** The sandbox environment used for automated testing cannot reach
Patreon’s API, so the callback request will fail here. Run the demo on a local
machine with internet connectivity to complete the OAuth flow successfully.

## Roadmap

- [x] Repo + LICENSE + Readme
- [ ] Patreon OAuth2 API connection
- [ ] Paid member email matching
- [ ] Magic link creation & validation
- [ ] Basic web server for user registration
- [ ] Access revocation logic
- [ ] Codex automation & test scripts
