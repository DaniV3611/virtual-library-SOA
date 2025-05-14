import json
import boto3
import os

s3_client = boto3.client('s3')
BUCKET_NAME = 'bucket-libreria'

def lambda_handler(event, context):
    try:
        # Obtener el nombre del archivo del query string
        file_name = event.get('queryStringParameters', {}).get('file_name')
        
        if not file_name:
            return {
                'statusCode': 400,
                'body': json.dumps({'message': 'Parámetro file_name es requerido'})
            }

        # Generar URL pre-firmada válida por 1 hora (3600 segundos)
        presigned_url = s3_client.generate_presigned_url(
            'get_object',
            Params={'Bucket': BUCKET_NAME, 'Key': file_name},
            ExpiresIn=604800   # tiempo en segundos
        )

        return {
            'statusCode': 200,
            'body': json.dumps({
                'message': 'URL generada correctamente',
                'download_url': presigned_url
            })
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'message': 'Error al generar la URL', 'error': str(e)})
        }
