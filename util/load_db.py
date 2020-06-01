import csv
import boto3
import requests

THE_SRC_URL = 'https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-counties.csv'

def create_dynamodb_table():
    dynamodb_client = boto3.client('dynamodb')

    try:
        response = dynamodb_client.create_table(
            AttributeDefinitions=[
                {
                    'AttributeName': 'date',
                    'AttributeType': 'S',
                },
                {
                    'AttributeName': 'state_county',
                    'AttributeType': 'S',
                },
                {
                    'AttributeName': 'fips',
                    'AttributeType': 'S',
                }
            ],
            KeySchema=[
                {
                    'AttributeName': 'state_county',
                    'KeyType': 'HASH',
                },
                {
                    'AttributeName': 'date',
                    'KeyType': 'RANGE',
                },
            ],
            GlobalSecondaryIndexes=[ 
                { 
                    "IndexName": "fips_global_secondary_idx",
                    "KeySchema": [
                        {
                            'AttributeName': 'fips',
                            'KeyType': 'HASH',
                        },
                        {
                            'AttributeName': 'date',
                            'KeyType': 'RANGE',
                        },
                    ],
                    'Projection': {
                        'ProjectionType': 'ALL',
                    },
                    'ProvisionedThroughput': {
                        'ReadCapacityUnits': 5,
                        'WriteCapacityUnits': 5,
                    }
                },
            ],
            ProvisionedThroughput={
                'ReadCapacityUnits': 5,
                'WriteCapacityUnits': 5,
            },
            TableName='us-counties-covid-19',
        )
    except dynamodb_client.exceptions.ResourceInUseException as e:
        print(e)
        pass

def get_covid_19_data_as_json():
    url = THE_SRC_URL
    r = requests.get(url, allow_redirects=True)
    rows = [row for row in csv.reader(r.text.splitlines(), delimiter=',')]

    col_names = rows[0]
    items = []
    for row in rows[1:]:
        i = 0
        row_dic = {}
        for col_name in col_names:
            row_dic[col_name] = row[i]
            i += 1
        items.append(row_dic)
    return items

def batch_write(items):
   dynamodb = boto3.resource('dynamodb')
   db = dynamodb.Table('covid19-live-nyt')

   with db.batch_writer() as batch:
      for item in items:
         batch.put_item(Item=item)

if __name__ == '__main__':
    create_dynamodb_table()
    items = get_covid_19_data_as_json()
    batch_write(items)