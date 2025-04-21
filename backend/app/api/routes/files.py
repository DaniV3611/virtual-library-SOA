from fastapi import APIRouter, UploadFile, File, HTTPException
import httpx
from fastapi.responses import JSONResponse
import json
from urllib.parse import quote

from app.api.dependencies.deps import UserIsAdminDep

router = APIRouter()

@router.post("/upload")
async def upload_file(current_user: UserIsAdminDep, file: UploadFile = File(...)):
    try:
        # Leer el contenido del archivo
        file_content = await file.read()
        
        # Crear el cliente HTTP
        async with httpx.AsyncClient() as client:
            # 1. Subir el archivo a la primera Lambda
            upload_response = await client.post(
                "https://dgmlwgbfj2.execute-api.us-east-1.amazonaws.com/default/Lambda-el-mancho",
                files={"file": (file.filename, file_content)}
            )
            
            # Verificar si la respuesta fue exitosa
            upload_response.raise_for_status()
            
            # Parsear la respuesta del upload
            upload_data = json.loads(upload_response.text)
            file_name = upload_data["file_name"]
            
            # 2. Obtener el enlace de visualización
            preview_url = f"https://s6cq63bt8c.execute-api.us-east-1.amazonaws.com/default/Lambda-el-mancho-2?file_name={quote(file_name)}"
            preview_response = await client.get(preview_url)
            
            # Verificar si la respuesta fue exitosa
            preview_response.raise_for_status()
            
            # Devolver la respuesta combinada
            return JSONResponse(content={
                "status": "success",
                "file_name": file_name,
                "s3_path": upload_data["s3_path"],
                "preview_url": preview_response.json()
            })
            
    except httpx.HTTPError as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error en la comunicación con los servicios: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error al procesar el archivo: {str(e)}"
        )

