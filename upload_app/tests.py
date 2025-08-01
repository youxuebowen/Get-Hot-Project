import requests
import json
if __name__ == '__main__':
    content = [1, 2, 3]  # 原长度为 3
    sliced_content = content[:9]
    print(len(sliced_content))  # 输出: 3
    print(sliced_content)       # 输出: [1, 2, 3]