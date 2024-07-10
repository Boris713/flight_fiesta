import pandas as pd
import numpy as np
from scipy.sparse.linalg import svds

df = pd.read_csv("user_activity_data.csv")

df['userId'] = df['userId'].astype(str)

user_activity_matrix = df.pivot(index="userId", columns="category", values="score").fillna(0)

user_id_map = {user_id: idx for idx, user_id in enumerate(user_activity_matrix.index)}

U, sigma, Vt = svds(user_activity_matrix, k=min(user_activity_matrix.shape) - 1)
sigma = np.diag(sigma)

prediction = np.dot(np.dot(U, sigma), Vt)

prediction_df = pd.DataFrame(prediction, columns=user_activity_matrix.columns, index=user_activity_matrix.index)

def recommend_activities(user_id, num_recommendations=10):
    if user_id not in user_id_map:
        raise ValueError(f"User ID {user_id} not found")
    
    user_row_num = user_id_map[user_id]
    sorted_user_prediction = prediction_df.iloc[user_row_num].sort_Values(ascending=False)
    user_data = df[df.user_id == user_id]
    recommendations = sorted_user_predictions[~sorted_user_predictions.index.isin(user_data.category)].head(num_recommendations)
    return recommendations
