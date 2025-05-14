from app.api.dependencies.session import SessionDep
from app.models.category import Category
from app.schemas.category import CategoryCreate

def create_category_db(db: SessionDep, category: CategoryCreate) -> Category:
    category.sanitize()  # Desinfección de entradas
    db_category = Category(**category.dict())
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category

def get_all_categories(db: SessionDep) -> list[Category]:
    categories = db.query(Category).all()
    return categories

def get_category_by_id(db: SessionDep, category_id: str) -> Category | None:
    category = db.query(Category).filter(Category.id == category_id).first()
    return category
