# © 2024 Thoughtworks, Inc. | Licensed under the Apache License, Version 2.0  | See LICENSE.md file for permissions.
from typing import Any, Dict, List, Optional
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

from persistence.data_repository import DataRepository


class CreateProjectRequest(BaseModel):
    id: Optional[str] = None
    name: str
    description: Optional[str] = ""
    sections: Optional[List[str]] = None
    timestamp: Optional[int] = None


class UpdateProjectRequest(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    sections: Optional[List[str]] = None


class ActiveProjectRequest(BaseModel):
    projectId: str


class PinboardItemRequest(BaseModel):
    key: str
    value: Any


class ContextItemRequest(BaseModel):
    title: str
    summary: str
    timestamp: Optional[int] = None
    isUserDefined: Optional[bool] = True


class StateSyncRequest(BaseModel):
    projects: Optional[List[Dict[str, Any]]] = None
    activeProjectId: Optional[str] = None
    pinboard: Optional[Dict[str, Any]] = None
    contexts: Optional[Dict[str, Any]] = None


class ApiPersistence:
    def __init__(self, app: FastAPI, data_repository: DataRepository):
        self.app = app
        self.data_repository = data_repository
        self.register_endpoints()

    def register_endpoints(self):
        @self.app.get("/api/persistence/state")
        def get_persistence_state():
            return self.data_repository.get_state()

        @self.app.put("/api/persistence/state")
        def put_persistence_state(request: StateSyncRequest):
            payload = {k: v for k, v in request.model_dump().items() if v is not None}
            return self.data_repository.set_state(payload)

        @self.app.get("/api/projects")
        def get_projects():
            return {
                "projects": self.data_repository.get_projects(),
                "activeProjectId": self.data_repository.get_active_project_id(),
            }

        @self.app.post("/api/projects")
        def create_project(request: CreateProjectRequest):
            if not request.name or not request.name.strip():
                raise HTTPException(status_code=400, detail="Project name is required")
            project = self.data_repository.add_project(request.model_dump())
            return {
                "project": project,
                "activeProjectId": self.data_repository.get_active_project_id(),
            }

        @self.app.put("/api/projects/active")
        def set_active_project(request: ActiveProjectRequest):
            active_id = self.data_repository.set_active_project_id(request.projectId)
            return {"activeProjectId": active_id}

        @self.app.put("/api/projects/{project_id}")
        def update_project(project_id: str, request: UpdateProjectRequest):
            updates = {k: v for k, v in request.model_dump().items() if v is not None}
            updated = self.data_repository.update_project(project_id, updates)
            if not updated:
                raise HTTPException(status_code=404, detail="Project not found")
            return {"project": updated}

        @self.app.delete("/api/projects/{project_id}")
        def delete_project(project_id: str):
            deleted = self.data_repository.delete_project(project_id)
            if not deleted:
                raise HTTPException(
                    status_code=400,
                    detail="Cannot delete default or non-existent project",
                )
            return {
                "deleted": True,
                "activeProjectId": self.data_repository.get_active_project_id(),
            }

        @self.app.get("/api/projects/{project_id}/pinboard")
        def get_project_pinboard(project_id: str):
            return self.data_repository.get_pinboard(project_id)

        @self.app.post("/api/projects/{project_id}/pinboard")
        def add_project_pinboard_item(project_id: str, request: PinboardItemRequest):
            return self.data_repository.save_pinboard_item(
                project_id, request.key, request.value
            )

        @self.app.delete("/api/projects/{project_id}/pinboard/{timestamp}")
        def delete_project_pinboard_item(project_id: str, timestamp: str):
            deleted = self.data_repository.delete_pinboard_item(project_id, timestamp)
            return {"deleted": deleted}

        @self.app.get("/api/projects/{project_id}/contexts")
        def get_project_contexts(project_id: str):
            return self.data_repository.get_contexts(project_id)

        @self.app.post("/api/projects/{project_id}/contexts")
        def add_project_context(project_id: str, request: ContextItemRequest):
            return self.data_repository.save_context(
                project_id, request.model_dump()
            )

        @self.app.delete("/api/projects/{project_id}/contexts/{timestamp}")
        def delete_project_context(project_id: str, timestamp: str):
            deleted = self.data_repository.delete_context(project_id, timestamp)
            return {"deleted": deleted}

        @self.app.get("/api/projects/{project_id}/sessions")
        def get_project_sessions(project_id: str):
            return self.data_repository.get_sessions(project_id)

        @self.app.get("/api/sessions/{session_id}")
        def get_session_by_id(session_id: str):
            session = self.data_repository.get_session(session_id)
            if not session:
                raise HTTPException(status_code=404, detail="Session not found")
            return session
