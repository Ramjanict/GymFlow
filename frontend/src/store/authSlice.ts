import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  organizationId?: string | null;
  organizationName?: string;
  roles: string[];
  permissions: string[];
  trainerId?: string;
  memberId?: string;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  activeOrganizationId: string | null;
}

const initialState: AuthState = {
  user: null,
  token: typeof window !== 'undefined' ? localStorage.getItem('gymflow_token') : null,
  isAuthenticated: false,
  activeOrganizationId:
    typeof window !== 'undefined' ? localStorage.getItem('gymflow_org_id') : null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: AuthUser; token?: string }>,
    ) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
      if (action.payload.token) {
        state.token = action.payload.token;
        if (typeof window !== 'undefined') {
          localStorage.setItem('gymflow_token', action.payload.token);
        }
      }
      if (action.payload.user.organizationId) {
        state.activeOrganizationId = action.payload.user.organizationId;
        if (typeof window !== 'undefined') {
          localStorage.setItem('gymflow_org_id', action.payload.user.organizationId);
        }
      }
    },
    setActiveOrganization: (state, action: PayloadAction<string>) => {
      state.activeOrganizationId = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('gymflow_org_id', action.payload);
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.activeOrganizationId = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('gymflow_token');
        localStorage.removeItem('gymflow_org_id');
      }
    },
  },
});

export const { setCredentials, setActiveOrganization, logout } = authSlice.actions;
export default authSlice.reducer;
