import React, { FC } from 'react'
import { ProductSearchListing } from '../components/products/ProductSearchListing'
import { RatingBox } from '../components/rating/RatingBox'
import { ProductPriceForm } from '../components/products/ProductPriceForm'
import { useAppContext } from '../contexts/AppContext'
import { ProductListing } from '@site-wrapper/common'
import { useSearchParams } from 'react-router-dom'

const SearchHeader: FC<{ text: string }> = ({ text }) => {
  return <h1 className="mb-3 text-xl font-bold">{text}</h1>
}

const ListingDropDown = () => {
  const { onListingChange } = useAppContext()
  const params = useSearchParams()[0]
  return (
    <select
      className="rounded bg-gray-300 px-2"
      value={params.get('listing') ?? 'latest'}
      onChange={(e) => onListingChange(e.target.value as ProductListing)}
    >
      <option value="latest">Sort By : Latest</option>
      <option value="top-selling">Sort By : Top Selling</option>
      <option value="featured">Sort By : Featured</option>
    </select>
  )
}
const ProductSearchPage = () => {
  return (
    <section className="mx-5 mt-10 flex h-full ">
      <header className="mr-5 border-r-2 border-gray-800  pr-4">
        <h1 className="text-4xl font-bold tracking-wide">Filter</h1>
        <div className="mt-5">
          <SearchHeader text="Rating" />
          <RatingBox />
        </div>
        <div className="mt-5">
          <SearchHeader text="Price" />
          <ProductPriceForm />
        </div>
      </header>
      <main className="grow">
        <nav className="mb-5 flex justify-between">
          <h1 className="text-4xl font-bold">Result</h1>
          <ListingDropDown />
        </nav>
        <ProductSearchListing />
      </main>
    </section>
  )
}

export default ProductSearchPage
