import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        items: [],
        total: 0,
    },
    reducers: {
        setCartData: (state, action) => {
            state.items = action.payload.items || [];
            state.total = action.payload.total || 0;
        },
        clearCart: (state) => {
            state.items = [];
            state.total = 0;
        }
    },
});

export const { setCartData, clearCart } = cartSlice.actions;
export default cartSlice.reducer;