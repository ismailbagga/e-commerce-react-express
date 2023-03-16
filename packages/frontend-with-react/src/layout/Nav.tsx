import React, {
  FC,
  FormEventHandler,
  PropsWithChildren,
  useEffect,
  useRef,
  useState,
} from 'react'
import { Link } from 'react-router-dom'
import SearchIcon from '../assets/icons/search.png'
import BarIcon from '../assets/icons/bars.png'
import CloseIcon from '../assets/icons/close.png'

export type Categories = {
  id: number
  title: string
}

export const NavSearchForm = () => {
  const searchEl = useRef<HTMLInputElement>(null)
  const [categories, setCategories] = useState<Categories[]>([])
  useEffect(() => {
    setCategories([
      { id: 1, title: 'Technologies' },
      { id: 2, title: 'Home Products' },
    ])
  }, [])

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault()
    console.log(searchEl.current?.value)
  }
  return (
    <div className="flex  h-10 ">
      <select
        placeholder="Categories"
        className="rounded-l bg-gray-300 px-5 "
        defaultValue="ALL"
      >
        <option value="ALL">All</option>
        {categories.map((c) => (
          <option key={c.id} value={c.title}>
            {c.title}
          </option>
        ))}
      </select>
      <form
        className="flex items-center rounded-r bg-white pl-2"
        onSubmit={handleSubmit}
      >
        <button type="submit">
          <img className="h-8" src={SearchIcon} alt="Search" />
        </button>
        <input
          ref={searchEl}
          type="text"
          className="h-full w-52 bg-transparent px-2 outline-none"
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
        } fixed top-0 right-0 h-screen w-full bg-black/30 transition-transform  lg:hidden `}
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
    <nav className="flex w-full items-center justify-between   px-5 py-3">
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
        <NavLink href="products" text="Products" />
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
