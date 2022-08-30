from datetime import datetime

from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def front_page():
    return render_template('front_page.html')

@app.route('/historical')
def historical_data():
    return render_template('historical_data.html')



if __name__ == "__main__":
    app.run(debug=True)