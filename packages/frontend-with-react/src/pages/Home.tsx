import React from 'react'
import ProductsCarousels from '../components/products/ProductsCarousel'

const HomePage = () => {
  return (
    <h1>
      <ProductsCarousels listingCategory="latest" title="Latest Products" />
      <ProductsCarousels
        listingCategory="top-rated"
        title="Top Rated Products"
      />
      <ProductsCarousels
        listingCategory="top-selling"
        title="Top Selling Products"
      />
    </h1>
  )
}

export default HomePage
