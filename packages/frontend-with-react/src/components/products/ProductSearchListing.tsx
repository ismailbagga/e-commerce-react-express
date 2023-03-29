import { ProductRating } from '@site-wrapper/common'
import { FC } from 'react'
import { Link } from 'react-router-dom'
import { useAppContext } from '../../contexts/AppContext'
import { RatingBar } from '../rating/RatingBar'

const ProductSearchCard: FC<{ product: ProductRating }> = ({ product }) => {
  return (
    <article className="flex rounded bg-white p-5 shadow-xl transition-transform hover:scale-[101%]">
      <img
        src="https://m.media-amazon.com/images/I/61CGHv6kmWL._AC_UY218_.jpg"
        className="h-[15rem] rounded-t object-contain "
      ></img>
      <div className="my-5 px-6">
        <Link to={`/products/${product.slug}`}>
          <h1 className="overflow-hidden text-4xl font-bold line-clamp-2 hover:underline ">
            {product.title}
          </h1>
        </Link>

        <p className="pt-2 text-lg font-normal leading-6 text-gray-700 line-clamp-3">
          {product.description}
        </p>
        <div className="mt-2 flex items-center space-x-2">
          <RatingBar
            rating={Math.floor(product.rating)}
            onClickHandler={() => {}}
          />
          <h5 className="text-xl">1256</h5>
        </div>
        <p className="mt-2 text-2xl font-bold">${product.price}</p>
      </div>
    </article>
  )
}

const PaginationButton: FC<{ text: string | number }> = ({ text }) => {
  return <button>{text}</button>
}

export const ProductSearchListing = () => {
  const { productsFound } = useAppContext()
  // const {}
  //  1  5           17 18 19  20 
  return (
    <section className="flex  flex-col space-y-10">
      {productsFound.map((p) => (
        <ProductSearchCard key={p.id} product={p} />
      ))}
      <footer className="" id="pagination">
        <button>Left</button>

        <button>3</button>
        <button>4</button>
        <button>5</button>
        <button>6</button>
        <button>Right</button>
      </footer>
    </section>
  )
}
