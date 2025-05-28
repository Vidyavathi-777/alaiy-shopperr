import React, { useState, useMemo, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import {
  ShoppingCartIcon,
  TruckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Grid3X3,
  List,
  Search,
  X,
  Filter,
  ChevronDown,
  ChevronUp
} from "lucide-react"

const CategoryProductsPage = () => {
  const { category } = useParams()
  
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [page, setPage] = useState(1)
  const [viewMode, setViewMode] = useState('grid')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSubcategory, setSelectedSubcategory] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const productsPerPage = 12

  const fetchProducts = async (searchQuery = '', pageNum = 0, pageSize = 50) => {
    try {
      setIsLoading(true)
      setError(null)
      
      const params = new URLSearchParams({
        expression: searchQuery || category,
        page_no: pageNum.toString(),
        page_size: pageSize.toString()
      })
      
      const response = await fetch(`http://127.0.0.1:8000/api/products/search?${params}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      const transformedProducts = data.results?.map(product => ({
        id: product.id,
        name: product.listingName || 'Unnamed Product',
        price: product.sp || 0, // Store as number for filtering
        priceDisplay: `Rs.${product.sp}`, // For display
        category: category, 
        subcategory: extractSubcategory(product.keywords), 
        description: product.listingDescription || '',
        image: product.listingImgUrls?.[0] || '',
        code: product.code,
        keywords: product.keywords || []
      })) || []
      
      setProducts(transformedProducts)
      
      // Filter products by category
      const categoryFiltered = transformedProducts.filter(
        product => product.category.toLowerCase() === category.toLowerCase()
      )
      setFilteredProducts(categoryFiltered)
      
    } catch (err) {
      console.error('Error fetching products:', err)
      setError(err.message)
      setProducts([])
      setFilteredProducts([])
    } finally {
      setIsLoading(false)
    }
  }
  
  const extractSubcategory = (keywords) => {
    if (!keywords || !Array.isArray(keywords) || keywords.length === 0) {
      return ''
    }
    return keywords[0] || ''
  }
  
  // Initial fetch
  useEffect(() => {
    if (category) {
      fetchProducts()
    }
  }, [category])
  
  // Get unique subcategories
  const subcategories = useMemo(() => {
    const subs = [...new Set(
      filteredProducts
        .map(product => product.subcategory)
        .filter(Boolean)
    )].sort()
    return subs
  }, [filteredProducts])

  // Apply all filters including search
  const allFilteredProducts = useMemo(() => {
    let filtered = [...filteredProducts]

    // Apply search filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower) ||
        product.code?.toLowerCase().includes(searchLower) ||
        product.keywords.some(keyword => 
          keyword.toLowerCase().includes(searchLower)
        )
      )
    }

    // Apply subcategory filter
    if (selectedSubcategory) {
      filtered = filtered.filter(product => product.subcategory === selectedSubcategory)
    }

    // Apply price range filter
    if (minPrice || maxPrice) {
      filtered = filtered.filter(product => {
        const price = typeof product.price === 'number' ? product.price : parseFloat(product.price) || 0
        const min = minPrice ? parseFloat(minPrice) : 0
        const max = maxPrice ? parseFloat(maxPrice) : Infinity
        return price >= min && price <= max
      })
    }

    return filtered
  }, [filteredProducts, searchTerm, selectedSubcategory, minPrice, maxPrice])

  const totalProducts = allFilteredProducts.length
  const totalPages = Math.ceil(totalProducts / productsPerPage)

  const paginatedProducts = allFilteredProducts.slice(
    (page - 1) * productsPerPage,
    page * productsPerPage
  )

  // Handle search input change - direct filtering
  const handleSearchChange = (e) => {
    const newSearchTerm = e.target.value
    setSearchTerm(newSearchTerm)
    setPage(1) // Reset to first page when searching
  }

  // Clear search
  const clearSearch = () => {
    setSearchTerm('')
    setPage(1)
  }

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return
    setPage(newPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleViewModeChange = (mode) => {
    setViewMode(mode)
  }

  const handleSubcategoryChange = (subcategory) => {
    setSelectedSubcategory(subcategory)
    setPage(1)
  }

  const handlePriceChange = (type, value) => {
    if (type === 'min') {
      setMinPrice(value)
    } else {
      setMaxPrice(value)
    }
    setPage(1)
  }

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedSubcategory('')
    setMinPrice('')
    setMaxPrice('')
    setPage(1)
  }

  const hasActiveFilters = searchTerm || selectedSubcategory || minPrice || maxPrice

  // Error state
  if (error && !isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <h2 className="text-lg font-semibold text-red-800 mb-2">Error Loading Products</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => fetchProducts()}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
      {/* Breadcrumb Navigation */}
      <div className="text-sm text-gray-500 mb-2 sm:mb-4">
        <Link to="/" className="hover:text-blue-600 hover:underline">
          Home
        </Link>
        <span className="mx-2">/</span>
        <span className="font-medium text-gray-700">{category}</span>
      </div>

      {/* Category Header */}
      <div className="mb-4 sm:mb-6 pb-2 border-b">
        <h1 className="text-2xl md:text-3xl font-bold">{category}</h1>
      </div>

      {/* Search and Filters Row */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
        {/* Search Bar */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search products by name, code, or keywords..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Filters Button */}
        <div className="relative">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            <Filter className="h-4 w-4" />
            <span>Filters</span>
            {hasActiveFilters && (
              <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                {[searchTerm, selectedSubcategory, minPrice, maxPrice].filter(Boolean).length}
              </span>
            )}
            {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>

          {/* Filters Dropdown */}
          {showFilters && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-md shadow-lg z-20 p-4">
              <div className="space-y-4">
                {/* Subcategory Filter */}
                {subcategories.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subcategory
                    </label>
                    <select
                      value={selectedSubcategory}
                      onChange={(e) => handleSubcategoryChange(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">All Subcategories</option>
                      {subcategories.map((sub) => (
                        <option key={sub} value={sub}>
                          {sub}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Price Range Filters */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Min Price
                    </label>
                    <input
                      type="number"
                      placeholder="0"
                      value={minPrice}
                      onChange={(e) => handlePriceChange('min', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Price
                    </label>
                    <input
                      type="number"
                      placeholder="No limit"
                      value={maxPrice}
                      onChange={(e) => handlePriceChange('max', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Clear Filters */}
                {hasActiveFilters && (
                  <div className="pt-2 border-t">
                    <button
                      onClick={clearFilters}
                      className="w-full text-center text-blue-600 hover:text-blue-800 text-sm font-medium py-2"
                    >
                      Clear all filters
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results Header & View Controls */}
      <div className="bg-gray-100 p-3 rounded-md flex justify-between items-center mb-4">
        {/* Results Info */}
        <p className="text-sm text-gray-600">
          {isLoading ? (
            "Loading products..."
          ) : totalProducts === 0 ? (
            searchTerm ? `No results found for "${searchTerm}"` : "No products found"
          ) : (
            `Showing ${(page - 1) * productsPerPage + 1}-${Math.min(
              page * productsPerPage,
              totalProducts
            )} of ${totalProducts} results${searchTerm ? ` for "${searchTerm}"` : ` in "${category}"`}`
          )}
        </p>

        {/* View Controls */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex border rounded overflow-hidden">
            <button
              className={`px-2 py-1 transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-gray-200 text-gray-700' 
                  : 'bg-white text-gray-400 hover:text-gray-600'
              }`}
              onClick={() => handleViewModeChange('grid')}
              aria-label="Grid view"
            >
              <Grid3X3 className="h-4 w-4" />
            </button>
            <button
              className={`px-2 py-1 transition-colors ${
                viewMode === 'list' 
                  ? 'bg-gray-200 text-gray-700' 
                  : 'bg-white text-gray-400 hover:text-gray-600'
              }`}
              onClick={() => handleViewModeChange('list')}
              aria-label="List view"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Products Display Area */}
      <div className="min-h-[400px]">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading products...</p>
            </div>
          </div>
        ) : paginatedProducts.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <ShoppingCartIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600">
                {searchTerm 
                  ? `No products match "${searchTerm}". Try different keywords.`
                  : hasActiveFilters 
                    ? "Try adjusting your filters." 
                    : "Try adjusting your search or browse other categories."
                }
              </p>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="mt-2 text-blue-600 hover:text-blue-800 font-medium"
                >
                  Clear all filters
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className={`grid gap-4 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4' 
              : 'flex flex-col gap-4'
          }`}>
            {paginatedProducts.map((product) => (
              <div key={product.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                {/* Product Image */}
                <div className="aspect-square bg-gray-100 rounded mb-2 overflow-hidden">
                  {product.image ? (
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none'
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <ShoppingCartIcon className="h-12 w-12" />
                    </div>
                  )}
                </div>
                
                {/* Product Info */}
                <h3 className="font-medium text-sm mb-1 line-clamp-2">{product.name}</h3>
                <p className="text-lg font-semibold text-green-600 mb-1">{product.priceDisplay}</p>
                {product.code && (
                  <p className="text-xs text-gray-500 mb-1">Code: {product.code}</p>
                )}
                {product.subcategory && (
                  <p className="text-xs text-gray-500">{product.subcategory}</p>
                )}
                
                {/* Keywords */}
                {product.keywords && product.keywords.length > 0 && (
                  <div className="mt-2">
                    <div className="flex flex-wrap gap-1">
                      {product.keywords.slice(0, 3).map((keyword, index) => (
                        <span 
                          key={index}
                          className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
                        >
                          {keyword}
                        </span>
                      ))}
                      {product.keywords.length > 3 && (
                        <span className="text-xs text-gray-500">
                          +{product.keywords.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {totalProducts > productsPerPage && (
        <div className="flex justify-center items-center mt-8 mb-4">
          <div className="flex items-center gap-2">
            <button
              className="h-8 w-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1 || isLoading}
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-1">
              {page > 2 && (
                <button
                  className="h-8 w-8 flex items-center justify-center hover:bg-gray-100 rounded"
                  onClick={() => handlePageChange(1)}
                >
                  1
                </button>
              )}

              {page > 3 && <span className="text-gray-500">...</span>}

              {page > 1 && (
                <button
                  className="h-8 w-8 flex items-center justify-center hover:bg-gray-100 rounded"
                  onClick={() => handlePageChange(page - 1)}
                >
                  {page - 1}
                </button>
              )}

              <button className="h-8 w-8 flex items-center justify-center bg-amber-400 hover:bg-amber-500 text-gray-900 rounded font-medium">
                {page}
              </button>

              {page < totalPages && (
                <button
                  className="h-8 w-8 flex items-center justify-center hover:bg-gray-100 rounded"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={isLoading}
                >
                  {page + 1}
                </button>
              )}

              {page < totalPages - 2 && <span className="text-gray-500">...</span>}

              {page < totalPages - 1 && (
                <button
                  className="h-8 w-8 flex items-center justify-center hover:bg-gray-100 rounded"
                  onClick={() => handlePageChange(totalPages)}
                >
                  {totalPages}
                </button>
              )}
            </div>

            <button
              className="h-8 w-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages || isLoading}
            >
              <ChevronRightIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default CategoryProductsPage