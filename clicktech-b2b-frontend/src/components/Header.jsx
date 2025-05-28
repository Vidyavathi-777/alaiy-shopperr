import React ,{useState}from 'react'
import Login from '../pages/Login'
import Register from '../pages/Register'
import { Link } from 'react-router-dom'
import CategorySidebar from './CategorySidebar'
import {
  SearchIcon,
  MenuIcon,
  ShoppingCartIcon,
  UserIcon,
  PackageIcon,
  ChevronDownIcon,
  LogIn,
} from "lucide-react";



  const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  
  
  const user = null 
  const cartItemCount = 0 
  const topLevelCategories = ['Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Books', 'Toys', 'Health', 'Automotive']

  const handleSearch = (e) => {
    e.preventDefault()
    console.log('Searching for:', searchTerm)
    
  }
   return (
    
   
      
    <header>
      {/* Top navigation bar */}
      <div className="bg-[#06184b] text-white">
        <div className="container mx-auto px-4 py-2 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="mr-6">
              <img
                src="/Shopperr white logo.png"
                alt="ShopperrB2B Logo"
                className="h-8 w-auto"
              />
            </Link>

            {/* Search bar - hidden on mobile */}
            <div className="hidden md:flex flex-grow max-w-3xl bg-white">
              <form onSubmit={handleSearch} className="w-full relative flex">
                <input
                  type="text"
                  placeholder="Search products"
                  className="w-full px-3 py-2 rounded-l-md rounded-r-none border-0 text-black"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-l-none bg-[#ffd701] hover:bg-[#06184b] hover:text-white text-black transition-colors"
                >
                  <SearchIcon className="h-4 w-4" />
                </button>
              </form>
            </div>
          </div>

          {/* Account & Orders */}
          <div className="flex items-center">
            <div className="hidden md:block text-sm mx-2">
              <div>{user ? `Hello, ${user.name}` : "Hello, Sign in"}</div>
              <div className="font-bold">
                <Link to={user ? "/profile" : "/login"} className="flex items-center hover:underline">
                  Account & Lists
                  <ChevronDownIcon className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
            
            <div className="hidden md:block text-sm mx-2">
              <div>Returns</div>
              <div className="font-bold">
                <Link to={user ? "/orders" : "/login"} className="hover:underline">& Orders</Link>
              </div>
            </div>
            
            <Link to="/cart" className="flex items-center mx-2 hover:text-gray-300">
              <ShoppingCartIcon className="h-6 w-6" />
              <span className="ml-1 font-bold">Cart</span>
              {cartItemCount > 0 && (
                <span className="bg-[#f90] text-white rounded-full px-2 ml-1 text-xs">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* Mobile menu toggle */}
            <button
              className="md:hidden ml-2 text-white p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <MenuIcon className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Mobile search - visible only on mobile */}
        <div className="md:hidden px-4 pb-2">
          <form onSubmit={handleSearch} className="w-full relative flex">
            <input
              type="text"
              placeholder="Search products"
              className="w-full px-3 py-2 rounded-l-md rounded-r-none border-0 text-black"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-l-none bg-[#ffd701] hover:bg-[#06184b] hover:text-white text-black transition-colors"
            >
              <SearchIcon className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Secondary navigation */}
      {/* <div className="bg-[#62c8f5] py-1 px-4">
        <div className="container mx-auto flex items-center text-sm text-[#06184b] overflow-x-auto">
          <button className="mr-4 whitespace-nowrap flex items-center cursor-pointer hover:text-gray-700">
            <MenuIcon className="mr-1 h-4 w-4" /> All Categories
          </button>
          {topLevelCategories.slice(0, 8).map((category) => (
            <Link
              key={category}
              to={`/categories/${category.toLowerCase().replace(/\s+/g, "-")}`}
              className="mr-4 whitespace-nowrap hover:text-gray-700 transition-colors"
            >
              {category}
            </Link>
          ))}
        </div>
      </div> */}
        {/* <div className="bg-[#62c8f5] py-1 px-4">
        <div className="container mx-auto flex items-center text-sm text-[#06184b] overflow-x-auto">
          <button className="mr-4 whitespace-nowrap flex items-center cursor-pointer hover:text-gray-700">
            <MenuIcon className="mr-1 h-4 w-4" /> All Categories
          </button>
          {topLevelCategories.slice(0, 8).map((category) => (
            <Link
              key={category}
              to={`/categories/${category.toLowerCase().replace(/\s+/g, "-")}`}
              className="mr-4 whitespace-nowrap hover:text-gray-700 transition-colors"
            >
              {category}
            </Link>
          ))}
        </div>
      </div> */}
      <CategorySidebar />

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b text-black">
          <div className="container mx-auto px-4 py-2">
            <div className="flex flex-col">
              {user ? (
                <>
                  <Link to="/profile" className="py-2 border-b hover:bg-gray-50">
                    <div className="font-bold flex items-center">
                      <UserIcon className="mr-2 h-4 w-4" />
                      Your Account ({user.name})
                    </div>
                  </Link>
                  <Link to="/orders" className="py-2 border-b hover:bg-gray-50">
                    <div className="font-bold flex items-center">
                      <PackageIcon className="mr-2 h-4 w-4" />
                      Your Orders
                    </div>
                  </Link>
                  <button className="py-2 border-b text-left font-bold flex items-center hover:bg-gray-50">
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign Out
                  </button>
                </>
              ) : (
                <Link to="/login" className="py-2 border-b hover:bg-gray-50">
                  <div className="font-bold flex items-center">
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign In / Register
                  </div>
                </Link>
              )}
              <Link to={user ? "/orders" : "/login"} className="py-2 border-b hover:bg-gray-50">
                <div className="font-bold flex items-center">
                  <PackageIcon className="mr-2 h-4 w-4" />
                  Returns & Orders
                </div>
              </Link>
              {topLevelCategories.map((category) => (
                <Link
                  key={category}
                  to={`/categories/${category.toLowerCase().replace(/\s+/g, "-")}`}
                  className="py-2 border-b block hover:bg-gray-50"
                >
                  {category}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
    
  )
}

export default Header


 {/* <header className="p-4 bg-gray-100 flex justify-between items-center">
      <h1 className="text-xl font-bold">Shopperr</h1>
      <nav className="space-x-4">
        <Link to="/">Home</Link>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
      </nav>
      
    </header> */}
