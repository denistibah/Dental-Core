import React, { createContext, useContext, useEffect, useState } from 'react';
import { Patient, Incident, AppContextType } from '../types';
import { 
  getPatients, 
  savePatients, 
  getAppointments, 
  saveAppointments, 
  generateId,
  initializeStorage
} from '../utils/storage';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [appointments, setAppointments] = useState<Incident[]>([]);

  useEffect(() => {
    initializeStorage();
    setPatients(getPatients());
    setAppointments(getAppointments());
  }, []);

  const addPatient = (patientData: Omit<Patient, 'id'>) => {
    const newPatient: Patient = {
      ...patientData,
      id: generateId()
    };
    const updatedPatients = [...patients, newPatient];
    setPatients(updatedPatients);
    savePatients(updatedPatients);
  };

  const updatePatient = (id: string, patientData: Partial<Patient>) => {
    const updatedPatients = patients.map(patient =>
      patient.id === id ? { ...patient, ...patientData } : patient
    );
    setPatients(updatedPatients);
    savePatients(updatedPatients);
  };

  const deletePatient = (id: string) => {
    const updatedPatients = patients.filter(patient => patient.id !== id);
    const updatedAppointments = appointments.filter(appointment => appointment.patientId !== id);
    setPatients(updatedPatients);
    setAppointments(updatedAppointments);
    savePatients(updatedPatients);
    saveAppointments(updatedAppointments);
  };

  const addIncident = (appointmentData: Omit<Incident, 'id'>) => {
    const newIncident: Incident = {
      ...appointmentData,
      id: generateId()
    };
    const updatedAppointments = [...appointments, newIncident];
    setAppointments(updatedAppointments);
    saveAppointments(updatedAppointments);
  };

  const updateIncident = (id: string, appointmentData: Partial<Incident>) => {
    const updatedAppointments = appointments.map(appointment =>
      appointment.id === id ? { ...appointment, ...appointmentData } : appointment
    );
    setAppointments(updatedAppointments);
    saveAppointments(updatedAppointments);
  };

  const deleteIncident = (id: string) => {
    const updatedAppointments = appointments.filter(appointment => appointment.id !== id);
    setAppointments(updatedAppointments);
    saveAppointments(updatedAppointments);
  };

  const value: AppContextType = {
    patients,
    appointments,
    addPatient,
    updatePatient,
    deletePatient,
    addIncident,
    updateIncident,
    deleteIncident
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
