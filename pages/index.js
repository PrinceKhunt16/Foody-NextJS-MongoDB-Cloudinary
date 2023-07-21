import { useEffect, useState } from 'react'
import About from '@/components/user/home/About'
import FirmVisit from '@/components/user/home/FirmVisit'
import OurFitures from '@/components/user/home/OurFitures'
import Slider from '@/components/user/home/Slider'
import Testimonial from '@/components/user/home/Testimonial'
import Product from '@/components/user/Product'
import Head from 'next/head'
import Link from 'next/link'

export default function Home() {
  const [products, setProducts] = useState([])

  const fetchProducts = async () => {
    const productsResponse = await fetch(`${process.env.API_BASE_URL}/products/getallproducts`, {
      method: 'POST',
      body: JSON.stringify({
        page: 0,
        documents: 12
      }),
      headers: {
        "Content-Type": "application/json",
      }
    })

    const productsData = await productsResponse.json();

    setProducts(productsData.data);
  }

  useEffect(() => {
    fetchProducts()
  }, []);

  return (
    <>
      <Head>
        <title>Home</title>
      </Head>
      <Slider />
      <About />
      <div className="container-xxl py-5">
        <div className="container">
          <div className="row g-0 gx-5 align-items-end">
            <div className="col-lg-6">
              <div className="section-header text-start mb-5 wow fadeInUp" data-wow-delay="0.1s">
                <h1 className="display-5 mb-3">Our Products</h1>
                <p>Tempor ut dolore lorem kasd vero ipsum sit eirmod sit. Ipsum diam justo sed rebum vero dolor duo.</p>
              </div>
            </div>
          </div>
          <div className="row g-4">
            {products.map((product) => {
              return (
                <Product product={product} xl={3} lg={3} md={6} />
              )
            })}
          </div>
          <div className='d-flex justify-content-center mt-4'>
            <Link href={"/products"} className='btn btn-primary rounded-pill py-3 px-5 mt-3'>View More</Link>
          </div>
        </div>
      </div>
      <OurFitures />
      <FirmVisit />
      <Testimonial />
    </>
  )
}
