import React, {
  ChangeEvent,
  ChangeEventHandler,
  FC,
  FormEventHandler,
  useEffect,
  useRef,
  useState,
} from 'react'
import { Link } from 'react-router-dom'
import SearchIcon from '../assets/icons/search.png'
import BarIcon from '../assets/icons/bars.png'
import CloseIcon from '../assets/icons/close.png'
import axiosClient from '../setup/axiosClient'
import { useAppContext } from '../contexts/AppContext'

export type PrimaryCategory = {
  id: number
  title: string
}
const fetchAllCategories = async () => {
  const result = await axiosClient.get<PrimaryCategory[]>('/categories')
  return result.data
}
export const NavSearchForm = () => {
  const searchEl = useRef<HTMLInputElement>(null)
  const { onTermChange, onCategoryIdChange } = useAppContext()
  const [categories, setCategories] = useState<PrimaryCategory[]>([])
  const [selectedCategory, selectCategory] = useState<string>('ALL')
  useEffect(() => {
    fetchAllCategories().then((data) => setCategories(data))
  }, [])

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault()
    if (selectedCategory === 'ALL') onCategoryIdChange(undefined)
    else onCategoryIdChange(parseInt(selectedCategory))
    onTermChange(searchEl.current?.value ?? '')
  }
  return (
    <div className="absolute top-[7rem] right-[50%] flex  h-10 translate-x-[50%]  md:static md:translate-x-0 ">
      <form
        className="flex items-center rounded-r bg-white "
        onSubmit={handleSubmit}
      >
        <select
          onChange={(e) => selectCategory(e.target.value)}
          value={selectedCategory}
          placeholder="Categories"
          className="h-full rounded-l bg-gray-300 px-1 pl-2"
        >
          <option value="ALL">All</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
        </select>
        <button type="submit" className="shrink-0 pl-2">
          <img className="h-8" src={SearchIcon} alt="Search" />
        </button>
        <input
          ref={searchEl}
          type="text"
          className="h-full bg-transparent px-2 outline-none md:w-52"
          placeholder="Search ..."
        />
      </form>
    </div>
  )
}

const NavLink: FC<{ href: string; text: string }> = ({ href, text }) => {
  return (
    <li className="">
      <Link
        className="block rounded border-2 border-gray-800 bg-white py-1 px-3"
        to={href}
      >
        {text}
      </Link>
    </li>
  )
}

const SideNav = () => {
  const [isVisible, setVisibility] = useState(false)
  return (
    <>
      <button className="lg:hidden" onClick={() => setVisibility(true)}>
        <img className="block h-10  w-10" src={BarIcon}></img>
      </button>
      <aside
        className={`${
          isVisible ? 'translate-x-0' : 'translate-x-full'
        } fixed top-0 right-0 z-50 h-screen w-full bg-black/30 transition-transform  lg:hidden `}
        onClick={() => setVisibility(false)}
      >
        <div
          className="relative ml-auto  h-full w-10/12 max-w-[30rem] flex-col rounded bg-white"
          onClick={(e) => e.stopPropagation()}
        >
          <img
            className="absolute top-2 right-2 w-10"
            src={CloseIcon}
            onClick={() => setVisibility(false)}
          ></img>
          <ul className="mx-5 flex flex-col space-y-5  pt-20  text-center text-lg font-semibold">
            <NavLink href="home" text="Home" />
            <NavLink href="products" text="Products" />
            <NavLink href="about" text="About" />
            <Link
              className=" rounded bg-blue-700 py-[calc(2px+0.25rem)] px-5 font-semibold text-white"
              to="login"
            >
              login
            </Link>
          </ul>
        </div>
      </aside>
    </>
  )
}

const Nav = () => {
  return (
    <nav className="sm: relative flex w-full items-center justify-between  px-5 py-3 pb-16 md:pb-0">
      <Link to="/" className="block ">
        <img
          className="block h-16 w-16 rounded-full "
          src="/public/logo.jpg"
          alt="Home Screen"
        />
      </Link>
      <NavSearchForm />
      <ul className="hidden items-center space-x-3 lg:flex  ">
        <NavLink href="home" text="Home" />
        <NavLink href="search" text="Search" />
        <NavLink href="about" text="About" />
        <Link
          className=" rounded bg-blue-700 py-[calc(2px+0.25rem)] px-5 font-semibold text-white"
          to="login"
        >
          login
        </Link>
      </ul>
      <SideNav />
    </nav>
  )
}

export default Nav
