 
import pandas as pd
import random
from datetime import datetime, timedelta



airport_df = pd.read_csv("airport_df.csv")

airlines = {
    'United Airlines': 'UA', 'Delta Airlines': 'DL', 'British Airways': 'BA',
    'Air France': 'AF', 'Lufthansa': 'LH', 'Emirates': 'EK', 'Qatar Airways': 'QR',
    'KLM': 'KL', 'Turkish Airlines': 'TK', 'Singapore Airlines': 'SQ'
}
aircraft_types = ['Airbus A320', 'Airbus A330', 'Airbus A350', 'Boeing 737', 'Boeing 747', 'Boeing 777', 'Boeing 787']
holiday_types = ['Beach', 'Adventure', 'City Break', 'Cultural', 'Party', 'Religious', 'Ski', 'Nature', 'Wellness', 'Family']
weather_by_month = {
    '01': ('Snowy', -1), '02': ('Cold', 2), '03': ('Cool', 10),
    '04': ('Mild', 14), '05': ('Pleasant', 18), '06': ('Warm', 23),
    '07': ('Hot', 27), '08': ('Hot', 26), '09': ('Mild', 21),
    '10': ('Cool', 15), '11': ('Cold', 6), '12': ('Snowy', 0)
}
start_date = datetime(2025, 4, 22)
end_date = datetime(2025, 12, 31)



def generate_datetime(start_date, end_date):
    total_minutes = int((end_date - start_date).total_seconds() / 600)
    random_minutes = random.randint(0, total_minutes)
    return start_date + timedelta(minutes=random_minutes * 10)

def generate_flight():
    origin = airport_df.sample(weights=airport_df['weight']).iloc[0]
    dest = airport_df.sample(weights=airport_df['weight']).iloc[0]
    while dest['code'] == origin['code']:
        dest = airport_df.sample(weights=airport_df['weight']).iloc[0]

    airline = random.choice(list(airlines.keys()))
    airline_code = airlines[airline]
    flight_number = f"{airline_code}{random.randint(100, 9999)}"
    aircraft = random.choice(aircraft_types)
    departure_dt = generate_datetime(start_date, end_date)
    duration_min = random.choice(range(60, 601, 10))
    arrival_time = departure_dt + timedelta(minutes=duration_min)
    arrival_str = arrival_time.strftime("%H:%M:%S")
    co2_emission = round(random.uniform(70, 150) * (duration_min / 60), 2)
    price = round(random.uniform(40, 1200), 2)
    month_key = departure_dt.strftime("%m")
    weather, temp = weather_by_month.get(month_key, ('Unknown', 15))
    holiday = random.choice(holiday_types)

    return [
        airline,
        origin['code'], origin['city'],
        dest['code'], dest['city'],
        departure_dt.strftime("%Y-%m-%d %H:%M:%S"),
        arrival_str,
        duration_min,
        price,
        weather,
        temp,
        holiday
    ]

def generate_batch(batch_num, batch_size=10000000):
    records = [generate_flight() for _ in range(batch_size)]
    df = pd.DataFrame(records, columns=[
        "airline", "origin_airport", "origin_city", "destination_airport", "destination_city",
        "departure_datetime", "arrival_time", "duration_minutes", "price_gbp",
        "destination_weather", "destination_temp_c", "Holiday Type"
    ])
    df.to_csv(f"flight_batch_{batch_num}.csv", index=False)

generate_batch(batch_num=1)
