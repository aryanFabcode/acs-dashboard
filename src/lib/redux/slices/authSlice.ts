import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AdminData {
  _id: string;
  created_at: string;
  email: string;
  name: string;
  otp: string;
  otpExpiresAt: string;
  phone: string;
  status: string;
  updated_at: string;
}

interface AuthState {
  token: string | null;
  admin: AdminData | null;
}

const loadInitialState = (): AuthState => {
  if (typeof window !== 'undefined') {
    const storedAuth = localStorage.getItem('auth') || sessionStorage.getItem('auth');
    return storedAuth ? JSON.parse(storedAuth) : { token: null, admin: null };
  }
  return { token: null, admin: null };
};

const initialState: AuthState = loadInitialState();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ 
      token: string; 
      admin: AdminData;
      persist: boolean;
    }>) => {
      state.token = action.payload.token;
      state.admin = action.payload.admin;
      
      if (typeof window !== 'undefined') {
        const storage = action.payload.persist ? localStorage : sessionStorage;
        storage.setItem('auth', JSON.stringify({
          token: action.payload.token,
          admin: action.payload.admin
        }));
      }
    },
    clearCredentials: (state) => {
      state.token = null;
      state.admin = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth');
        sessionStorage.removeItem('auth');
      }
    },
    updateAdminData: (state, action: PayloadAction<Partial<AdminData>>) => {
      if (state.admin) {
        state.admin = { ...state.admin, ...action.payload };
        const storage = localStorage.getItem('auth') ? localStorage : sessionStorage;
        storage.setItem('auth', JSON.stringify(state));
      }
    }
  },
});

export const { setCredentials, clearCredentials, updateAdminData } = authSlice.actions;
export default authSlice.reducer;

// Selectors
export const selectCurrentAdmin = (state: { auth: AuthState }) => state.auth.admin;
export const selectAuthToken = (state: { auth: AuthState }) => state.auth.token;

