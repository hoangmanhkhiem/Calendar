from flask import Flask, render_template

app = Flask(__name__)


@app.route('/')
def index():
    return render_template('home.html')


@app.route('/upload')
def upload():
    return render_template('import_xls.html')


if __name__ == '__main__':
    app.run(debug=True)
