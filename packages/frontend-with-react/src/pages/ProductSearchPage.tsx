import React, { FC, useEffect, useState } from 'react'
import { ProductSearchListing } from '../components/products/ProductSearchListing'
import { RatingBox } from '../components/rating/RatingBox'
import { ProductPriceForm } from '../components/products/ProductPriceForm'
import { useAppContext } from '../contexts/AppContext'
import { ProductListing } from '@site-wrapper/common'
import { useSearchParams } from 'react-router-dom'
import './ProductSearchPage.css'
import FilterIcon from '../assets/icons/filter.png'
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
  const [isFiltersShown, showFilter] = useState(false)
  useEffect(() => {
    console.log('Adding Style')
    const el = document.getElementById('document-html')
    el?.classList.add('html-tag-for-search-page')
    return () => {
      console.log('Removing Style')
      document.head.classList.remove('html-tag-for-search-page')
    }
  }, [])
  return (
    <section className="mx-5 mt-10 flex h-full min-h-[40rem] flex-col md:flex-row">
      <header className="mb-10 border-r-2 pr-4 md:mb-0 md:mr-5 md:border-gray-800">
        <nav className="flex justify-between">
          <h1 className="text-4xl font-bold tracking-wide">Filter</h1>
          <button
            className=" text-lg font-bold md:hidden"
            onClick={() => showFilter(!isFiltersShown)}
          >
            <img className="h-8" src={FilterIcon} />
          </button>
        </nav>
        <div
          id="filters"
          className={`${
            isFiltersShown ? 'h-auto scale-y-100' : 'h-0 scale-y-0'
          } overflow-hidden transition-transform md:h-auto md:scale-y-100`}
        >
          <div className="mt-5">
            <SearchHeader text="Rating" />
            <RatingBox />
          </div>
          <div className="mt-5">
            <SearchHeader text="Price" />
            <ProductPriceForm />
          </div>
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
