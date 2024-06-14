// 'use client'
// import React, { useEffect, useState } from 'react'
// import Navbar from '@/Components/Navbar'
// import Link from 'next/link'
// import Card from '@/Components/Card'
// import Status from '@/Components/Status'
// import Testimonials from '@/Components/Testimonials'
// import Image from 'next/image'
// import { AiOutlineShoppingCart } from "react-icons/ai";
// import { FaSearch, FaWhatsapp } from 'react-icons/fa'
// import Footer from '@/Components/Footer'
// import Head from 'next/head'
// import banner1 from '../assets/banner1.png'
// import banner2 from '../assets/banner2.png'
// import banner3 from '../assets/banner3.png'

// interface Item {
//   desc: string
//   id: number;
//   title: string;
//   count: number;
//   userId: string;
//   image: string;
//   price: number;
//   ratings: number;
//   tag: string;
//   path: string;
//   shipCost: string;
//   gst: string;
// }

// export default function Home() {
//   const [data, setData] = useState<Item[]>([]);
//   const [filteredProducts, setFilteredProducts] = useState<Item[]>([]);
//   const [isSearching, setIsSearching] = useState(false);

//   useEffect(() => {
//     const handleCart = async () => {
//       const url = process.env.NEXT_PUBLIC_SERVER_URL + "/product/get";
//       try {
//         const response = await fetch(url, {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//         });
//         const res = await response.json();
//         setData(res.data);
//         setFilteredProducts(res.data); // Initialize filteredProducts with all data
//       } catch (error) {
//         console.error('Error:', error);
//       }
//     }
//     handleCart();
//   }, [])

//   const handleSearch = (query: string) => {
//     const lowerCaseQuery = query.toLowerCase();
//     if (lowerCaseQuery === "") {
//       setFilteredProducts(data);
//       setIsSearching(false);
//     } else {
//       const filtered = data.filter(product =>
//         product.title.toLowerCase().includes(lowerCaseQuery)
//       );
//       setFilteredProducts(filtered);
//       setIsSearching(true);
//     }
//   };

//   return (
//     <>
//       <Navbar onSearch={handleSearch} />
//       <div className={`md:mt-16 mt-36 ${isSearching ? 'blur-sm' : ''}`}>
//         <div id="default-carousel" className={`relative w-auto mr-1 ml-1 ${isSearching ? 'hidden' : ''}`} data-carousel="slide">
//           <div className="relative overflow-hidden rounded-lg h-52 md:h-[400px] mb-6">
//             <div className="duration-700 ease-in-out" data-carousel-item>
//               <Image
//                 src={banner3}
//                 alt='banner3'
//                 layout="fill"
//                 objectFit="cover"
//                 quality={100}
//                 className="absolute"
//               />
//             </div>
//             <div className="hidden duration-700 ease-in-out" data-carousel-item>
//               <Image
//                 src={banner2}
//                 alt='banner2'
//                 layout="fill"
//                 objectFit="cover"
//                 quality={100}
//                 className="absolute"
//               />
//             </div>
//             <div className="hidden duration-700 ease-in-out" data-carousel-item>
//               <Image
//                 src={banner1}
//                 alt='banner1'
//                 layout="fill"
//                 objectFit="cover"
//                 quality={100}
//                 className="absolute"
//               />
//             </div>
//           </div>
//           <div className="absolute z-20 flex -translate-x-1/2 bottom-5 left-1/2 space-x-3 rtl:space-x-reverse">
//             <button type="button" className="w-3 h-3 rounded-full" aria-current="true" aria-label="Slide 1" data-carousel-slide-to="0"></button>
//             <button type="button" className="w-3 h-3 rounded-full" aria-current="false" aria-label="Slide 2" data-carousel-slide-to="1"></button>
//             <button type="button" className="w-3 h-3 rounded-full" aria-current="false" aria-label="Slide 3" data-carousel-slide-to="2"></button>
//             <button type="button" className="w-3 h-3 rounded-full" aria-current="false" aria-label="Slide 4" data-carousel-slide-to="3"></button>
//             <button type="button" className="w-3 h-3 rounded-full" aria-current="false" aria-label="Slide 5" data-carousel-slide-to="4"></button>
//           </div>
//           <button type="button" className="absolute top-0 left-0 z-20 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none" data-carousel-prev>
//             <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
//               <svg className="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
//                 <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 1 1 5l4 4" />
//               </svg>
//               <span className="sr-only">Previous</span>
//             </span>
//           </button>
//           <button type="button" className="absolute top-0 right-0 z-20 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none" data-carousel-next>
//             <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
//               <svg className="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
//                 <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
//               </svg>
//               <span className="sr-only">Next</span>
//             </span>
//           </button>
//         </div>

//         <h1 className='text-center md:text-3xl text-xl font-bold mb-2'>OUR PRODUCTS</h1>
//         <div className="flex items-center justify-center mb-4">
//           <hr className="w-1/4 md:border-t-4 border-t-2 border-black mr-4" />
//           <span className="text-[#103178] md:text-5xl text-2xl"><AiOutlineShoppingCart /></span>
//           <hr className="w-1/4 md:border-t-4 border-t-2 border-black ml-4" />
//         </div>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 ml-5 mr-5">
//         {
//           filteredProducts && filteredProducts.length > 0 ? (
//             filteredProducts.map((item) => (
//               <Card
//                 key={item.id}
//                 id={item.id}
//                 title={item.title}
//                 description={item.desc}
//                 price={item.price}
//                 image={item.image}
//                 rating={item.ratings}
//                 tag={item.tag}
//                 path={item.path}
//                 gst={item.gst}
//                 shipCost={item.shipCost}
//               />
//             ))
//           ) : (
//             <div className='flex flex-col items-center justify-center w-full md:h-screen md:mb-0 mb-20 text-center text-black font-bold'>
//               <FaSearch className="text-6xl md:mb-4" />
//               <p className="text-xl">Oops! Can&apos;t find what you&apos;re looking for.</p>
//             </div>
//           )
//         }
//       </div>

//       <a
//         href="https://wa.me/YOUR_NUMBER"
//         className="fixed right-4 bottom-20 bg-green-500 text-white md:p-3 p-1 rounded-full shadow-lg hover:bg-green-600 transition-colors duration-300"
//         target="_blank"
//         rel="noopener noreferrer"
//       >
//         <FaWhatsapp size={30} className="text-xl md:text-3xl" />
//       </a>

//       {/* <div className="grid sm:grid-cols-2 grid-cols-3 gap-4">
//         <Status />
//         <Status />
//         <Status />
//       </div> */}

//       {/* <Testimonials /> */}

//       <Footer />
//     </>
//   )
// }

'use client'
import React, { useEffect, useState, useRef } from 'react'
import Navbar from '@/Components/Navbar'
import Link from 'next/link'
import Card from '@/Components/Card'
import Status from '@/Components/Status'
import Testimonials from '@/Components/Testimonials'
import Image from 'next/image'
import { AiOutlineShoppingCart } from "react-icons/ai";
import { FaSearch, FaWhatsapp } from 'react-icons/fa'
import Footer from '@/Components/Footer'
import Head from 'next/head'
import banner1 from '../assets/banner1.png'
import banner2 from '../assets/banner2.png'
import banner3 from '../assets/banner3.png'

interface Item {
  desc: string
  customId: number;
  title: string;
  count: number;
  userId: string;
  image: string;
  price: number;
  ratings: number;
  tag: string;
  path: string;
  weight: string;
  gst: string;
  category: string;
}

export default function Home() {
  const [data, setData] = useState<Item[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Item[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  function setCookie(name: string, value: string, minutes: number) {
    if (typeof document === 'undefined') return;
    const date = new Date();
    date.setTime(date.getTime() + (minutes * 60 * 1000));
    const expires = "; expires=" + date.toUTCString();
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
  }

  setCookie('userId', '12345', 30);


  useEffect(() => {
    const handleCart = async () => {
      const url = process.env.NEXT_PUBLIC_SERVER_URL + "/product/get";
      console.log(url);
      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const res = await response.json();
        setData(res.data);
        setFilteredProducts(res.data); // Initialize filteredProducts with all data
      } catch (error) {
        console.error('Error:', error);
      }
    }
    handleCart();
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 5);
    }, 5000); // Change slide every 3 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (carouselRef.current) {
      const slides = carouselRef.current.querySelectorAll('[data-carousel-item]');
      slides.forEach((slide, index) => {
        slide.classList.toggle('hidden', index !== currentSlide);
      });
    }
  }, [currentSlide]);

  const handleSearch = (query: string) => {
    const lowerCaseQuery = query.toLowerCase();
    if (lowerCaseQuery === "") {
      setFilteredProducts(data);
      setIsSearching(false);
    } else {
      const filtered = data.filter(product =>
        product.title.toLowerCase().includes(lowerCaseQuery) ||
        product.category.toLowerCase().includes(lowerCaseQuery)
      );
      setFilteredProducts(filtered);
      setIsSearching(true);
    }
  };

  return (
    <>
      <Navbar onSearch={handleSearch} />
      <div className={`md:mt-16 mt-36 ${isSearching ? 'blur-sm' : ''}`}>
        <div id="default-carousel" className={`relative w-auto -mr-1 ml-1 ${isSearching ? 'hidden' : ''}`} data-carousel="slide">
          <div className="relative overflow-hidden rounded-lg h-52 md:h-[400px] mb-6">
            <div className="duration-700 ease-in-out" data-carousel-item>
              <Image
                src={banner3}
                alt='banner3'
                layout="fill"
                objectFit="cover"
                quality={100}
                className="absolute"
              />
            </div>
            <div className="hidden duration-700 ease-in-out" data-carousel-item>
              <Image
                src={banner2}
                alt='banner2'
                layout="fill"
                objectFit="cover"
                quality={100}
                className="absolute"
              />
            </div>
            <div className="hidden duration-700 ease-in-out" data-carousel-item>
              <Image
                src={banner1}
                alt='banner1'
                layout="fill"
                objectFit="cover"
                quality={100}
                className="absolute"
              />
            </div>
          </div>
          <div className="absolute z-20 flex -translate-x-1/2 bottom-5 left-1/2 space-x-3 rtl:space-x-reverse">
            <button type="button" className="w-3 h-3 rounded-full" aria-current="true" aria-label="Slide 1" data-carousel-slide-to="0"></button>
            <button type="button" className="w-3 h-3 rounded-full" aria-current="false" aria-label="Slide 2" data-carousel-slide-to="1"></button>
            <button type="button" className="w-3 h-3 rounded-full" aria-current="false" aria-label="Slide 3" data-carousel-slide-to="2"></button>
            <button type="button" className="w-3 h-3 rounded-full" aria-current="false" aria-label="Slide 4" data-carousel-slide-to="3"></button>
            <button type="button" className="w-3 h-3 rounded-full" aria-current="false" aria-label="Slide 5" data-carousel-slide-to="4"></button>
          </div>
          <button type="button" className="absolute top-0 left-0 z-20 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none" data-carousel-prev>
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
              <svg className="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 1 1 5l4 4" />
              </svg>
              <span className="sr-only">Previous</span>
            </span>
          </button>
          <button type="button" className="absolute top-0 right-0 z-20 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none" data-carousel-next>
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
              <svg className="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
              </svg>
              <span className="sr-only">Next</span>
            </span>
          </button>
        </div>

        <h1 className='text-center md:text-3xl text-xl font-bold mb-2'>OUR PRODUCTS</h1>
        <div className="flex items-center justify-center mb-4">
          <hr className="w-1/4 md:border-t-4 border-t-2 border-black mr-4" />
          <span className="text-[#103178] md:text-5xl text-2xl"><AiOutlineShoppingCart /></span>
          <hr className="w-1/4 md:border-t-4 border-t-2 border-black ml-4" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 ml-5 mr-5">
        {
          filteredProducts && filteredProducts.length > 0 ? (
            filteredProducts.map((item) => (
              <Card
                key={item.customId}
                customId={item.customId}
                title={item.title}
                description={item.desc}
                price={item.price}
                image={item.image}
                rating={item.ratings}
                tag={item.tag}
                path={item.path}
                gst={item.gst}
                weight={item.weight}
              />
            ))
          ) : (
            <div className='flex flex-col items-center justify-center w-full md:h-screen md:mb-0 mb-20 text-center text-black font-bold'>
              <FaSearch className="text-6xl md:mb-4" />
              <p className="text-xl">Oops! Can&apos;t find what you&apos;re looking for.</p>
            </div>
          )
        }
      </div>

      <a
        href="https://wa.me/+918607863200"
        className="fixed right-4 bottom-20 bg-green-500 text-white md:p-3 p-1 rounded-full shadow-lg hover:bg-green-600 transition-colors duration-300"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FaWhatsapp size={30} className="text-xl md:text-3xl" />
      </a>

      {/* <div className="grid sm:grid-cols-2 grid-cols-3 gap-4 mt-8">
        <Status />
        <Status />
        <Status />
      </div> */}

      <div className='mt-5'>
        <Testimonials />
      </div>

      <Footer />
    </>
  )
}
