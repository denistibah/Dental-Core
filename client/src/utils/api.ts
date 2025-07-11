// api.ts
import axios from 'axios';
import { User, Patient, Appointment } from '../types';
import { signInWithEmailAndPassword } from 'firebase/auth'
import { firebaseAuth } from '../firebase/firebase';

const API_URL = 'https://localhost:5001/api'; // Replace with your actual API URL
const API = axios.create({
    baseURL: 'http://localhost:5001/api', // update if deployed
});

// User API requests
export const getUsersFromAPI = async (): Promise<User[]> => {
    const response = await fetch(`${API_URL}/users`);
    if (!response.ok) throw new Error('Failed to fetch users');
    return response.json();
};

export const getCurrentUserFromAPI = async (): Promise<User | null> => {
    const response = await fetch(`${API_URL}/current-user`);
    if (!response.ok) throw new Error('Failed to fetch current user');
    return response.json();
};

export const setCurrentUserToAPI = async (user: User | null) => {
    const response = await fetch(`${API_URL}/set-current-user`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
    });
    if (!response.ok) throw new Error('Failed to set current user');
};

// Patient API requests
export const getPatientsFromAPI = async (): Promise<Patient[]> => {
    const response = await fetch(`${API_URL}/patients`);
    if (!response.ok) throw new Error('Failed to fetch patients');
    return response.json();
};

export const savePatientsToAPI = async (patients: Patient[]) => {
    const response = await fetch(`${API_URL}/patients`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(patients),
    });
    if (!response.ok) throw new Error('Failed to save patients');
};

// Appointment API requests
export const getAppointmentsFromAPI = async (): Promise<Appointment[]> => {
    const response = await fetch(`${API_URL}/appointments`);
    if (!response.ok) throw new Error('Failed to fetch appointments');
    return response.json();
};

export const saveAppointmentsToAPI = async (appointments: Appointment[]) => {
    const response = await fetch(`${API_URL}/appointments`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointments),
    });
    if (!response.ok) throw new Error('Failed to save appointments');
};

export const initializeStorage = async () => {
    try {
        // Fetch data from the API
        const users = await getUsersFromAPI();
        const patients = await getPatientsFromAPI();
        const appointments = await getAppointmentsFromAPI();

        // Set the initial data in local storage or state management
        // This might be used in the future for offline persistence or caching
        // localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
        // localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(patients));
        // localStorage.setItem(STORAGE_KEYS.INCIDENTS, JSON.stringify(appointments));
    } catch (error) {
        console.error('Error initializing storage:', error);
    }
};

// User operations - replace with API
export const getUsers = async (): Promise<User[]> => {
    try {
        const users = await getUsersFromAPI();
        return users;
    } catch (error) {
        console.error('Error fetching users:', error);
        return []; // return empty array in case of an error
    }
};

export const getCurrentUser = async (): Promise<User | null> => {
    try {
        const currentUser = await getCurrentUserFromAPI();
        return currentUser;
    } catch (error) {
        console.error('Error fetching current user:', error);
        return null;
    }
};

export const setCurrentUser = async (user: User | null) => {
    try {
        await setCurrentUserToAPI(user);
    } catch (error) {
        console.error('Error setting current user:', error);
    }
};

export const loginUser = async (email: string, password: string) => {
    try {
        const userCredential = await signInWithEmailAndPassword(firebaseAuth, email, password);
        const token = await userCredential.user.getIdToken();
        const response = await API.post('/auth/login', {
            token
        });
        return response; // Returning the response for further use
    } catch (error: any) {
        throw error; // Pass the error to be handled by the caller
    }
};

// Register user function
export const registerUser = async (email: string, password: string, role: string) => {
    try {

        const response = await API.post('/auth/register', {
            email,
            password,
            role,
        });
        return response; // Returning the response for further use
    } catch (error: any) {
        throw error; // Pass the error to be handled by the caller
    }
};

// Patient operations - replace with API
export const getPatients = async () => {
    try {
        const response = await API.get('/patients');
        return response.data;
    } catch (error) {
        console.error('Error fetching patients:', error);
        return []; // return empty array in case of an error
    }
};

export const savePatient = async (patient: Patient) => {
    try {
        const response = await API.post('/patients', patient);
        return response;
    } catch (error) {
        throw error; // Pass the error to be handled by the caller
    }
};

// Appointment operations - replace with API
export const getAppointments = async (): Promise<Appointment[]> => {
    try {
        const appointments = await getAppointmentsFromAPI();
        return appointments;
    } catch (error) {
        console.error('Error fetching appointments:', error);
        return []; // return empty array in case of an error
    }
};

export const saveAppointments = async (appointments: Appointment[]) => {
    try {
        await saveAppointmentsToAPI(appointments);
    } catch (error) {
        console.error('Error saving appointments:', error);
    }
};