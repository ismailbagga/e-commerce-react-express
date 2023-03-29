import { RatingLevel, ProductListing } from '@site-wrapper/common'
export type PricePayload = {
  minPrice: number | undefined
  maxPrice: number | undefined
}

export type FilterState = {
  price: PricePayload
  term: string
  rating: RatingLevel
  categoryId: number | undefined
  listing: ProductListing
}
export type ProductReducerActions =
  | {
      type: 'CHANGE-PRICE'
      payload: PricePayload
    }
  | {
      type: 'CHANGE-TERM'
      payload: string
    }
  | {
      type: 'CHANGE-RATING'
      payload: RatingLevel
    }
  | {
      type: 'CHANGE-CATEGORY-ID'
      payload: number | undefined
    }
  | {
      type: 'CHANGE-LISTING-TYPE'
      payload: ProductListing
    }
export const initialState: FilterState = {
  term: '',
  price: { minPrice: 0, maxPrice: undefined },
  rating: undefined,
  categoryId: undefined,
  listing: 'latest',
}

export type ProductFilterReducerFn = (
  prevState: FilterState,
  action: ProductReducerActions
) => FilterState

export const ProductFilterReducer: ProductFilterReducerFn = (
  prevState,
  action
) => {
  if (action.type === 'CHANGE-PRICE')
    return { ...prevState, price: action.payload }
  if (action.type === 'CHANGE-RATING')
    return { ...prevState, rating: action.payload }
  if (action.type === 'CHANGE-TERM')
    return { ...prevState, term: action.payload }
  if (action.type === 'CHANGE-LISTING-TYPE')
    return { ...prevState, listing: action.payload }
  if (action.type === 'CHANGE-CATEGORY-ID')
    return { ...prevState, categoryId: action.payload }
  return prevState
}
