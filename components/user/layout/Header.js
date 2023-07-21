import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function Header({ me, handleLogout }) {
    const [showSearchProducts, setShowSearchProducts] = useState(false);
    const [showBGWhite, setShowBGWhite] = useState(false);
    const [query, setQuery] = useState('');
    const modalRef = useRef();
    const [products, setProducts] = useState([])
    const [navToggle, setNavToggle] = useState(false)

    const fetchSearchProducts = async () => {
        const searchResponse = await fetch(`${process.env.API_BASE_URL}/products/search`, {
            method: 'POST',
            body: JSON.stringify({
                query: query
            }),
            headers: {
                "Content-Type": "application/json",
            }
        })

        const serachData = await searchResponse.json();

        setProducts(serachData.data);
    }

    const handleChange = (e) => {
        if (e.target.value.length > 0) {
            setShowBGWhite(true);
            setShowSearchProducts(true);
        } else {
            handleScroll();
            setShowSearchProducts(false);
        }

        setQuery(e.target.value);
    }

    useEffect(() => {
        if (showSearchProducts) {
            let timer;

            function debounce() {
                timer = setTimeout(() => {
                    fetchSearchProducts();
                }, 1000)
            }

            debounce()

            return (() => {
                clearTimeout(timer);
            })
        }
    }, [query]);

    useEffect(() => {
        const handleModal = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                setShowSearchProducts(false);
            }
        };

        document.addEventListener('click', handleModal);

        return () => {
            document.removeEventListener('click', handleModal);
        };
    }, [showSearchProducts]);

    const handleScroll = () => {
        if (window.pageYOffset > 0) {
            setShowBGWhite(true)
        } else {
            setShowBGWhite(false);
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <>
            <div className={`container-fluid fixed-top px-0 wow fadeIn ${showBGWhite && "bg-white shadow-sm"}`}>
                <div className="top-bar row gx-0 align-items-center d-none d-lg-flex">
                    <div className="col-lg-6 px-5 text-start">
                        <small><i className="fa fa-map-marker-alt me-2"></i>123 Street, New York, USA</small>
                        <small className="ms-4"><i className="fa fa-envelope me-2"></i>info@example.com</small>
                    </div>
                    <div className="col-lg-6 px-5 text-end">
                        <small>Follow us:</small>
                        <Link className="text-body ms-3" href="/"><i className="fab fa-facebook-f"></i></Link>
                        <Link className="text-body ms-3" href="/"><i className="fab fa-twitter"></i></Link>
                        <Link className="text-body ms-3" href="/"><i className="fab fa-linkedin-in"></i></Link>
                        <Link className="text-body ms-3" href="/"><i className="fab fa-instagram"></i></Link>
                    </div>
                </div>
                <nav className="navbar navbar-expand-lg navbar-light py-lg-0 px-lg-5 wow fadeIn" data-wow-delay="0.1s">
                    <Link href="/" className="navbar-brand ms-4 ms-lg-0 lora-font">
                        <h1 className="fw-bold text-primary m-0">F<span className="text-secondary">oo</span>dy</h1>
                    </Link>
                    <button type="button" onClick={() => setNavToggle(!navToggle)} className="navbar-toggler me-4 nav-toggle">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className={`collapse navbar-collapse ${navToggle ? "show" : "hide"}`} id="navbarCollapse">
                        <div className="navbar-nav ms-auto navbar-nav-items">
                            <Link onClick={() => setNavToggle(!navToggle)} href="/" className="nav-item nav-link">Home</Link>
                            <Link onClick={() => setNavToggle(!navToggle)} href="/products" className="nav-item nav-link">Products</Link>
                            <Link onClick={() => setNavToggle(!navToggle)} href="/aboutus" className="nav-item nav-link">About Us</Link>
                            <div className="d-flex py-2 align-items-center">
                                <div className="search-container">
                                    <input type="text" id="search-input" placeholder="Search food item" onChange={(e) => handleChange(e)} />
                                    <small className="fa fa-search text-body"></small>
                                </div>
                                {me?.data && me?.success && (
                                    <>
                                        <Link onClick={() => setNavToggle(!navToggle)} className="btn-sm-square bg-white border rounded-circle ms-3" href="/cart">
                                            <small className="fa fa-shopping-bag text-body"></small>
                                        </Link>
                                        <Link onClick={() => setNavToggle(!navToggle)} className="btn-sm-square bg-white border rounded-circle ms-3" href="/order">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-truck-delivery text-dark" width="20" height="20" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" strokeLinejoin="round">
                                                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                                <path d="M7 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path>
                                                <path d="M17 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path>
                                                <path d="M5 17h-2v-4m-1 -8h11v12m-4 0h6m4 0h2v-6h-8m0 -5h5l3 5"></path>
                                                <path d="M3 9l4 0"></path>
                                            </svg>
                                        </Link>
                                        <Link onClick={() => { setNavToggle(!navToggle); handleLogout(); }} className="btn-sm-square bg-white border rounded-circle ms-3" href="#">
                                            <small className="fa fal fa-sign-out-alt text-dark"></small>
                                        </Link>
                                        <Link onClick={() => setNavToggle(!navToggle)} className="btn-sm-square bg-white border rounded-circle ms-3" href="/profile/account">
                                            <img className="profile-icon border rounded-circle" src={`/user/images/dynamic/users/${me.data.avatar}`} width={32} height={32} alt="" />
                                        </Link>
                                    </>
                                )}
                                {!me?.data && !me?.success && (
                                    <Link onClick={() => setNavToggle(!navToggle)} className="btn-sm-square bg-white border rounded-circle ms-3" href="/auth/login">
                                        <small className="fa fa-user text-body"></small>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </nav>
            </div>
            {showSearchProducts && (
                <div className={`search-products`} ref={modalRef}>
                    {products.map((product) => {
                        return (
                            <div key={product.id}>
                                <Link href={`/products/${product.id}`} onClick={() => { setQuery(''); setShowSearchProducts(false); setNavToggle(!navToggle); }}>
                                    <div className="search-product-card">
                                        <img src={`/user/images/dynamic/products/${product.images[0]}`} width={60} height={60} alt="" />
                                        <h3>{product.name}</h3>
                                    </div>
                                </Link>
                            </div>
                        )
                    })}
                </div>
            )}
        </>
    )
}