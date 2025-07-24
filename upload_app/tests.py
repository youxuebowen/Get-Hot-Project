import requests
import json

url = "http://127.0.0.1:8000/apps/v1/get_github"
data = {
    "search": "python",
    "pages": 3,
    "project_num_one_page": 15
}

headers = {
    "Content-Type": "application/json"
}

response = requests.post(url, data=json.dumps(data), headers=headers)
print(response.json())