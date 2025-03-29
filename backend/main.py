from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.core.config import API_TITLE, CORS_ORIGINS, API_HOST, API_PORT
from backend.api.router import api_router

# Initialize the FastAPI app
app = FastAPI(title=API_TITLE)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # React and Vite default ports
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include all API routes
app.include_router(api_router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Task Automator API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host=API_HOST, port=API_PORT)