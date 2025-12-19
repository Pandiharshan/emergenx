import React, { createContext, useState } from 'react';

// Create Triage Context
export const TriageContext = createContext();

// TriageProvider component
export const TriageProvider = ({ children }) => {
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);

  return (
    <TriageContext.Provider value={{ selectedSymptoms, setSelectedSymptoms }}>
      {children}
    </TriageContext.Provider>
  );
};
