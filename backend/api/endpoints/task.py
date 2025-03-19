from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional
from backend.core.models import TaskRequest
from backend.core.ai import prioritize_task
from backend.integrations.trello_service import TrelloService

router = APIRouter(prefix="/api", tags=["task"])

def get_trello_service():
    return TrelloService()

@router.post("/prioritize-task")
def api_prioritize_task(request: TaskRequest):
    try:
        analysis = prioritize_task(request)
        return {"analysis": analysis}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/trello/boards")
def get_trello_boards(trello_service: TrelloService = Depends(get_trello_service)):
    try:
        boards = trello_service.get_boards()
        return {"boards": boards}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/trello/board")
def create_trello_board(name: str, description: Optional[str] = None, trello_service: TrelloService = Depends(get_trello_service)):
    try:
        board = trello_service.create_board(name, description)
        return board
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/trello/card")
def create_trello_card(
    list_id: str,
    name: str,
    description: Optional[str] = None, 
    due: Optional[str] = None, 
    labels: Optional[List[str]] = None, 
    members: Optional[List[str]] = None,
    trello_service: TrelloService = Depends(get_trello_service)
):
    try:
        card = trello_service.create_card(list_id, name, description, due, labels, members)
        return card
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))