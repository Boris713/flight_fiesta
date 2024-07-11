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
        interests = data['interests']
        user_id = data['userId']
    except (json.JSONDecodeError, KeyError):
        print("Invalid or incomplete JSON input.", file=sys.stderr)
        sys.exit(1)

    # Convert JSON data to DataFrame
    df = pd.DataFrame(interests)
    df['userId'] = df['userId'].astype(str)

    # Create user activity matrix
    user_activity_matrix = df.pivot(index="userId", columns="category", values="score").fillna(0)
    user_activity_matrix = user_activity_matrix.astype(float)

    
    sparse_user_activity_matrix = csr_matrix(user_activity_matrix.values)

    # Calculate the appropriate value for k
    k_value = min(sparse_user_activity_matrix.shape) - 1
    if k_value < 1:
        print("Not enough data to perform matrix factorization.", file=sys.stderr)
        sys.exit(1)

    
    U, sigma, Vt = svds(sparse_user_activity_matrix, k=k_value)
    sigma = np.diag(sigma)

    
    prediction = np.dot(np.dot(U, sigma), Vt)
    prediction_df = pd.DataFrame(prediction, columns=user_activity_matrix.columns, index=user_activity_matrix.index)

    
    def recommend_activities(user_id, num_recommendations=10):
        user_row_num = user_activity_matrix.index.get_loc(user_id)
        sorted_user_predictions = prediction_df.iloc[user_row_num].sort_values(ascending=False)
        
        
        user_data = df[df['userId'] == user_id]
        rated_categories = user_data['category'].tolist()
        
        
        recommendations = sorted_user_predictions[~sorted_user_predictions.index.isin(rated_categories)].head(num_recommendations)
        
        
        recommended_categories = recommendations.index.tolist()
        return recommended_categories

    # Output recommendations for the provided user ID
    try:
        results = recommend_activities(user_id)
        print(json.dumps(results))
    except ValueError as e:
        print(str(e), file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
