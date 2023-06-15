from flask import Flask, jsonify, request, send_file
import pandas as pd
from flask_cors import CORS
import io
import os
import random
import string

app = Flask(__name__)
CORS(app)

# Define a route for preprocessing the Excel file
@app.route('/api/preprocess', methods=['POST'])
def preprocess_excel():
    # Check if a file was uploaded
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'})

    file = request.files['file']

    # Check if the file is of the allowed type
    allowed_extensions = {'xlsx', 'xls'}
    if file.filename.split('.')[-1].lower() not in allowed_extensions:
        return jsonify({'error': 'Invalid file type'})

    # Read the Excel file into a DataFrame
    df = pd.read_excel(file)

    # Preprocess the data (filter rows based on a condition)
    # filtered_data = df[df['Age'] >= 26]
    filtered_data = df
    # Convert the filtered data to a new DataFrame
    filtered_df = pd.DataFrame(filtered_data)

    # Save the filtered data to an Excel file
    filtered_df.to_excel('processed_data.xlsx', index=False)

    # Set the appropriate file headers
    headers = {
        'Content-Disposition': 'attachment; filename=processed_data.xlsx',
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    }

    # Generate a random download token
    download_token = ''.join(random.choices(string.ascii_letters + string.digits, k=16))
    filtered_df.to_excel(f'temp_processed_data.xlsx', index=False)
 

    

    # Return the file path for download link
    download_link = f'/api/download/temp'
    return jsonify({'filteredData': filtered_data.to_dict('records'), 'downloadLink': download_link})


@app.route('/api/query', methods=['GET'])
def query():
    # get text input from user 
    query = request.args.get('query')
    print(query)
    # read the excel file
    df = pd.read_excel('processed_data.xlsx')
    # filter the data based on the query
    filtered_data = df[df['Name'].str.contains(query, case=False)]
    # return the filtered data as a JSON response
    temp_file_path = f'temp_processed_data.xlsx'
    filtered_data.to_excel(temp_file_path, index=False)
    return jsonify({'filteredData': filtered_data.to_dict('records')})


# Define a route for downloading the processed Excel file
@app.route('/api/download/<token>', methods=['GET'])
def download_excel(token):
    temp_file_path = f'temp_processed_data.xlsx'
    print(temp_file_path)
    if os.path.exists(temp_file_path):
        print('file exists')
        return send_file(temp_file_path, as_attachment=True)

    return jsonify({'error': 'File not found'})


# Run the server
if __name__ == '__main__':
    app.run()
