import os
import calendar
from dotenv import load_dotenv

import pandas as pd
import numpy as np
import faiss
import openai

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sklearn.preprocessing import OneHotEncoder, MinMaxScaler

load_dotenv() 
openai.api_key = os.getenv("OPENAI_API_KEY")
if not openai.api_key:
    raise RuntimeError("OPENAI_API_KEY not set in environment")

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_methods=["*"],
    allow_headers=["*"],
)

CSV_PATH = os.path.expanduser(
    "~/Desktop/COMP3000/JetSetGo/synthetic_weighted_global_flights_50k.csv"
)
df = pd.read_csv(CSV_PATH)
df["departure_datetime"] = pd.to_datetime(df["departure_datetime"], errors="coerce")

df = df.dropna(
    subset=[
        "origin_city",
        "Holiday Type",
        "price_gbp",
        "destination_temp_c",
        "departure_datetime",
    ]
).reset_index(drop=True)

df["price_log"] = np.log1p(df["price_gbp"])
encoder = OneHotEncoder(sparse_output=False).fit(df[["Holiday Type"]])
scaler = MinMaxScaler().fit(df[["price_log", "destination_temp_c"]])

holiday_enc_full = encoder.transform(df[["Holiday Type"]])
num_scaled_full = scaler.transform(df[["price_log", "destination_temp_c"]])
num_scaled_full[:, 0] = 1 - num_scaled_full[:, 0]

vectors_full = np.hstack([holiday_enc_full, num_scaled_full]).astype("float32")
vector_dim = vectors_full.shape[1]

holiday_options = [
    "City Break",
    "Cultural",
    "Luxury",
    "Religious",
    "Adventure",
    "Beach",
    "Party",
]
climate_map = {"hot": 28, "mild": 20, "cold": 10}

class SearchParams(BaseModel):
    origin_city: str
    month: str        
    year: int
    holiday_type: str
    max_price: float
    climate: str      

class VisaQuery(BaseModel):
    origin_city: str
    destination_city: str
    passport_country: str

@app.post("/search")
def search(params: SearchParams):
    if params.origin_city not in set(df["origin_city"]):
        raise HTTPException(400, "Unknown origin_city")
    if params.holiday_type not in holiday_options:
        raise HTTPException(400, "Invalid holiday_type")
    if params.climate not in climate_map:
        raise HTTPException(400, "Invalid climate")
    try:
        month_idx = list(calendar.month_name).index(params.month)
    except ValueError:
        raise HTTPException(400, "Invalid month name")

    start = pd.Timestamp(f"{params.year}-{month_idx:02d}-01")
    end = (start + pd.offsets.MonthEnd(1)) + pd.Timedelta(days=1)
    mask = (
        (df.origin_city == params.origin_city)
        & (df.departure_datetime >= start)
        & (df.departure_datetime < end)
        & (df.price_gbp <= params.max_price)
    )
    candidate_idxs = np.where(mask)[0]
    if candidate_idxs.size == 0:
        return []

    # build query vector
    qlog = np.log1p(params.max_price)
    qcat = encoder.transform(
        pd.DataFrame([[params.holiday_type]], columns=["Holiday Type"])
    )
    qnum = scaler.transform(
        pd.DataFrame([[qlog, climate_map[params.climate]]],
                     columns=["price_log", "destination_temp_c"])
    )
    qnum[0, 0] = 1 - qnum[0, 0]
    qvec = np.hstack([qcat, qnum]).astype("float32")

    cand_vectors = vectors_full[candidate_idxs]
    index = faiss.IndexFlatL2(vector_dim)
    index.add(cand_vectors)
    K = min(20, len(candidate_idxs))
    _, I = index.search(qvec, K)
    selected_idxs = candidate_idxs[I[0]]

    results_df = (
        df.iloc[selected_idxs]
        .sort_values("price_gbp")
        .head(5)[
            [
                "airline",
                "origin_city",
                "destination_city",
                "price_gbp",
                "departure_datetime",
            ]
        ]
    )

    records = results_df.to_dict(orient="records")
    for r in records:
        r["departure_datetime"] = r["departure_datetime"].isoformat()
    return records

@app.post("/visa")
def visa_requirements(q: VisaQuery):
    prompt = (
        f"What visas and travel requirements are there for this journey "
        f"from {q.origin_city} to {q.destination_city} for a passport from "
        f"{q.passport_country}? What must the user fill out, provide this "
        "in brief bullet points."
    )
    try:
        completion = openai.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=300,
            temperature=0.7,
        )
        content = completion.choices[0].message.content.strip()
        return {"visa_requirements": content}
    except Exception as e:
        print("❌ OpenAI /visa error:", e)
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch visa info: {e}"
        )
