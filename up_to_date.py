import pandas as pd
import json
import os

# Load the Excel file
df = pd.read_csv('Uptodate Links.csv')
df.columns = ['Call Name', 'URL Bit', 'Full URL']

# Create a dictionary from the Excel data
url_dict = dict(zip(df['Call Name'], df['Full URL']))

guideline = 'depression'
json_file = f'{guideline}.json'  # Path to your JSON file

# Ensure the file exists and read the JSON file
if not os.path.exists(json_file):
    print(f"Error: JSON file {json_file} not found.")
    exit(1)

try:
    with open(json_file, 'r', encoding='utf-8') as file:
        data = json.load(file)
except json.JSONDecodeError as e:
    print(f"Error decoding JSON from {json_file}: {e}")
    exit(1)

# Print the loaded JSON to verify the content
print("Loaded JSON data:")
print(json.dumps(data, indent=4))

# Function to add URLs to the JSON data where there is a "drugs" "name"
def add_urls_to_drugs(data, url_dict):
    if isinstance(data, dict):
        for key, value in data.items():
            if key == 'drugs' and isinstance(value, list):
                for drug in value:
                    if 'name' in drug and drug['name'] in url_dict:
                        if 'url' not in drug:  # Only add URL if it does not already exist
                            drug['url'] = url_dict[drug['name']]
                            print(f"Added URL for {drug['name']}")
            else:
                add_urls_to_drugs(value, url_dict)
    elif isinstance(data, list):
        for item in data:
            add_urls_to_drugs(item, url_dict)

# Add URLs to the JSON data
add_urls_to_drugs(data, url_dict)

# Log a sample of the updated data to verify
print("Updated JSON data:")
print(json.dumps(data, indent=4))

# Save the updated JSON data
updated_json_file = f'{guideline}_updated.json'  # Path for the updated JSON file
with open(updated_json_file, 'w', encoding='utf-8') as file:
    json.dump(data, file, indent=4, ensure_ascii=False)

print(f"Updated JSON data saved to {updated_json_file}")


