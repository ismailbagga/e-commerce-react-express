import { ProductRating } from '@site-wrapper/common'
import { FC } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useAppContext } from '../../contexts/AppContext'
import { RatingBar } from '../rating/RatingBar'
import LeftArrow from '../../assets/icons/l-arrow.svg'
import RightArrow from '../../assets/icons/r-arrow.svg'
const ProductSearchCard: FC<{ product: ProductRating }> = ({ product }) => {
  return (
    <article className="flex rounded bg-white p-5 shadow-xl transition-transform hover:scale-[101%]">
      <img
        src="https://m.media-amazon.com/images/I/61CGHv6kmWL._AC_UY218_.jpg"
        className="h-[15rem] rounded-t object-contain "
      ></img>
      <div className="my-5 px-6">
        <Link to={`/products/${product.slug}`}>
          <h1
            title={product.title}
            className="h-[calc(3rem)] overflow-hidden text-4xl font-bold line-clamp-1 hover:underline"
          >
            {product.title}
          </h1>
        </Link>

        <p
          title={product.description}
          className="pt-2 text-lg font-normal leading-6 text-gray-700 line-clamp-3"
        >
          {product.description}
        </p>
        <div className="mt-2 flex items-center space-x-2">
          <RatingBar rating={Math.floor(product.rating)} />
          <h5 className="text-xl">1256</h5>
        </div>
        <p className="mt-2 text-2xl font-bold">${product.price}</p>
      </div>
    </article>
  )
}

const PaginationButton: FC<{
  text: string | number
  onClick: (page: number | string) => void
  isFocus: boolean
}> = ({ text, onClick, isFocus }) => {
  return (
    <button
      className={`mx-2 h-14 w-[3rem] rounded border-2 
         ${
           isFocus
             ? 'border-black text-black'
             : 'border-transparent text-gray-500'
         }`}
      onClick={(e) => onClick(text)}
    >
      {text}
    </button>
  )
}

const ProductsList: FC<{ products: ProductRating[]; loading: boolean }> = ({
  loading,
  products,
}) => {
  if (loading) return <h1>Loading ...</h1>
  if (!loading && products.length === 0) return <h1>No Products Was Found </h1>
  return (
    <>
      {products.map((p) => (
        <ProductSearchCard key={p.id} product={p} />
      ))}
    </>
  )
}

const PAGE_SIZE = 6
export const ProductSearchListing = () => {
  const { productsFound, productCount, onPageChange, loading } = useAppContext()
  const params = useSearchParams()[0]
  const lastPage = Math.ceil(productCount / PAGE_SIZE)
  const pageSelected = parseInt(params.get('page') ?? '1')
  const buttonArray = [...new Array(lastPage).keys()]
  const onClickHandler = (page: number | string) => {
    if (typeof page === 'string') return
    if (page > lastPage || page < 1) return

    onPageChange(page)
  }
  return (
    <section className="flex flex-col  items-center space-y-10  pb-10">
      <ProductsList products={productsFound} loading={loading} />
      {!loading && productsFound.length !== 0 && (
        <footer
          className="flex h-14 items-center rounded border-2 border-gray-500 px-2 shadow"
          id="pagination"
        >
          <button
            className="px-5"
            onClick={() => onClickHandler(pageSelected - 1)}
          >
            <img className="w-8" src={LeftArrow} />
          </button>
          {pageSelected > 4 && (
            <PaginationButton
              isFocus={false}
              text={1}
              onClick={onClickHandler}
            />
          )}
          {pageSelected > 4 && pageSelected <= lastPage - 4 && (
            <PaginationButton isFocus={false} text=".." onClick={() => {}} />
          )}
          {buttonArray.map((page) => {
            const currBtnPage = page + 1
            let visibleLeftBtn = 1
            let visibleRightBtn = 2

            if (pageSelected > 1 && pageSelected < 5) {
              visibleLeftBtn = pageSelected - 1
              visibleRightBtn = 1
            }
            if (pageSelected > 4 && pageSelected <= lastPage - 4) {
              visibleLeftBtn = 1
              visibleRightBtn = 1
            }
            if (pageSelected < lastPage && pageSelected > lastPage - 4) {
              visibleLeftBtn = 1
              visibleRightBtn = lastPage - pageSelected
            }
            if (pageSelected === lastPage) {
              visibleLeftBtn = 2
              visibleRightBtn = 0
            }
            const showIfLeftBtn =
              currBtnPage <= pageSelected &&
              currBtnPage >= pageSelected - visibleLeftBtn
            const showIfRightBtn =
              currBtnPage >= pageSelected &&
              currBtnPage <= pageSelected + visibleRightBtn

            return (
              (showIfLeftBtn || showIfRightBtn) && (
                <PaginationButton
                  key={page}
                  text={currBtnPage}
                  isFocus={currBtnPage === pageSelected}
                  onClick={onClickHandler}
                />
              )
            )
          })}
          {pageSelected > 4 && pageSelected <= lastPage - 4 && (
            <PaginationButton isFocus={false} text=".." onClick={() => {}} />
          )}
          {pageSelected <= lastPage - 4 && (
            <PaginationButton
              isFocus={false}
              text={lastPage}
              onClick={onClickHandler}
            />
          )}
          <button
            className="px-5"
            onClick={() => onClickHandler(pageSelected + 1)}
          >
            <img className="w-8" src={RightArrow} />
          </button>
        </footer>
      )}
    </section>
  )
}
