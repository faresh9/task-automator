from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Welcome to the Business Automation System!"}


@app.get("/tasks")
def get_tasks():
    return {"tasks": ["Task 1", "Task 2", "Task 3"]}