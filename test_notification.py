import os
from dotenv import load_dotenv
from twilio.rest import Client

# Load environment variables
load_dotenv()

# Twilio Configuration
TWILIO_ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID")
TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN")
TWILIO_PHONE_NUMBER = os.getenv("TWILIO_PHONE_NUMBER")
TARGET_PHONE_NUMBER = os.getenv("TARGET_PHONE_NUMBER")

def send_test_sms():
    print("Sending TEST SMS...")
    print(f"From: {TWILIO_PHONE_NUMBER}")
    print(f"To: {TARGET_PHONE_NUMBER}")
    print(f"SID Present: {bool(TWILIO_ACCOUNT_SID)}")
    print(f"Token Present: {bool(TWILIO_AUTH_TOKEN)}")
    
    if not TWILIO_ACCOUNT_SID or not TWILIO_AUTH_TOKEN:
        print("❌ Missing Twilio credentials in .env")
        return

    try:
        client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
        
        message = client.messages.create(
            body="🌱 This is a TEST SMS from Green Pulse!",
            from_=TWILIO_PHONE_NUMBER,
            to=TARGET_PHONE_NUMBER
        )
        print(f"✅ SMS sent successfully! SID: {message.sid}")
    except Exception as e:
        print(f"❌ Failed to send SMS: {e}")

if __name__ == "__main__":
    send_test_sms()
