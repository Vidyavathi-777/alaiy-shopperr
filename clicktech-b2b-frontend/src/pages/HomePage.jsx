import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const HomePage = () => {
  const [loading, setLoading] = useState(true)
  const [productsByCategory, setProductsByCategory] = useState({})

  // Custom fixed category list
  const categories = [
    'Wireless',
    'Earbuds',
    'Electronics',
    'Charger',
    'Phone accessories',
    'Led lights'
  ]

  // Normalize category name for API usage
  const normalizeCategoryName = (catName) => {
    return catName
      .toLowerCase()
      .replace(/\s+/g, '-')       
      .replace(/[&]/g, 'and')     
      .replace(/[^\w-]/g, '')     
  }

  useEffect(() => {
    async function fetchProducts() {
      try {
        const productPromises = categories.map(async (cat) => {
          const normalizedCategory = normalizeCategoryName(cat)
          const res = await fetch(
            `http://127.0.0.1:8000/api/products/search?expression=${encodeURIComponent(normalizedCategory)}&page_no=0&page_size=3`
          )
          const productData = await res.json()

          console.log(`categoryName: ${cat}, normalized: ${normalizedCategory}, products:`, productData.results)

          return { categoryName: cat, products: productData.results || [] }
        })

        const productResults = await Promise.all(productPromises)

        const grouped = {}
        productResults.forEach(({ categoryName, products }) => {
          grouped[categoryName] = products
        })

        setProductsByCategory(grouped)
      } catch (error) {
        console.error('Failed to fetch products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-6">Shop by Category</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div
              key={cat}
              className="bg-blue-100 p-4 rounded-lg shadow border border-gray-200"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">{cat}</h3>
                <Link
                  to={`/categories/${normalizeCategoryName(cat)}`}
                  className="text-sm text-blue-600 hover:underline"
                >
                  See more
                </Link>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {(productsByCategory[cat] || []).map((product) => (
                  <Link
                    key={product._id}
                    to={`/products/${product._id}`}
                    className="flex flex-col items-center"
                  >
                    <div className="h-20 w-20 flex items-center justify-center bg-white border p-1">
                      <img
                        src={
                          product?.listingImgUrls?.[0] || '/no-image.png'
                        }
                        alt={product.listingName}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <p className="text-xs text-center mt-1 line-clamp-2">
                      {product.listingName}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default HomePage
