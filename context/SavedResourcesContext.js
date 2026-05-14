import { createContext, useState } from "react";

export const SavedResourcesContext = createContext();

export function SavedResourcesProvider({ children }) {
  const [savedResources, setSavedResources] = useState([]);

  const toggleSaveResource = (resource) => {
    setSavedResources((current) => {
      const isAlreadySaved = current.some((r) => r.id === resource.id);
      if (isAlreadySaved) {
        return current.filter((r) => r.id !== resource.id);
      } else {
        return [...current, resource];
      }
    });
  };

  const isSaved = (resourceId) => {
    return savedResources.some((r) => r.id === resourceId);
  };

  return (
    <SavedResourcesContext.Provider
      value={{ savedResources, toggleSaveResource, isSaved }}
    >
      {children}
    </SavedResourcesContext.Provider>
  );
}
