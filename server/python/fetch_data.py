import os
import psycopg2
import pandas as pd
from dotenv import load_dotenv

connection = psycopg2.connect(
    dbname=os.getenv("DB_NAME"),
    user=os.getenv("DB_USER"),
    password=os.getenv("DB_PASSWORD"),
    host=os.getenv("DB_HOST"),
    port=os.getenv("DB_PORT")
)

query = """ 
SELECT userId, category, score FROM Interests
"""


df = pd.read_sql_query(query, connection)

df.to_csv("user_activity_data.csv", index=False)
