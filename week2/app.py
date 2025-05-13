from flask import Flask, jsonify
import requests
import sqlite3

app = Flask(__name__)

@app.route('/')
def home():
    return "Hello from Flask!"

@app.route('/api/pizza')
def get_pizza():
    return jsonify({"topping": "pepperoni", "size": "large"})

@app.route('/api/bitcoins')
def get_bitcoin():
    response = requests.get("https://api.coindesk.com/v1/bpi/currentprice.json")
    return response.json()

conn = sqlite3.connect('pizza.db')
cursor = conn.cursor()

# Create table
cursor.execute('''
    CREATE TABLE IF NOT EXISTS pizzas (
        id INTEGER PRIMARY KEY,
        name TEXT,
        topping TEXT
    )
''')

# Insert data
cursor.execute('''
    INSERT INTO pizzas (name, topping) VALUES (?, ?)
''', ("Alice", "Pepperoni"))

conn.commit()

# query 
cursor.execute("SELECT * FROM pizzas")
print(cursor.fetchall())

if __name__ == '__main__':
    app.run(debug=True)