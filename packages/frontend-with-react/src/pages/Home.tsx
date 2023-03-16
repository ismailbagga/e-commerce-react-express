import React from 'react'
import ProductsCarousels from '../components/products/ProductsCarousel'

const HomePage = () => {
  return (
    <h1>
      <ProductsCarousels listingCategory="latest" title="Latest Products" />
    </h1>
  )
}

export default HomePage
