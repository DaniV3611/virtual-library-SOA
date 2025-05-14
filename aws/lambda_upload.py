import json
import base64
import boto3
import os
from urllib.parse import parse_qs
import uuid

s3_client = boto3.client('s3')
BUCKET_NAME = 'bucket-libreria'

def lambda_handler(event, context):
    try:
        # Parse the multipart form data
        if 'body' in event:
            # Check if body is base64 encoded
            if event.get('isBase64Encoded', False):
                body = base64.b64decode(event['body'])
            else:
                body = event['body']
                
            # Extract content type to determine boundary
            content_type = next((h for h in event['headers'].values() if 'multipart/form-data' in h.lower()), '')
            boundary = content_type.split('boundary=')[1].strip()
            
            # Parse multipart form data
            parts = body.split(f'--{boundary}'.encode())
            file_part = None
            file_name = None
            
            # Extract file part
            for part in parts:
                if b'Content-Disposition: form-data; name="file"' in part:
                    file_headers_end = part.find(b'\r\n\r\n')
                    file_content = part[file_headers_end + 4:]
                    
                    # Extract filename
                    filename_start = part.find(b'filename="') + 10
                    if filename_start > 10:
                        filename_end = part.find(b'"', filename_start)
                        file_name = part[filename_start:filename_end].decode('utf-8')
                    else:
                        file_name = f"upload-{uuid.uuid4()}"
                    
                    file_part = file_content.strip(b'\r\n')
            
            # Upload to S3
            if file_part and file_name:
                s3_client.put_object(
                    Bucket=BUCKET_NAME,
                    Key=file_name,
                    Body=file_part
                )
                
                return {
                    'statusCode': 200,
                    'body': json.dumps({
                        'message': 'File uploaded successfully',
                        'file_name': file_name,
                        's3_path': f's3://{BUCKET_NAME}/{file_name}'
                    })
                }
        
        return {
            'statusCode': 400,
            'body': json.dumps({
                'message': 'No file was found in the request'
            })
        }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({
                'message': 'Error processing the file',
                'error': str(e)
            })
        }
