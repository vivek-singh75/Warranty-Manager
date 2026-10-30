import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
 

  return (
    <main className="h-14 w-screen px-3 sm:px-5 md:px-10 bg-blue-950 flex justify-between items-center text-white fixed">

        <Link
            to="/AddProducts"
            className="px-3 py-2 rounded-md text-sm sm:text-base font-medium hover:bg-cyan-700 active:bg-cyan-800 transition"
        >
            Home
        </Link>

        <div className=' flex justify-between items-center sm:gap-3 md:gap-15'>
            <Link
            to="/AddProducts"
            className="px-3 py-2 rounded-md text-sm sm:text-base font-medium hover:bg-cyan-700 active:bg-cyan-800 transition"
            >
                Add Products
            </Link>

            <Link
                to="/products"
                className="px-3 py-2 rounded-md text-sm sm:text-base font-medium hover:bg-cyan-700 active:bg-cyan-800 transition"
            >
                Products
            </Link>
        </div>

        

        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-cyan-600 flex items-center justify-center font-semibold text-sm sm:text-base cursor-pointer hover:bg-cyan-500 transition">
            V
        </div>

    </main>
  )
}

export default Navbar