// © 2024 Thoughtworks, Inc. | Licensed under the Apache License, Version 2.0  | See LICENSE.md file for permissions.
import React, { useState, useEffect } from "react";
import { Select, Button, Modal, Input, Checkbox, Tooltip } from "antd";
import {
  RiAddBoxLine,
  RiBriefcase2Line,
  RiDeleteBinLine,
} from "react-icons/ri";
import { toast } from "react-toastify";
import {
  getProjects,
  getActiveProject,
  setActiveProject,
  addProject,
  deleteProject,
  DEFAULT_PROJECT_SECTIONS,
} from "./_local_store";
import { PROJECT_SECTION_OPTIONS } from "./_navigation_items";

const ProjectSelector = ({ onProjectChange }) => {
  const [projects, setProjects] = useState(() => getProjects());
  const [activeProject, setActiveProjectState] = useState(() =>
    getActiveProject(),
  );
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [selectedSections, setSelectedSections] = useState(
    DEFAULT_PROJECT_SECTIONS,
  );

  const syncProjects = () => {
    const updatedProjects = getProjects();
    const currentActive = getActiveProject();
    setProjects(updatedProjects);
    setActiveProjectState(currentActive);
    if (onProjectChange) {
      onProjectChange(currentActive);
    }
  };

  useEffect(() => {
    syncProjects();
    if (typeof window !== "undefined") {
      window.addEventListener("update-project", syncProjects);
      return () => {
        window.removeEventListener("update-project", syncProjects);
      };
    }
  }, []);

  const handleSelectProject = (projectId) => {
    const selected = setActiveProject(projectId);
    setActiveProjectState(selected);
    if (onProjectChange) {
      onProjectChange(selected);
    }
  };

  const resetModal = () => {
    setProjectName("");
    setProjectDescription("");
    setSelectedSections(DEFAULT_PROJECT_SECTIONS);
    setIsAddModalOpen(false);
  };

  const handleAddProject = () => {
    if (!projectName.trim()) {
      toast.error("Please enter a project name");
      return;
    }
    if (!selectedSections || selectedSections.length === 0) {
      toast.error("Please select at least one project section");
      return;
    }

    const created = addProject(
      projectName,
      projectDescription,
      selectedSections,
    );
    if (created) {
      toast.success(`Project "${created.name}" created!`);
      resetModal();
      syncProjects();
    }
  };

  const handleDeleteProject = () => {
    if (!activeProject || activeProject.isDefault) return;
    const deletedName = activeProject.name;
    if (deleteProject(activeProject.id)) {
      toast.success(`Project "${deletedName}" deleted!`);
      syncProjects();
    }
  };

  const projectOptions = projects.map((project) => ({
    value: project.id,
    label: project.name,
  }));

  const sectionCheckboxOptions = PROJECT_SECTION_OPTIONS.map((opt) => ({
    label: opt.label,
    value: opt.key,
  }));

  return (
    <div className="project-selector-container" data-testid="project-selector">
      <div className="project-selector-header">
        <span className="project-selector-title">
          <RiBriefcase2Line
            style={{
              marginRight: "6px",
              fontSize: "1rem",
              verticalAlign: "middle",
            }}
          />
          Project
        </span>
        <div className="project-selector-actions">
          {!activeProject?.isDefault && (
            <Tooltip title="Delete current project">
              <Button
                type="link"
                size="small"
                onClick={handleDeleteProject}
                data-testid="delete-project-button"
                aria-label="Delete project"
                className="project-action-btn"
              >
                <RiDeleteBinLine fontSize="medium" />
              </Button>
            </Tooltip>
          )}
          <Tooltip title="Add a new project">
            <Button
              type="link"
              size="small"
              onClick={() => setIsAddModalOpen(true)}
              data-testid="add-project-button"
              aria-label="Add project"
              className="project-action-btn"
            >
              <RiAddBoxLine fontSize="medium" /> Add
            </Button>
          </Tooltip>
        </div>
      </div>

      <Select
        value={activeProject?.id}
        onChange={handleSelectProject}
        options={projectOptions}
        data-testid="project-select"
        className="project-select-dropdown"
        size="small"
        style={{ width: "100%" }}
      />

      <Modal
        title="Add new Project"
        open={isAddModalOpen}
        onCancel={resetModal}
        onOk={handleAddProject}
        okText="Save Project"
        className="add-project-modal"
      >
        <div className="project-form-field">
          <label className="label" htmlFor="project-name-input">
            Project Name
          </label>
          <Input
            id="project-name-input"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="e.g., Retail Modernization"
            data-testid="project-name-input"
          />
        </div>

        <div className="project-form-field" style={{ marginTop: "12px" }}>
          <label className="label" htmlFor="project-description-input">
            Description (optional)
          </label>
          <Input.TextArea
            id="project-description-input"
            value={projectDescription}
            onChange={(e) => setProjectDescription(e.target.value)}
            placeholder="Brief description of the project"
            autoSize={{ minRows: 2, maxRows: 5 }}
            data-testid="project-description-input"
          />
        </div>

        <div className="project-form-field" style={{ marginTop: "12px" }}>
          <label className="label" style={{ display: "block", marginBottom: "6px" }}>
            Project Sections (Software Delivery)
          </label>
          <Checkbox.Group
            options={sectionCheckboxOptions}
            value={selectedSections}
            onChange={(checkedValues) => setSelectedSections(checkedValues)}
            data-testid="project-sections-checkbox-group"
          />
        </div>
      </Modal>
    </div>
  );
};

export default ProjectSelector;
