from typing import Annotated
from fastapi import Depends
from app.db.dependiencies import get_db
from sqlalchemy.orm import Session


SessionDep = Annotated[Session, Depends(get_db)]
