from fastapi import APIRouter, HTTPException, Depends, Body
from typing import List, Optional
from backend.core.models import TaskRequest, TaskStatus
from backend.core.ai import prioritize_task
import json
import os
from datetime import datetime
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr, field_validator
router = APIRouter(prefix="/api", tags=["task"])

# Create a simple file-based task storage
TASKS_FILE = Path("backend/data/tasks.json")

def get_tasks():
    """Get all tasks from the local storage."""
    if not TASKS_FILE.exists():
        TASKS_FILE.parent.mkdir(parents=True, exist_ok=True)
        return []
    
    try:
        with open(TASKS_FILE, "r") as f:
            return json.load(f)
    except (json.JSONDecodeError, FileNotFoundError):
        return []

def save_tasks(tasks):
    """Save tasks to the local storage."""
    with open(TASKS_FILE, "w") as f:
        json.dump(tasks, f, indent=2)

@router.post("/prioritize-task")
def api_prioritize_task(request: TaskRequest):
    try:
        analysis = prioritize_task(request)
        return {"analysis": analysis}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/tasks")
def get_all_tasks():
    """Get all tasks."""
    try:
        return {"tasks": get_tasks()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/task")
def create_task(request: TaskRequest):
    """Create a new task."""
    try:
        # Use the AI to analyze the task
        analysis = prioritize_task(request)
        
        # Create the task
        task = {
            "id": f"task_{int(datetime.now().timestamp())}",
            "description": request.description,
            "assigned_to": request.assigned_to,
            "deadline": request.deadline,
            "priority": request.priority,
            "status": "To Do",
            "analysis": analysis,
            "created_at": datetime.now().isoformat()
        }
        
        # Save to local storage
        tasks = get_tasks()
        tasks.append(task)
        save_tasks(tasks)
        
        return task
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class StatusUpdate(BaseModel):
    status: str

@router.put("/task/{task_id}/status")
def update_task_status(task_id: str, update: StatusUpdate):
    """Update a task's status."""
    try:
        tasks = get_tasks()
        
        for task in tasks:
            if task.get("id") == task_id:
                task["status"] = update.status
                task["updated_at"] = datetime.now().isoformat()
                save_tasks(tasks)
                return task
                
        raise HTTPException(status_code=404, detail="Task not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))