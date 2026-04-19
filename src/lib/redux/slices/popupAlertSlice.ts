import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AlertState {
  alerts: any[]
  isOpen: boolean;
}

const initialState: AlertState = {
  alerts: [],
  isOpen: false,
};

export const alertSlice = createSlice({
    name: 'alerts',
    initialState,
    reducers: {
        triggerPopupAlert: (state, action: PayloadAction<any>) => {
            state.alerts = [action.payload];
            state.isOpen = true;
        },
        setSystemPopupAlert: (state, action: PayloadAction<any[]>) => {
            state.alerts = action.payload;
            state.isOpen = action.payload.length > 0;
        },
        pushPopupAlert: (state, action: PayloadAction<any>) => {
            state.alerts.push(action.payload);
            state.isOpen = true;
        },
        closePopupAlertModal: (state) => {
            state.isOpen = false;
            state.alerts = []
        },
    },
})

export const { triggerPopupAlert, setSystemPopupAlert, pushPopupAlert, closePopupAlertModal } = alertSlice.actions;
export default alertSlice.reducer;