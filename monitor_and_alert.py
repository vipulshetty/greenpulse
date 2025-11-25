import requests
import time
import schedule
from datetime import datetime
import os
from dotenv import load_dotenv
from gradio_client import Client
from twilio.rest import Client as TwilioClient

# Load environment variables from .env file
load_dotenv()

# --- Configuration ---
# Replace with your actual ThingSpeak Channel ID and API Key
THINGSPEAK_CHANNEL_ID = os.getenv("VITE_THINGSPEAK_CHANNEL_ID", "2638062") 
THINGSPEAK_API_KEY = os.getenv("VITE_THINGSPEAK_API_KEY") # Reads from .env

# Twilio Configuration
TWILIO_ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID")
TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN")
TWILIO_PHONE_NUMBER = os.getenv("TWILIO_PHONE_NUMBER")
TARGET_PHONE_NUMBER = os.getenv("TARGET_PHONE_NUMBER", "+918296038916")

# Thresholds
NITROGEN_LOW = 10
PHOSPHORUS_LOW = 5
POTASSIUM_LOW = 8
MOISTURE_LOW = 30

def fetch_plant_data():
    """Fetches the latest data from ThingSpeak."""
    url = f"https://api.thingspeak.com/channels/{THINGSPEAK_CHANNEL_ID}/feeds.json?api_key={THINGSPEAK_API_KEY}&results=1"
    try:
        response = requests.get(url)
        data = response.json()
        if data['feeds']:
            feed = data['feeds'][0]
            return {
                'temperature': float(feed.get('field1', 0)),
                'humidity': float(feed.get('field2', 0)),
                'soil_moisture': float(feed.get('field3', 0)),
                'light': float(feed.get('field4', 0)),
            }
    except Exception as e:
        print(f"Error fetching data: {e}")
    return None

def fetch_ml_data():
    """Fetches NPK and health analysis from the ML model."""
    try:
        client = Client("vipul918/Npkvaluepredictor")
        # Call analyze_live_data - no inputs needed, ML model fetches from ThingSpeak
        result = client.predict(api_name="/analyze_live_data")
        
        # Result format:
        # [0] Fetch Status, [1] Health Status, [2] Recommendation, 
        # [3] N, [4] P, [5] K, [6] Moisture, [7] Temp, [8] Humidity
        data = result.data
        
        return {
            'health_status': data[1],
            'recommendation': data[2],
            'nitrogen': float(data[3]),
            'phosphorus': float(data[4]),
            'potassium': float(data[5]),
            'soil_moisture': float(data[6])
        }
    except Exception as e:
        print(f"Error fetching ML data: {e}")
    return None

def send_sms_alert(message):
    """Sends an SMS using Twilio."""
    if not TWILIO_ACCOUNT_SID or not TWILIO_AUTH_TOKEN:
        print("⚠️ Twilio credentials not found in .env. Cannot send SMS.")
        return

    try:
        client = TwilioClient(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
        
        message = client.messages.create(
            body=message,
            from_=TWILIO_PHONE_NUMBER,
            to=TARGET_PHONE_NUMBER
        )
        print(f"✅ SMS sent successfully! SID: {message.sid}")
    except Exception as e:
        print(f"❌ Failed to send SMS: {e}")

def check_and_alert():
    """Checks plant health and sends an alert if critical."""
    print(f"[{datetime.now()}] Checking plant status...")
    
    # Fetch data
    sensor_data = fetch_plant_data()
    ml_data = fetch_ml_data()
    
    if not sensor_data and not ml_data:
        print("No data received.")
        return

    alerts = []
    
    # Check Soil Moisture (prefer ML data if available, else sensor data)
    moisture = ml_data['soil_moisture'] if ml_data else (sensor_data['soil_moisture'] if sensor_data else 0)
    if moisture < MOISTURE_LOW:
        alerts.append(f"💧 Soil Moisture is LOW ({moisture}%)")
        
    # Check NPK (only available from ML data)
    if ml_data:
        if ml_data['nitrogen'] < NITROGEN_LOW:
            alerts.append(f"📉 Nitrogen is LOW ({ml_data['nitrogen']})")
        if ml_data['phosphorus'] < PHOSPHORUS_LOW:
            alerts.append(f"📉 Phosphorus is LOW ({ml_data['phosphorus']})")
        if ml_data['potassium'] < POTASSIUM_LOW:
            alerts.append(f"📉 Potassium is LOW ({ml_data['potassium']})")
            
        if ml_data['health_status'] == 'Critical':
             alerts.append(f"🚨 Overall Health: CRITICAL")
             alerts.append(f"💡 Rec: {ml_data['recommendation']}")

    if alerts:
        message = "🌱 Green Pulse Alert 🚨\n\n" + "\n".join(alerts) + "\n\nCheck dashboard."
        print("Critical status detected! Sending SMS...")
        send_sms_alert(message)
    else:
        print("Plant is healthy. No alerts needed.")

# --- Main Loop ---
if __name__ == "__main__":
    print("🌱 Green Pulse Automation Started (SMS Mode)")
    print("Press Ctrl+C to stop.")
    
    # Schedule the check every 1 minute for testing (change to hours later if needed)
    schedule.every(1).minutes.do(check_and_alert)
    
    # Run once immediately on startup
    check_and_alert()
    
    while True:
        schedule.run_pending()
        time.sleep(1)
