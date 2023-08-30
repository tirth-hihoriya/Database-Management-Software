from flask import Flask, jsonify, request, send_file
import pandas as pd
from flask_cors import CORS
import io
import os
import random
import string
import re
from query_search import cleaned_query, search_query
from flask_mail import Mail, Message


app = Flask(__name__)
CORS(app)

app.config['MAIL_SERVER']='smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USERNAME'] = 'Edge196Test@gmail.com'
app.config['MAIL_PASSWORD'] = 'znclhsgryctwvhgb'
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USE_SSL'] = False
mail = Mail(app)

# Define a route for preprocessing the Excel file
@app.route('/api/preprocess', methods=['POST'])
def preprocess_excel():
    # Check if a file was uploaded
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'})

    file = request.files['file']

    # Check if the file is of the allowed type
    allowed_extensions = {'xlsx', 'xls', 'csv'}
    if file.filename.split('.')[-1].lower() not in allowed_extensions:
        return jsonify({'error': 'Invalid file type'})

    # Read the Excel or csv file into a DataFrame
    if file.filename.split('.')[-1].lower() == 'csv':
        df = pd.read_csv(file)
    else:
        df = pd.read_excel(file)


    # Preprocess the data (filter rows based on a condition)
    # filtered_data = df[df['Age'] >= 26]
    filtered_data = df
    # Convert the filtered data to a new DataFrame
    filtered_df = pd.DataFrame(filtered_data)

    # Save the filtered data to an Excel file
    filtered_df.to_excel('processed_data.xlsx', index=False)
    return jsonify({})


@app.route('/api/query', methods=['GET'])
def query():
    # get text input from user 
    input_text = request.args.get('query')
    selectedCategory = request.args.get('selectedCategory')
    query = cleaned_query(input_text)

    return search_query(query, selectedCategory)



# Define a route for downloading the processed Excel file
@app.route('/api/download/company', methods=['GET'])
def download_company_excel():
    temp_file_path = r'./server/temp_processed_company_data.csv'
    print(temp_file_path)
    if os.path.exists(temp_file_path):
        print('file exists')
        return send_file('temp_processed_company_data.csv',
                         as_attachment=True)

    return jsonify({'error': 'File not found!!'})


@app.route('/api/download/contacts', methods=['GET'])
def download_contacts_excel():
    temp_file_path = r'./server/temp_processed_contacts_data.csv'
    print(temp_file_path)
    if os.path.exists(temp_file_path):
        print('file exists')
        return send_file('temp_processed_contacts_data.csv',
                         as_attachment=True)

    return jsonify({'error': 'File not found!!'})

@app.route('/api/sendEmail', methods=['POST'])
def send_email():
    data = request.get_json()
    #json_string = jsonify(data)
    print(data)
    #name = data["f_name"]
    #print(name)
    msg = Message(data["sub"], sender = 'rtr.parthkachhadia@gmail.com', recipients = ['rtr.parthkachhadia@gmail.com'])
    msg.body = data["body"]
    mail.send(msg)
    return "Sent"


# Run the server
if __name__ == '__main__':
    app.run()
