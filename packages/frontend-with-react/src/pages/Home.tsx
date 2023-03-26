import React from 'react'
import ProductsCarousels from '../components/products/ProductsCarousel'

const HomePage = () => {
  return (
    <section>
      <ProductsCarousels listingCategory="latest" title="Latest Products" />
      <ProductsCarousels
        listingCategory="top-rated"
        title="Top Rated Products"
      />
      <ProductsCarousels
        listingCategory="top-selling"
        title="Top Selling Products"
      />
    </section>
  )
}

export default HomePage
