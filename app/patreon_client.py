import os
import requests
from dotenv import load_dotenv

load_dotenv()

ACCESS_TOKEN = os.getenv("PATREON_ACCESS_TOKEN")
CAMPAIGN_ID = os.getenv("PATREON_CAMPAIGN_ID")

def get_campaign_members(campaign_id):
    url = f"https://www.patreon.com/api/oauth2/v2/campaigns/{campaign_id}/members"
    headers = {"Authorization": f"Bearer {ACCESS_TOKEN}"}
    params = {"include": "user", "fields[user]": "email,full_name"}

    response = requests.get(url, headers=headers, params=params)
    if response.status_code == 200:
        members = response.json()['data']
        for m in members:
            print(m)
    else:
        print("Failed:", response.status_code, response.text)

if __name__ == "__main__":
    get_campaign_members(CAMPAIGN_ID)
