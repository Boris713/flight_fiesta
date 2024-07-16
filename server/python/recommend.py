import sys
import json
import pandas as pd
import numpy as np
from scipy.sparse.linalg import svds
from scipy.sparse import csr_matrix

def main():
    # Read JSON data from standard input
    input_data = sys.stdin.read()
    try:
        data = json.loads(input_data)
        userInterests = data['userInterests']
        cityInterests = data['cityInterests']
        userId = data['userId']
        cityId = data['cityId']
    except (json.JSONDecodeError, KeyError):
        print("Invalid or incomplete JSON input.", file=sys.stderr)
        sys.exit(1)

    # Convert JSON data to DataFrame
    user_df = pd.DataFrame(userInterests)
    city_df = pd.DataFrame(cityInterests)

    # Create user and city activity matrices
    user_activity_matrix = user_df.pivot(index="userId", columns="category", values="score").fillna(0)
    city_activity_matrix = city_df.pivot(index="cityId", columns="category", values="score").fillna(0)

    # Combine user and city matrices for comparison
    combined_matrix = pd.concat([user_activity_matrix, city_activity_matrix])
    combined_matrix.fillna(0, inplace=True)

    sparse_combined_matrix = csr_matrix(combined_matrix.values)

    # Calculate the appropriate value for k
    k_value = min(sparse_combined_matrix.shape) - 1
    if k_value < 1:
        print("Not enough data to perform matrix factorization.", file=sys.stderr)
        sys.exit(1)

    U, sigma, Vt = svds(sparse_combined_matrix, k=k_value)
    sigma = np.diag(sigma)

    prediction = np.dot(np.dot(U, sigma), Vt)
    prediction_df = pd.DataFrame(prediction, columns=combined_matrix.columns, index=combined_matrix.index)

    def recommend_activities(userId, num_recommendations=10):
        user_row_num = combined_matrix.index.get_loc(userId)
        sorted_user_predictions = prediction_df.iloc[user_row_num].sort_values(ascending=False)

        user_data = user_df[user_df['userId'] == userId]
        rated_categories = user_data['category'].tolist()

        recommendations = sorted_user_predictions[~sorted_user_predictions.index.isin(rated_categories)].head(num_recommendations)

        recommended_categories = recommendations.index.tolist()
        return recommended_categories

    # Output recommendations for the provided user ID
    try:
        results = recommend_activities(userId)
        print(json.dumps(results))
    except ValueError as e:
        print(str(e), file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
