import Banner from "@/components/user/Banner";
import { notifyError, notifySuccess } from "@/utils/notify";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ProductDetails({ product }) {
    const [liveShowingImage, setLiveShowingImage] = useState();
    const [quantity, setQuantity] = useState(0);
    const [stars, setStars] = useState([]);

    const addToCart = async () => {
        if (product.status === 0) {
            notifyError("The product is out of stock.");
            return;
        }

        if (quantity === 0) {
            notifyError("Product quantity must be greater than 0.");
            return;
        }

        const cartResponse = await fetch(`${process.env.API_BASE_URL}/cart/addtocart`, {
            method: 'POST',
            body: JSON.stringify({
                quantity: quantity,
                productId: product.id,
                status: 1
            }),
            headers: {
                "Content-Type": "application/json",
            }
        })

        const cartData = await cartResponse.json();

        if (cartData.success) {
            notifySuccess(cartData.message)
        } else {
            notifyError(cartData.message)
        }
    }

    const increaseQuantity = () => {
        setQuantity(quantity + 1);
    }

    const decreaseQuantity = () => {
        if (quantity <= 0) {
            return;
        }

        setQuantity(quantity - 1);
    }

    useEffect(() => {
        let num = product.rating;
        const makeStars = [];

        for (let i = 1; i <= 5; i++) {
            if (num >= i) {
                makeStars.push(1);
            } else if (num > i - 1 && num < i) {
                makeStars.push(0);
            } else {
                makeStars.push(-1);
            }
        }

        setStars(makeStars);
    }, []);

    useEffect(() => {
        setLiveShowingImage(product.images[0]);
    }, [product]);

    return (
        <>
            <Banner name={"Product Details"} />
            <div className="container">
                <section className="py-5">
                    <div className="container">
                        <div className="row gx-5">
                            <aside className="col-lg-6">
                                <div className="border rounded-4 mb-3 d-flex justify-content-center">
                                    <a data-fslightbox="mygalley" className="rounded-4 w-100" data-type="image">
                                        <img className="rounded-4 fit product-page-image w-100" src={`/user/images/dynamic/products/${liveShowingImage}`} />
                                    </a>
                                </div>
                                <div className="d-flex justify-content-center mb-3">
                                    {
                                        product.images.map((img) => {
                                            return (
                                                <a data-fslightbox="mygalley" className="border mx-1 rounded-2 cursor-pointer" onClick={() => setLiveShowingImage(img)} data-type="image">
                                                    <img width="60" height="60" className="rounded-2" src={`/user/images/dynamic/products/${img}`} />
                                                </a>
                                            )
                                        })
                                    }
                                </div>
                            </aside>
                            <main className="col-lg-6">
                                <div className="ps-lg-3">
                                    <h4 className="title text-dark">
                                        {product.name}
                                    </h4>
                                    <div className="d-flex flex-row my-3">
                                        <div className="text-warning mb-1 me-2">
                                            {
                                                stars.map((star) => {
                                                    return (
                                                        <>
                                                            {star === 1 && <i className="fas fa-star"></i>}
                                                            {star === 0 && <i className="fas fa-star-half-alt"></i>}
                                                            {star === -1 && <i className="far fa-star"></i>}
                                                        </>
                                                    )
                                                })}
                                            <span className="ms-1">
                                                {Number(product.rating).toFixed(1)}
                                            </span>
                                        </div>
                                        <span className="text-success ms-2">{product.status ? "In stock" : "Out of stock"}</span>
                                    </div>
                                    <div className="mb-3">
                                        <span className="h2">₹ {product.price}</span>
                                        <span> / </span>
                                        <span className="text-muted text-body text-decoration-line-through">₹ {product.wrongPrice}</span>
                                    </div>
                                    <div className="mb-3">
                                        <span className="h4">{product.discount}% </span>
                                        <span className="h6">Discount</span>
                                    </div>
                                    <div className="row">
                                        <dt className="col-3">Category</dt>
                                        <dd className="col-9">{product.category}</dd>
                                        <dt className="col-3">Company</dt>
                                        <dd className="col-9">{product.company}</dd>
                                        <dt className="col-3">Origin</dt>
                                        <dd className="col-9">{product.origin}</dd>
                                        <dt className="col-3">Preferences</dt>
                                        <dd className="col-9">{product.preferences}</dd>
                                        <dt className="col-3">Weight</dt>
                                        <dd className="col-9">{product.weight} gm</dd>
                                    </div>
                                    <hr />
                                    <div className="row">
                                        <div className="col-sm-12 col-md-4 col-lg-5">
                                            <label className="mb-2 d-block">Quantity</label>
                                            <div className="input-group mb-1">
                                                <button className="btn btn-white border border-secondary px-3" onClick={() => decreaseQuantity()} type="button" id="button-addon1" data-mdb-ripple-color="dark">
                                                    <i className="fas fa-minus"></i>
                                                </button>
                                                <input type="text" value={quantity} className="form-control text-center border border-secondary" placeholder="14" aria-label="Example text with button addon" />
                                                <button className="btn btn-border border-secondary px-3" onClick={() => increaseQuantity()} type="button" id="button-addon2" data-mdb-ripple-color="dark">
                                                    <i className="fas fa-plus"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <hr />
                                    <div className="my-4">
                                        <Link className="btn btn-warning shadow-0 w-100 p-2" href="/cart"> <i className="me-1 fa fa-shopping-basket"></i> Checkout </Link>
                                    </div>
                                    <div className="my-4">
                                        <button className="btn btn-primary shadow-0 w-100 p-2" onClick={() => addToCart()}> <i className="me-1 fa fa-shopping-basket"></i> Add to cart </button>
                                    </div>
                                </div>
                            </main>
                        </div>
                    </div>
                </section>
                <div>
                    <h1>Reviews</h1>
                </div>
            </div>
        </>
    )
}

export async function getServerSideProps(context) {
    const productResponse = await fetch(`${process.env.API_BASE_URL}/products/indivisual/${context.params.productId}`, {
        method: "GET"
    });

    const productData = await productResponse.json();

    return {
        props: {
            product: productData.data
        }
    }
}