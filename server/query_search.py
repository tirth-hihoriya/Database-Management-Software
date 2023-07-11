from flask import jsonify
import pandas as pd
import re
import json
import requests


def get_suggested_url(company_name):
    url = "https://autocomplete.clearbit.com/v1/companies/suggest?query=" + company_name
    text = requests.get(url).text
    json_text = json.loads(text)
    try:
        final_url = 'https://www.' + json_text[0]['domain']
    except:
        final_url = 'https://www.google.com/search?q=' + company_name
    return final_url

def get_suggested_url_list(company_name_list):
    url_list = []
    for company_name in company_name_list:
        url_list.append(get_suggested_url(company_name))
    return url_list


def cleaned_query(input_text):
    """
    Cleans the input query text by splitting it and removing empty values and leading/trailing whitespaces.

    Args:
        input_text (str): The input query text.

    Returns:
        list: A cleaned list of query values.
    """
    query1 = input_text.split(",")
    query2 = [x.split('\n') for x in query1]
    query = [item.strip() for sublist in query2 for item in sublist if item.strip() != '']
    return query

def search_query(query, selectedCategory):
    """
    Performs a search query based on the given query and selected category.

    Args:
        query (list): A list of query values.
        selectedCategory (str): The selected search category.

    Returns:
        flask.Response: A JSON response containing the filtered data, filtered contacts data,
                        company names not included, and company names not included in contacts.
    """
    file_paths = {
        'company_data_path': 'server/company_filled_final_csv.csv',
        'contacts_data_path': 'server/contacts_filled_final_csv.csv',
        'temp_company_file_path': 'server/temp_processed_company_data.csv',
        'temp_contacts_file_path': 'server/temp_processed_contacts_data.csv'
    }

    if query == "" or query == []:
        return jsonify({
            'filteredData': pd.DataFrame(),
            'filteredContactsData': pd.DataFrame(),
            'companyNotIncluded': [],
            'companyNotIncludedInContacts': []
        })
    else:
        if selectedCategory == 'companyName':
            return query_company(query, file_paths)
        elif selectedCategory == 'industry':
            return query_industry(query, file_paths)
        elif selectedCategory == 'type':
            return query_type(query, file_paths)
    return {
        'filteredData': pd.DataFrame(),
        'filteredContactsData': pd.DataFrame(),
        'companyNotIncluded': [],
        'companyNotIncludedInContacts': []
    }


def query_company(query, file_paths):
    """
    Performs a query based on company names.

    Args:
        query (list): A list of query values.
        file_paths (dict): A dictionary containing file paths.

    Returns:
        flask.Response: A JSON response containing the filtered data, filtered contacts data,
                        company names not included, and company names not included in contacts.
    """
    companydf = pd.read_csv(file_paths['company_data_path'])
    contactsdf = pd.read_csv(file_paths['contacts_data_path'])
    contactsdf['Associated Company IDs'] = pd.to_numeric(contactsdf['Associated Company IDs'], errors='coerce').astype('Int64')
    companydf['Record ID'] = pd.to_numeric(companydf['Record ID'], errors='coerce').astype('Int64')

    pattern = '|'.join([re.escape(q) for q in query])
    filteredCompanies_df = companydf[companydf['Company name'].str.contains(pattern, case=False, regex=True)].reset_index()
    record_ids = filteredCompanies_df['Record ID'].tolist()

    filteredContacts_df = contactsdf[contactsdf['Associated Company IDs'].isin(record_ids)]
    # filteredContacts_df = contactsdf[contactsdf['Company Name'].str.contains(pattern, case=False, regex=True)].reset_index()

    filteredCompanies_df.to_csv(file_paths['temp_company_file_path'], index=False)
    filteredContacts_df.to_csv(file_paths['temp_contacts_file_path'], index=False)

    filtered_company_names = set(filteredCompanies_df['Company name'])
    filtered_company_names_inContacts = set(filteredContacts_df['Company Name'])

    pattern1 = '|'.join([re.escape(name) for name in filtered_company_names])
    not_included_company_names = [name for name in query if not re.search(pattern1, name, re.IGNORECASE)]


    

    pattern2 = '|'.join([re.escape(name) for name in filtered_company_names_inContacts])
    not_included_company_names_inContacts = [name for name in query if not re.search(pattern2, name, re.IGNORECASE)]

    suggestedUrlCompany = get_suggested_url_list(not_included_company_names)
    suggestedUrlContacts = get_suggested_url_list(not_included_company_names_inContacts)

    return jsonify({
        'filteredData': filteredCompanies_df.to_dict('records'),
        'filteredContactsData': filteredContacts_df.to_dict('records'),
        'companyNotIncluded': not_included_company_names,
        'companyNotIncludedInContacts': not_included_company_names_inContacts,
        'suggestedUrlCompany': suggestedUrlCompany,
        'suggestedUrlContacts': suggestedUrlContacts
    })

def query_industry(query, file_paths):
    """
    Performs a query based on industry.

    Args:
        query (list): A list of query values.
        file_paths (dict): A dictionary containing file paths.

    Returns:
        flask.Response: A JSON response containing the filtered data, filtered contacts data,
                        company names not included, and company names not included in contacts.
    """
    companydf = pd.read_csv(file_paths['company_data_path'])
    contactsdf = pd.read_csv(file_paths['contacts_data_path'])
    contactsdf['Associated Company IDs'] = pd.to_numeric(contactsdf['Associated Company IDs'], errors='coerce').astype('Int64')
    companydf['Record ID'] = pd.to_numeric(companydf['Record ID'], errors='coerce').astype('Int64')

    # Create a pattern to match any of the query words
    pattern = '|'.join([re.escape(q) for q in query])

    # Function to check if any query word matches the values in a comma-separated field
    def match_comma_separated(value):
        if pd.isna(value):
            return False
        values = value.split(',')
        for val in values:
            if re.search(pattern, val.strip(), re.IGNORECASE):
                return True
        return False

    # Filter the company DataFrame based on the specified columns and the query pattern
    filteredCompanies_df = companydf[
        companydf['CB 1st Priority'].str.contains(pattern, case=False, na=False, regex=True) |
        companydf['CB 2nd Priority'].str.contains(pattern, case=False, na=False, regex=True) |
        companydf['Industry'].str.contains(pattern, case=False, na=False, regex=True) |
        companydf['CB Industries'].apply(match_comma_separated) |
        companydf['CB Industry Groups'].apply(match_comma_separated)
    ]

    record_ids = filteredCompanies_df['Record ID'].tolist()

    filteredContacts_df = contactsdf[contactsdf['Associated Company IDs'].isin(record_ids)]
    
    filteredCompanies_df.to_csv(file_paths['temp_company_file_path'], index=False)
    filteredContacts_df.to_csv(file_paths['temp_contacts_file_path'], index=False)

    filtered_company_names = set(filteredCompanies_df['Company name'])
    filtered_company_names_inContacts = set(filteredContacts_df['Company Name'])

    pattern1 = '|'.join([re.escape(name) for name in filtered_company_names])
    not_included_company_names = [name for name in query if not re.search(pattern1, name, re.IGNORECASE)]

    pattern2 = '|'.join([re.escape(name) for name in filtered_company_names_inContacts])
    not_included_company_names_inContacts = [name for name in query if not re.search(pattern2, name, re.IGNORECASE)]

    return jsonify({
        'filteredData': filteredCompanies_df.to_dict('records'),
        'filteredContactsData': filteredContacts_df.to_dict('records'),
        'companyNotIncluded': [],
        'companyNotIncludedInContacts': [],
           'suggestedUrlCompany': [],
        'suggestedUrlContacts': []
    })



def query_type(query, file_paths):
    """
    Performs a query based on type category.

    Args:
        query (list): A list of query values.
        file_paths (dict): A dictionary containing file paths.

    Returns:
        flask.Response: A JSON response containing the filtered data, filtered contacts data,
                        company names not included, and company names not included in contacts.
    """

    companydf = pd.read_csv(file_paths['company_data_path'])
    contactsdf = pd.read_csv(file_paths['contacts_data_path'])
    contactsdf['Associated Company IDs'] = pd.to_numeric(contactsdf['Associated Company IDs'], errors='coerce').astype('Int64')
    companydf['Record ID'] = pd.to_numeric(companydf['Record ID'], errors='coerce').astype('Int64')

    # Create a pattern to match any of the query words
    pattern = '|'.join([re.escape(q) for q in query])

    # Function to check if any query word matches the values in a comma-separated field
    filteredCompanies_df = companydf[companydf['CB Investor Type'].str.contains(pattern, case=False, regex=True)].reset_index()


    record_ids = filteredCompanies_df['Record ID'].tolist()

    filteredContacts_df = contactsdf[contactsdf['Associated Company IDs'].isin(record_ids)]
    
    filteredCompanies_df.to_csv(file_paths['temp_company_file_path'], index=False)
    filteredContacts_df.to_csv(file_paths['temp_contacts_file_path'], index=False)

    filtered_company_names = set(filteredCompanies_df['Company name'])
    filtered_company_names_inContacts = set(filteredContacts_df['Company Name'])

    pattern1 = '|'.join([re.escape(name) for name in filtered_company_names])
    not_included_company_names = [name for name in query if not re.search(pattern1, name, re.IGNORECASE)]

    pattern2 = '|'.join([re.escape(name) for name in filtered_company_names_inContacts])
    not_included_company_names_inContacts = [name for name in query if not re.search(pattern2, name, re.IGNORECASE)]


    return jsonify({
        'filteredData': filteredCompanies_df.to_dict('records'),
        'filteredContactsData': filteredContacts_df.to_dict('records'),
        'companyNotIncluded': [],
        'companyNotIncludedInContacts': [],
           'suggestedUrlCompany': [],
        'suggestedUrlContacts': []
    })
