import numpy as np
from scipy.spatial.distance import cosine

# Step 1: Simple vector database for travel destinations
class SimpleTravelRecommender:
    def __init__(self):
        # Initialise the list to store destination vectors and metadata
        self.destinations = []
        self.metadata = []

    def add_destination(self, vector, metadata):
        """
        Adds a destination with its corresponding vector and metadata.
        """
        self.destinations.append(vector)
        self.metadata.append(metadata)

    def recommend(self, user_vector, top_k=3):
        """
        Recommends the top_k destinations based on similarity to the user's vector.
        """
        similarities = []
        for i, destination_vector in enumerate(self.destinations):
            similarity = 1 - cosine(user_vector, destination_vector)  # Cosine similarity
            similarities.append((self.metadata[i], similarity))
        
        # Sort destinations by similarity in descending order
        similarities.sort(key=lambda x: x[1], reverse=True)

        return similarities[:top_k]

# Step 2: Fake data for travel destinations
def create_fake_data(recommender):
    """
    Adds some fake travel destination data to the recommender.
    The vector format is: [temperature, humidity, daily_cost, beach, adventure, cultural]
    """
    recommender.add_destination([30, 70, 150, 1, 0, 0], "Sunny Beach in Thailand")
    recommender.add_destination([20, 50, 200, 0, 1, 0], "Mountain Hiking in Switzerland")
    recommender.add_destination([25, 60, 120, 0, 0, 1], "Cultural Tour in Italy")
    recommender.add_destination([15, 40, 80, 0, 1, 1], "Adventure and Culture in Nepal")
    recommender.add_destination([28, 80, 250, 1, 1, 0], "Beach and Adventure in Brazil")

# Step 3: Vectorise user preferences
def get_user_preferences():
    """
    Creates a user preference vector.
    The user preferences format is the same: [preferred_temperature, preferred_humidity, max_daily_cost, beach_preference, adventure_preference, cultural_preference]
    """
    # Fake user preferences: likes warm weather, medium humidity, low cost, prefers beach and cultural experiences
    return [27, 60, 180, 1, 0, 1]

# Step 4: Testing the recommender system
if __name__ == "__main__":
    # Initialise the recommender
    recommender = SimpleTravelRecommender()

    # Add fake travel data
    create_fake_data(recommender)

    # Get user preferences
    user_preferences = get_user_preferences()

    # Get top 3 recommendations
    recommendations = recommender.recommend(user_preferences, top_k=3)

    # Output the results
    print("Top 3 Recommended Destinations:")
    for destination, similarity in recommendations:
        print(f"Destination: {destination}, Similarity: {similarity:.4f}")
