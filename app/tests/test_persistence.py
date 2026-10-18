# © 2024 Thoughtworks, Inc. | Licensed under the Apache License, Version 2.0  | See LICENSE.md file for permissions.
import os
import tempfile
from fastapi import FastAPI
from fastapi.testclient import TestClient

from persistence.data_repository import DataRepository, DEFAULT_PROJECT_SECTIONS
from api.api_persistence import ApiPersistence


def test_data_repository_persists_across_instances():
    with tempfile.TemporaryDirectory() as tmpdir:
        file_path = os.path.join(tmpdir, "haiven_data.json")
        repo1 = DataRepository(file_path=file_path)

        # Default state
        assert len(repo1.get_projects()) == 1
        assert repo1.get_active_project_id() == "default"

        # Add project, pinboard item, context, and session
        project = repo1.add_project(
            {
                "id": "project-100",
                "name": "Persistent Project",
                "description": "Saved to disk",
                "sections": ["research", "coding"],
            }
        )
        assert project["id"] == "project-100"
        assert repo1.get_active_project_id() == "project-100"

        repo1.save_pinboard_item(
            "project-100", "17000001", {"content": "Pinned note", "isUserDefined": True}
        )
        repo1.save_context(
            "project-100",
            {
                "title": "Domain Context",
                "summary": "E-commerce domain",
                "timestamp": 17000002,
                "isUserDefined": True,
            },
        )
        repo1.save_session(
            session_id="chat-1",
            project_id="project-100",
            category="research",
            messages=[{"role": "HaivenHumanMessage", "content": "Hello"}],
        )

        # Create a brand new repository instance pointing to the same file
        repo2 = DataRepository(file_path=file_path)
        assert len(repo2.get_projects()) == 2
        assert repo2.get_active_project_id() == "project-100"
        assert repo2.get_pinboard("project-100")["17000001"]["content"] == "Pinned note"
        contexts = repo2.get_contexts("project-100")
        assert len(contexts) == 1
        assert contexts[0]["title"] == "Domain Context"
        sessions = repo2.get_sessions("project-100")
        assert len(sessions) == 1
        assert sessions[0]["session_id"] == "chat-1"


def test_api_persistence_endpoints():
    with tempfile.TemporaryDirectory() as tmpdir:
        file_path = os.path.join(tmpdir, "haiven_data.json")
        repo = DataRepository(file_path=file_path)
        app = FastAPI()
        ApiPersistence(app, repo)
        client = TestClient(app)

        # 1. Initial state
        res = client.get("/api/projects")
        assert res.status_code == 200
        assert res.json()["activeProjectId"] == "default"
        assert len(res.json()["projects"]) == 1

        # 2. Create project
        res = client.post(
            "/api/projects",
            json={
                "id": "project-200",
                "name": "API Project",
                "description": "Created via API",
                "sections": ["ideate", "architecture"],
            },
        )
        assert res.status_code == 200
        assert res.json()["project"]["name"] == "API Project"
        assert res.json()["activeProjectId"] == "project-200"

        # 3. Add pinboard note to project
        res = client.post(
            "/api/projects/project-200/pinboard",
            json={"key": "12345", "value": {"content": "Note 1", "isUserDefined": True}},
        )
        assert res.status_code == 200
        assert "12345" in res.json()

        # 4. Add context to project
        res = client.post(
            "/api/projects/project-200/contexts",
            json={
                "title": "Arch Context",
                "summary": "Microservices",
                "timestamp": 999,
                "isUserDefined": True,
            },
        )
        assert res.status_code == 200
        assert len(res.json()) == 1

        # 5. Get full persistence state
        res = client.get("/api/persistence/state")
        assert res.status_code == 200
        state = res.json()
        assert state["activeProjectId"] == "project-200"
        assert "12345" in state["pinboard"]["project-200"]
        assert state["contexts"]["project-200"][0]["title"] == "Arch Context"

        # 6. Delete context and pinboard note
        res = client.delete("/api/projects/project-200/contexts/999")
        assert res.status_code == 200
        assert res.json()["deleted"] is True

        res = client.delete("/api/projects/project-200/pinboard/12345")
        assert res.status_code == 200
        assert res.json()["deleted"] is True

        # 7. Delete project
        res = client.delete("/api/projects/project-200")
        assert res.status_code == 200
        assert res.json()["activeProjectId"] == "default"
