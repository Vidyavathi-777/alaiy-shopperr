import React, { useState } from 'react'
import { IoMdMenu, IoMdClose } from "react-icons/io";
import { RiArrowRightSLine } from "react-icons/ri";
import { products } from '../data/product'

const CategorySidebar = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)


    const groupedByCategory = products.reduce((acc, product) => {
        const { category, subcategory } = product
        if (!acc[category]) acc[category] = []
        if (!acc[category][subcategory]) acc[category][subcategory] = []
        acc[category][subcategory].push(product)
        return acc
    }, {})

    const categories = Object.keys(groupedByCategory)
    return (
        <>
            <div className='bg-[#62c8f5] py-1 px-4 flex'>
                <div className='container mx-auto flex items-center gap-4 overflow-x-auto text-sm text-[#06184b]' onClick={() => setIsSidebarOpen(true)}>
                    <IoMdMenu size={24} className='mr-1 h-4 w-4'/>
                    <h3 className="">All Categories</h3>
               
                {categories.map((category) => (
                    <div key={category} className='mr-4 whitespace-nowrap hover:text-gray-700 transition-colors'>
                        <span>{category}</span>

                    </div>
                ))}
                 </div>
            </div>
            <div className={`fixed  bg-white shadow-lg w-70 overflow-y-auto inset-y-0 left-0 z-50 transform transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className='flex items-center justify-between p-4 bg-[#06184b] text-white '>
                    <h2 className='text-xl font-bold flwx-1'>Shop By Category</h2>
                    <IoMdClose onClick={() => setIsSidebarOpen(false)} className='cursor-pointer text-white hover:bg-[#3a4553]' size={24} />

                </div>
                <div className='  py-2'>
                    {Object.keys(groupedByCategory).map(category => (
                        <div key={category} className='border-b'>
                            <a className="flex items-center justify-between p-3 hover:bg-gray-100">
                                <div className="flex items-center">
                                    <span>{category}</span>
                                </div>
                                <RiArrowRightSLine className="h-4 w-4 text-gray-500" />
                            </a>
                            <div className='bg-gray-50 pl-8 pr-4 py-1'>
                                {Object.keys(groupedByCategory[category]).map(subcategory => (
                                    <a className="block py-2 text-sm font-medium text-gray-700 hover:text-blue-600">
                                        <div key={subcategory} className="flex items-center">
                                            <span>{subcategory}</span>
                                        </div>

                                    </a>
                                ))}
                                <a href="#" className='block py-2 text-sm text-blue-600 font-medium' >See all in {category}</a>
                            </div>
                            
                        </div>
                    ))}

                </div>

            </div>
        </>
    )
}

export default CategorySidebar
