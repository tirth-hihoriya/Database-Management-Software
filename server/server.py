from flask import Flask, jsonify, request, send_file
import pandas as pd
from flask_cors import CORS
import io
import os
import random
import string
import re

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
    query1 = input_text.split(",")
    query2 = [x.split('\n') for x in query1]
    query = [item.strip() for sublist in query2 for item in sublist if item.strip() != '']

   
    # read the excel file
    companydf = pd.read_csv('./server/company_filled_final_csv.csv')

    pattern = '|'.join([re.escape(q) for q in query])
    filtered_df_ = companydf[companydf['Company name'].str.contains(pattern, case=False, regex=True)].reset_index()

    # filter the data based on the query
    # return the filtered data as a JSON response
    temp_file_path = f'server/temp_processed_company_data.csv'
    filtered_df_.to_csv(temp_file_path, index=False)
    

    filtered_company_names = set(filtered_df_['Company name'])
    pattern = '|'.join([re.escape(name) for name in filtered_company_names])
    not_included_company_names = [name for name in query if not re.search(pattern, name, re.IGNORECASE)]

    neededcolumns = ['Company name', 'City', 'Company Domain Name']  # Replace with your desired column names

    filtered_df = filtered_df_[neededcolumns].copy()
    if query=="":
            print(query, "\n\nEmpty\n")
            filtered_df = pd.DataFrame()
            not_included_company_names = []
    return jsonify({'filteredData': filtered_df.to_dict('records'), 'companyNotIncluded' : not_included_company_names})


# Define a route for downloading the processed Excel file
@app.route('/api/download', methods=['GET'])
def download_excel():
    temp_file_path = r'./server/temp_processed_company_data.csv'
    print(temp_file_path)
    if os.path.exists(temp_file_path):
        print('file exists')
        return send_file('temp_processed_company_data.csv',
                         as_attachment=True)

    return jsonify({'error': 'File not found!!'})


# Run the server
if __name__ == '__main__':
    app.run()
