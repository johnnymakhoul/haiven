// © 2024 Thoughtworks, Inc. | Licensed under the Apache License, Version 2.0  | See LICENSE.md file for permissions.
import { toast } from "react-toastify";

export const DEFAULT_PROJECT_SECTIONS = [
  "research",
  "ideate",
  "analysis",
  "coding",
  "testing",
  "architecture",
  "other",
];

export const DEFAULT_PROJECT = {
  id: "default",
  name: "Default Project",
  description: "Default workspace project",
  sections: DEFAULT_PROJECT_SECTIONS,
  isDefault: true,
};

export const getProjects = () => {
  try {
    const raw = localStorage.getItem("projects");
    const parsed = raw ? JSON.parse(raw) : null;
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return [DEFAULT_PROJECT];
    }
    const hasDefault = parsed.some((p) => p.id === DEFAULT_PROJECT.id);
    return hasDefault ? parsed : [DEFAULT_PROJECT, ...parsed];
  } catch (e) {
    return [DEFAULT_PROJECT];
  }
};

export const getActiveProjectId = () => {
  try {
    const activeId = localStorage.getItem("activeProjectId");
    if (!activeId) return DEFAULT_PROJECT.id;
    const projects = getProjects();
    return projects.some((p) => p.id === activeId)
      ? activeId
      : DEFAULT_PROJECT.id;
  } catch (e) {
    return DEFAULT_PROJECT.id;
  }
};

export const getActiveProject = () => {
  const projects = getProjects();
  const activeId = getActiveProjectId();
  return (
    projects.find((p) => p.id === activeId) || projects[0] || DEFAULT_PROJECT
  );
};

export const setActiveProject = (projectId) => {
  const projects = getProjects();
  const target = projects.find((p) => p.id === projectId);
  const resolvedId = target ? target.id : DEFAULT_PROJECT.id;
  localStorage.setItem("activeProjectId", resolvedId);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("update-project"));
    window.dispatchEvent(new Event("update-context"));
  }
  return target || DEFAULT_PROJECT;
};

export const addProject = (
  name,
  description = "",
  sections = DEFAULT_PROJECT_SECTIONS,
) => {
  const trimmedName = (name || "").trim();
  if (!trimmedName) {
    return null;
  }
  const projects = getProjects();
  const timestamp = Date.now();
  const newProject = {
    id: `project-${timestamp}`,
    name: trimmedName,
    description: (description || "").trim(),
    sections:
      Array.isArray(sections) && sections.length > 0
        ? sections
        : DEFAULT_PROJECT_SECTIONS,
    timestamp,
    isDefault: false,
  };
  const updatedProjects = [...projects, newProject];
  localStorage.setItem("projects", JSON.stringify(updatedProjects));
  setActiveProject(newProject.id);
  return newProject;
};

export const deleteProject = (projectId) => {
  if (!projectId || projectId === DEFAULT_PROJECT.id) {
    return false;
  }
  const projects = getProjects();
  const updatedProjects = projects.filter((p) => p.id !== projectId);
  localStorage.setItem("projects", JSON.stringify(updatedProjects));
  if (typeof localStorage.removeItem === "function") {
    localStorage.removeItem(`pinboard_${projectId}`);
    localStorage.removeItem(`context_${projectId}`);
  } else {
    localStorage.setItem(`pinboard_${projectId}`, JSON.stringify({}));
    localStorage.setItem(`context_${projectId}`, JSON.stringify([]));
  }
  if (getActiveProjectId() === projectId) {
    setActiveProject(DEFAULT_PROJECT.id);
  } else if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("update-project"));
  }
  return true;
};

const getPinboardStorageKey = () => {
  const activeId = getActiveProjectId();
  return activeId && activeId !== DEFAULT_PROJECT.id
    ? `pinboard_${activeId}`
    : "pinboard";
};

const getContextStorageKey = () => {
  const activeId = getActiveProjectId();
  return activeId && activeId !== DEFAULT_PROJECT.id
    ? `context_${activeId}`
    : "context";
};

export const initializeLocalStorage = () => {
  if (!localStorage.getItem("pinboard")) {
    localStorage.setItem("pinboard", JSON.stringify({}));
  }
  if (!localStorage.getItem("toggles")) {
    localStorage.setItem("toggles", JSON.stringify({}));
  }
  if (!localStorage.getItem("projects")) {
    localStorage.setItem("projects", JSON.stringify([DEFAULT_PROJECT]));
  }
  if (!localStorage.getItem("activeProjectId")) {
    localStorage.setItem("activeProjectId", DEFAULT_PROJECT.id);
  }
};

export const addToPinboard = (key, content, isUserDefined = false) => {
  try {
    const storageKey = getPinboardStorageKey();
    var pinboard = localStorage.getItem(storageKey);
    var pinboardMap = pinboard ? JSON.parse(pinboard) : {};
    var pinboardEntries = Object.entries(pinboardMap);
    if (pinboardMap.hasOwnProperty(key)) {
      toast.warning("This content is already pinned.");
      return;
    }

    const value = isUserDefined ? { content, isUserDefined: true } : content;
    pinboardEntries.unshift([key.toString(), value]);
    pinboardMap = Object.fromEntries(pinboardEntries);
    localStorage.setItem(storageKey, JSON.stringify(pinboardMap));
    toast.success("Text pinned successfully! You can view it on the Pinboard.");
  } catch (error) {
    console.log(error.message);
    toast.error("Failed to pin the content");
  }
};

const transformPinboardEntry = (value, timestamp) => {
  const isObject = typeof value === "object";
  return {
    timestamp,
    summary: isObject ? value.content : value,
    isUserDefined: isObject ? value.isUserDefined : false,
  };
};

export const saveNote = (newNote) => {
  const storageKey = getPinboardStorageKey();
  const timestamp = Date.now().toString();
  const pinboardData = JSON.parse(localStorage.getItem(storageKey)) || {};
  pinboardData[timestamp] = { content: newNote, isUserDefined: true };
  localStorage.setItem(storageKey, JSON.stringify(pinboardData));
};

export const getPinboardData = () => {
  const storageKey = getPinboardStorageKey();
  const pinboardData = JSON.parse(localStorage.getItem(storageKey)) || {};
  if (!pinboardData || Array.isArray(pinboardData)) {
    return [];
  }

  const entries = Object.entries(pinboardData).map(([timestamp, value]) =>
    transformPinboardEntry(value, timestamp),
  );

  return entries.sort((a, b) => b.isUserDefined - a.isUserDefined);
};

const getContexts = () => {
  const storageKey = getContextStorageKey();
  return JSON.parse(localStorage.getItem(storageKey)) || [];
};

export const getSortedUserContexts = () => {
  let contexts = getContexts();
  contexts.sort((a, b) => b.timestamp - a.timestamp);
  return contexts;
};

export const saveContext = (title, description) => {
  const storageKey = getContextStorageKey();
  const timestamp = Date.now();
  const contextData = getContexts();
  contextData.push({
    title,
    summary: description,
    timestamp,
    isUserDefined: true,
  });
  localStorage.setItem(storageKey, JSON.stringify(contextData));
  window.dispatchEvent(new Event("update-context"));
};

export const deleteContextByTimestamp = (timestamp) => {
  const storageKey = getContextStorageKey();
  const contextData = getContexts();
  const updatedContextData = contextData.filter(
    (context) => context.timestamp !== timestamp,
  );

  localStorage.setItem(storageKey, JSON.stringify(updatedContextData));
  window.dispatchEvent(new Event("update-context"));
};

export const deletePinOrNoteByTimestamp = (timestamp) => {
  const storageKey = getPinboardStorageKey();
  const pinboardData = JSON.parse(localStorage.getItem(storageKey)) || {};
  delete pinboardData[timestamp];
  localStorage.setItem(storageKey, JSON.stringify(pinboardData));
};

export const getSummaryForTheUserContext = (contextTitle) => {
  const userContexts = getSortedUserContexts();
  const context = userContexts.find(
    (context) => context.title === contextTitle,
  );
  return context ? context.summary : "";
};
