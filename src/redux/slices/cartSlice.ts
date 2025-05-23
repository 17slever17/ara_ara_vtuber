import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store'
import { getCartFromLS } from '../../utils/getCartFromLS'
import { calcTotalPrice } from '../../utils/calcTotalPrice'

export type CartItemTypes = {
  id: number
  title: string
  imageUrl: string
  type: string
  size: number
  price: number
  quantity: number
}

interface CartSliceState {
  totalPrice: number
  items: CartItemTypes[]
}

const initialState: CartSliceState = getCartFromLS()

const findItem = (items: CartItemTypes[], payload: CartItemTypes) => {
  return items.findIndex(
    (item) =>
      item.id === payload.id &&
      item.type === payload.type &&
      item.size === payload.size
  )
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem(state, action: PayloadAction<CartItemTypes>) {
      const id = findItem(state.items, action.payload)
      if (id !== -1) state.items[id].quantity++
      else {
        state.items.push(action.payload)
      }
      state.totalPrice = calcTotalPrice(state.items)
    },
    removeItem(state, action: PayloadAction<CartItemTypes>) {
      const id = findItem(state.items, action.payload)
      if (state.items[id].quantity > 1) state.items[id].quantity--
      else state.items.splice(id, 1)
      state.totalPrice = calcTotalPrice(state.items)
    },
    clearItem(state, action: PayloadAction<CartItemTypes>) {
      const id = findItem(state.items, action.payload)
      state.items.splice(id, 1)
      state.totalPrice = calcTotalPrice(state.items)
    },
    clearItems(state) {
      state.totalPrice = 0
      state.items = []
    }
  }
})

export const selectCart = (state: RootState) => state.cart
export const { addItem, removeItem, clearItem, clearItems } = cartSlice.actions

export default cartSlice.reducer
