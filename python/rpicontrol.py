from flask import Flask
app = Flask(__name__)

@app.route('/')
def home():
    return 'Go to /x/ to light "x"'

@app.route('/<letter>/')
def switch_letter(letter):
    if letter == 'null':
        return 'all turned off now'
    return 'turned on ' + letter
