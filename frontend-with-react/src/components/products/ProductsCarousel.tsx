import React, { FC } from 'react'

export type ProductsCarouselsProps = {
  title: string , 
  listingCategory : 'top-selling' 
}

const ProductsCarousels: FC<ProductsCarouselsProps> = (props) => {
  return <div>Products Carousels</div>
}

export default ProductsCarousels
