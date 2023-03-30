import { RatingLevel } from '@site-wrapper/common'
import { useAppContext } from '../../contexts/AppContext'
import { RatingBar } from './RatingBar'
import { useSearchParams } from 'react-router-dom'

export const RatingBox = () => {
  const STARS = [4, 3, 2, 1] satisfies RatingLevel[]
  const { onRatingChange } = useAppContext()
  const currRating = parseInt(useSearchParams()[0].get('rating') ?? 'N')
  const onBtnClicked = (rating: RatingLevel) => {
    if (currRating === rating) onRatingChange(undefined)
    else onRatingChange(rating)
  }
  return (
    <div className="flex flex-col space-y-1">
      {STARS.map((ratingVal) => (
        <button
          key={ratingVal}
          className="flex items-center space-x-2 text-gray-500"
          onClick={() => onBtnClicked(ratingVal)}
        >
          <RatingBar key={ratingVal} rating={ratingVal} />
          <span
            className={`text-md font-semibold ${
              ratingVal === currRating ? 'text-black' : ''
            }`}
          >
            & Up
          </span>
        </button>
      ))}
    </div>
  )
}
