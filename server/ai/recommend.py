from pymongo import MongoClient
import pandas as pd
from sklearn.preprocessing import OneHotEncoder
from sklearn.metrics.pairwise import cosine_similarity
import sys
import json
from dotenv import load_dotenv
import os
from bson import ObjectId
import sklearn

# Load environment variables
load_dotenv()

# Connect to MongoDB
mongo_uri = os.getenv("MONGO_URI")
client = MongoClient(mongo_uri)
db = client['softwave']
collection = db['songs']

# Get all songs from MongoDB
songs = list(collection.find({}))
df = pd.DataFrame(songs)
df['_id'] = df['_id'].apply(lambda x: str(x) if isinstance(x, ObjectId) else x)

# Get multiple target song IDs from command-line argument
if len(sys.argv) < 2:
    sys.exit("No song IDs provided (comma-separated)")

target_ids = [s.strip() for s in sys.argv[1].split(',') if s.strip()]
target_songs = df[df['_id'].isin(target_ids)]
if target_songs.empty:
    sys.exit("None of the provided IDs were found.")

# Preprocessing (Only using 'genre' and 'artist' columns)
features = df[['genre', 'artist']].fillna("unknown")

# Version-safe OneHotEncoder
sk_version = sklearn.__version__
if sk_version.startswith("0.") or sk_version.startswith("1.0") or sk_version.startswith("1.1"):
    enc = OneHotEncoder(sparse=False, handle_unknown='ignore')
else:
    enc = OneHotEncoder(sparse_output=False, handle_unknown='ignore')

X = enc.fit_transform(features)
target_X = enc.transform(target_songs[['genre','artist']].fillna("unknown"))

# Compute similarity (union strategy)
similarity_matrix = cosine_similarity(target_X, X)
similarities = similarity_matrix.max(axis=0)

# Get top 3 similar songs excluding the input ones
df['similarity'] = similarities
recommended = df[~df['_id'].isin(target_ids)].sort_values('similarity', ascending=False).head(3)

# Prepare and print JSON output
recommended_songs = recommended[['name', 'artist', 'genre', 'albumCover', 'audio', '_id']].to_dict(orient='records')
print(json.dumps(recommended_songs, ensure_ascii=False))
