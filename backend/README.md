# Library Management System Backend

This repository contains the backend API for the Library Management System, built with FastAPI and SQLAlchemy.

## Features

- RESTful API for managing books and library resources
- Database models with SQLAlchemy ORM
- Database migrations with Alembic
- Authentication and authorization
- API documentation with Swagger UI

## Getting Started

### Prerequisites

- Python 3.9+
- PostgreSQL database
- pip package manager

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd library-2/backend
```

2. Create and activate a virtual environment:

```bash
python -m venv .venv
# On Windows
.venv\Scripts\activate
# On macOS/Linux
source .venv/bin/activate
```

3. Install dependencies:

```bash
pip install -r requirements.txt
```

### Environment Variables

Create a `.env` file in the backend directory with the following variables:

```sh
# Database Connection
DATABASE_URL=postgresql://username:password@localhost:5432/library_db

# Security
SECRET_KEY=your_secret_key_here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# API Settings
API_V1_STR=/api

# Debug mode
DEBUG=True
```

### Database Setup

1. Create the database:

```bash
# Using psql
createdb library_db
```

2. Run migrations to create database tables:

```bash
alembic upgrade head
```

To create a new migration after changing models:

```bash
alembic revision --autogenerate -m "Description of changes"
```

### Running the Application

Start the development server:

```bash
uvicorn app.main:app --reload
```

The API will be available at http://localhost:8000

API documentation is available at:

- http://localhost:8000/docs (Swagger UI)
- http://localhost:8000/redoc (ReDoc)

## Project Structure

```
backend/
├── alembic/            # Database migrations
│   ├── versions/       # Migration versions
│   └── env.py          # Migration environment
├── app/                # Application code
│   ├── api/            # API endpoints
│   │   ├── dependencies.py  # API dependencies
│   │   ├── routes/     # API route modules
│   │   └── ...
│   ├── core/           # Core modules
│   │   ├── config.py   # App configuration
│   │   └── security.py # Security functions
│   ├── db/             # Database setup
│   │   └── session.py  # Database session
│   ├── models/         # SQLAlchemy models
│   ├── schemas/        # Pydantic schemas
│   └── main.py         # Application entry point
├── tests/              # Test modules
├── .env                # Environment variables
├── alembic.ini         # Alembic configuration
└── requirements.txt    # Python dependencies
```

## API Endpoints

- `GET /api/books/`: Get all books
- `POST /api/books/`: Create a new book
- `GET /api/books/{book_id}`: Get a specific book by ID
- Additional endpoints documented in the Swagger UI

## Running Tests

```bash
pytest
```

## Development Notes

- Make sure to run `alembic upgrade head` after pulling changes that include database migrations
- Use `pydantic` models in the `schemas` directory for request/response validation
- Add new routes in the `app/api/routes/` directory

## Troubleshooting

### Common Issues

1. **Database connection error**:

   - Verify that the PostgreSQL server is running
   - Check the `DATABASE_URL` in your `.env` file

2. **Migration errors**:

   - If you encounter errors during migrations, try:
     ```bash
     alembic downgrade base
     alembic upgrade head
     ```

3. **Validation errors in responses**:
   - Ensure that model fields match the schema definitions
   - Check for nullable fields that should be marked as `Optional[Type]`
