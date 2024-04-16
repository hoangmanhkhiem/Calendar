from flask import Flask, render_template, request, send_from_directory
import os
import src.exce_file as exce_file

app = Flask(__name__)


@app.route('/')
def index():
    return render_template('home.html')


@app.route('/up')
def up():
    return render_template('import_xls.html')


@app.route('/upload', methods=['POST'])
def upload():
    if request.method == 'POST':
        if 'file' not in request.files:
            return 'No file part'
        file = request.files['file']
        if file.filename == '':
            return 'No selected file'
        if file:
            filename = file.filename
            file.save(os.path.join('upload', filename))
            exce_file.exce_student(os.path.join('upload', filename))
            return 'File saved successfully'
    return render_template('import_xls.html')


@app.route('/upload/data.json', methods=['GET'])
def get_data():
    return send_from_directory('upload', 'data.json')


if __name__ == '__main__':
    app.run(debug=True)
