from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI
import os
import re
import requests

client = OpenAI()

app = Flask(__name__)
CORS(app)

@app.route('/generate-word', methods=['POST'])
def generate_word():
    data = request.json
    letters = data['letters']
    try:
        response = client.completions.create(
            model="gpt-3.5-turbo-instruct",
            prompt=f"Create as many unique English word using only these letters, each word should have atleast three letters and you can't use any letter apart from what's given here. Remember one letter words are not allowed: {', '.join(letters)}.",
        )
        word = response.choices[0].text.strip()

        raw_words = word.split('\n')
        # Extract words by removing numbers and periods
        words = [re.sub(r'^\d+\.\s*', '', word).strip() for word in raw_words]

        # Check if the generated word is a valid English word
        valid_words = [word for word in words if is_valid_word(word, letters)]
        print ("Generated words", valid_words)
        return jsonify({'word': valid_words})
    except Exception as e:
        print('Error with OpenAI API:', e)
        return jsonify({'error': 'Failed to generate word'}), 500

#implement dictionary check
def is_valid_word(word, available_letters):
    url = f"https://api.dictionaryapi.dev/api/v2/entries/en/{word}"
    response = requests.get(url)
    if not can_construct_word(word, available_letters):
        return False  # Word uses letters not in the provided set or more times than provided
    else:
        if response.status_code == 200:
            return True
        else:
            return False
    
def can_construct_word(word, available_letters):
    """Check if a word can be constructed using only the letters provided, regardless of count."""
    word = word.lower()  # Ensure comparison is case insensitive
    available_set = set(str(available_letters).lower())  # Convert to set for O(1) complexity checks
    return all(char in available_set for char in word)

@app.route('/find-unique-words', methods=['POST'])
def find_unique_words():
    data = request.json
    words = data
    unique_words = set(words)
    print('Unique words:', unique_words)
    return jsonify({'uniqueWords': list(unique_words), 'totalWords': len(unique_words)})

@app.route('/say-hello', methods=['POST'])
def say_hello():
    message = request.json['message']
    print('Received from the frontend:', message)
    return jsonify({'reply': "Hello from the server!"})

if __name__ == '__main__':
    PORT = os.getenv('PORT', 3000)
    app.run(host='0.0.0.0', port=PORT)

