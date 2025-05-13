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

# Create DataFrame from MongoDB data
df = pd.DataFrame(songs)

# Convert ObjectId to string for consistency
df['_id'] = df['_id'].apply(lambda x: str(x) if isinstance(x, ObjectId) else x)

# Get target song ID from command-line argument
if len(sys.argv) < 2:
    sys.exit("No song ID provided")

target_id = str(sys.argv[1])

# Find the target song
target_song = df[df['_id'] == target_id]
if target_song.empty:
    sys.exit()

# Preprocessing (Only using 'genre' and 'artist' columns)
features = df[['genre', 'artist']].fillna("unknown")
target_features = target_song[['genre', 'artist']].fillna("unknown")

# Version-safe OneHotEncoder
sk_version = sklearn.__version__
if sk_version.startswith("0.") or sk_version.startswith("1.0") or sk_version.startswith("1.1"):
    enc = OneHotEncoder(sparse=False, handle_unknown='ignore')
else:
    enc = OneHotEncoder(sparse_output=False, handle_unknown='ignore')

X = enc.fit_transform(features)
target_X = enc.transform(target_features)

# Compute similarity
similarities = cosine_similarity(target_X, X).flatten()

# Get top 3 similar songs excluding the song itself
df['similarity'] = similarities
recommended = df[df['_id'] != target_id].sort_values(by='similarity', ascending=False).head(3)

# Prepare output
recommended_songs = recommended[['name', 'artist', 'genre', 'albumCover', 'audio', '_id']].to_dict(orient='records')

# Output as JSON
output = json.dumps(recommended_songs, ensure_ascii=False)
print(output)
