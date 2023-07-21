import Banner from "@/components/user/Banner";
import FirmVisit from "@/components/user/home/FirmVisit";
import Testimonial from "@/components/user/home/Testimonial";
import Product from "@/components/user/Product";
import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";

export default function Products() {
    const [products, setProducts] = useState([])
    const [page, setPage] = useState(0);
    const [pages, setPages] = useState(0);
    const [documents] = useState(9);
    const [filterData, setFilterData] = useState();
    const [query, setQuery] = useState({
        prices: [],
        company: "",
        preferencies: [],
        origin: "",
        discount: null,
        weights: [],
        ratings: [],
    })

    const handleChangeQuery = (name, value) => {
        if (name === 'prices') {
            if (query.prices.find(price => price.min === value.min && price.max === value.max)) {
                setQuery({
                    ...query,
                    prices: query.prices.filter(price => price.min !== value.min && price.max !== value.max)
                })
            } else {
                setQuery({
                    ...query,
                    prices: [...query.prices, value]
                })
            }
        } else if (name === 'company') {
            if (filterData.companiesData.includes(value) || value === '') {
                setQuery({
                    ...query,
                    company: value
                })
            }
        } else if (name === 'preferencies') {
            if (query.preferencies.includes(value)) {
                setQuery({
                    ...query,
                    preferencies: query.preferencies.filter(preferences => preferences !== value)
                })
            } else {
                setQuery({
                    ...query,
                    preferencies: [...query.preferencies, value]
                })
            }
        } else if (name === 'origin') {
            if (filterData.originData.includes(value) || value === '') {
                setQuery({
                    ...query,
                    origin: value
                })
            }
        } else if (name === 'discount') {
            setQuery({
                ...query,
                discount: value
            })
        } else if (name === 'weights') {
            if (query.weights.find(size => size.min === value.min && size.max === value.max)) {
                setQuery({
                    ...query,
                    weights: query.weights.filter(size => size.min !== value.min && size.max !== value.max)
                })
            } else {
                setQuery({
                    ...query,
                    weights: [...query.weights, value]
                })
            }
        } else if (name === 'ratings') {
            if (query.ratings.includes(value)) {
                setQuery({
                    ...query,
                    ratings: query.ratings.filter(rating => rating !== value)
                })
            } else {
                setQuery({
                    ...query,
                    ratings: [...query.ratings, value]
                })
            }
        }
    }

    const fetchProducts = async (page) => {
        const queryResponse = await fetch(`${process.env.API_BASE_URL}/products/filters/getfilterdata`, {
            method: 'POST',
            body: JSON.stringify({
                query: query,
                page: page,
                documents: documents
            }),
            headers: {
                "Content-Type": "application/json",
            }
        })

        const queryData = await queryResponse.json();

        setPage(page);
        setPages(queryData.pages);
        setProducts(queryData.data);
    }

    const getFilters = async () => {
        const filtersResponse = await fetch(`${process.env.API_BASE_URL}/products/filters/getfilters`, {
            method: 'GET'
        })

        const filtersData = await filtersResponse.json();

        setFilterData(filtersData.data);
    }

    useEffect(() => {
        let timer;

        function debounce() {
            timer = setTimeout(() => {
                fetchProducts(page);
            }, 500)
        }

        debounce()

        return (() => {
            clearTimeout(timer);
        })
    }, [query]);

    useEffect(() => {
        getFilters()
    }, []);

    return (
        <>
            <Banner name={"Products"} />
            <div className="container-xxl py-5">
                <div className="container">
                    <div className="row">
                        <div className="col-12 col-sm-12 col-md-4 col-lg-3 col-xl-3">
                            <div className="products-filter-box row">
                                <div className="filter col-12">
                                    <h3>Price</h3>
                                    <div className="checkbox-body">
                                        <div className="checkbox-cliker">
                                            <input type="checkbox" onChange={() => handleChangeQuery("prices", { min: 0, max: 50 })} id="price-checkbox-1" name="option1" value="option1" />
                                            <label for="price-checkbox-1">Less than ₹50</label>
                                        </div>
                                        <div className="checkbox-cliker">
                                            <input type="checkbox" onChange={() => handleChangeQuery("prices", { min: 50, max: 200 })} id="price-checkbox-2" name="option2" value="option2" />
                                            <label for="price-checkbox-2">₹50 to ₹200</label>
                                        </div>
                                        <div className="checkbox-cliker">
                                            <input type="checkbox" onChange={() => handleChangeQuery("prices", { min: 200, max: 500 })} id="price-checkbox-3" name="option1" value="option1" />
                                            <label for="price-checkbox-3">₹200 to ₹500</label>
                                        </div>
                                        <div className="checkbox-cliker">
                                            <input type="checkbox" onChange={() => handleChangeQuery("prices", { min: 500, max: 2000 })} id="price-checkbox-4" name="option2" value="option2" />
                                            <label for="price-checkbox-4">₹500 to ₹2000</label>
                                        </div>
                                        <div className="checkbox-cliker">
                                            <input type="checkbox" onChange={() => handleChangeQuery("prices", { min: 2000, max: Number.MAX_SAFE_INTEGER })} id="price-checkbox-6" name="option2" value="option2" />
                                            <label for="price-checkbox-6">More than ₹2000</label>
                                        </div>
                                    </div>
                                </div>
                                <div className="filter col-12">
                                    <h3>Company</h3>
                                    <div className="datalist-body">
                                        <input type="text" id="fruits" list="brandOptions" placeholder="Enter brand name" onChange={(e) => handleChangeQuery("company", e.target.value)} />
                                        <datalist id="brandOptions">
                                            {filterData?.companiesData.map((company) => {
                                                return (
                                                    <option value={company}></option>
                                                )
                                            })}
                                        </datalist>
                                    </div>
                                </div>
                                <div className="filter col-12">
                                    <h3>Preference</h3>
                                    <div>
                                        <div className="checkbox-body">
                                            {filterData?.preferenciesData.map((preferences, index) => {
                                                return (
                                                    <>
                                                        <div className="checkbox-cliker">
                                                            <input type="checkbox" id={`preference-checkbox-${index}`} name={preferences} value={preferences} onChange={() => handleChangeQuery("preferencies", preferences)} />
                                                            <label for={`preference-checkbox-${index}`}>{preferences}</label>
                                                        </div>
                                                    </>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </div>
                                <div className="filter col-12">
                                    <h3>Origin</h3>
                                    <div>
                                        <div className="datalist-body">
                                            <input type="text" id="origin" list="originOptions" placeholder="Enter brand name" onChange={(e) => handleChangeQuery("origin", e.target.value)} />
                                            <datalist id="originOptions">
                                                {filterData?.originData.map((origin) => {
                                                    return (
                                                        <option value={origin}></option>
                                                    )
                                                })}
                                            </datalist>
                                        </div>
                                    </div>
                                </div>
                                <div className="filter col-12">
                                    <h3>Discount</h3>
                                    <div>
                                        <div className="checkbox-body">
                                            <label for="discountRange" class="form-label">{query.discount && query.discount + '%'}</label>
                                            <input type="range" class="form-range" id="discountRange" onChange={(e) => handleChangeQuery("discount", e.target.value)}></input>
                                        </div>
                                    </div>
                                </div>
                                <div className="filter col-12">
                                    <h3>Package Size</h3>
                                    <div>
                                        <div className="checkbox-body">
                                            <div className="checkbox-cliker">
                                                <input type="checkbox" id="package-size-checkbox-1" name="option1" value="option1" onChange={() => handleChangeQuery("weights", { min: 0, max: 50 })} />
                                                <label for="package-size-checkbox-1">Less than 100g</label>
                                            </div>
                                            <div className="checkbox-cliker">
                                                <input type="checkbox" id="package-size-checkbox-2" name="option2" value="option2" onChange={() => handleChangeQuery("weights", { min: 100, max: 300 })} />
                                                <label for="package-size-checkbox-2">100g to 300g</label>
                                            </div>
                                            <div className="checkbox-cliker">
                                                <input type="checkbox" id="package-size-checkbox-3" name="option3" value="option3" onChange={() => handleChangeQuery("weights", { min: 300, max: 500 })} />
                                                <label for="package-size-checkbox-3">300g to 500g</label>
                                            </div>
                                            <div className="checkbox-cliker">
                                                <input type="checkbox" id="package-size-checkbox-4" name="option4" value="option4" onChange={() => handleChangeQuery("weights", { min: 500, max: 2000 })} />
                                                <label for="package-size-checkbox-4">500g to 2kg</label>
                                            </div>
                                            <div className="checkbox-cliker">
                                                <input type="checkbox" id="package-size-checkbox-5" name="option5" value="option5" onChange={() => handleChangeQuery("weights", { min: 2000, max: Number.MAX_SAFE_INTEGER })} />
                                                <label for="package-size-checkbox-5">More than 2kg</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="filter col-12">
                                    <h3>Rating</h3>
                                    <div>
                                        <div className="checkbox-body">
                                            <div className="checkbox-cliker">
                                                <input type="checkbox" id="rating-checkbox-5" name="option2" value="option2" onChange={() => handleChangeQuery("ratings", 5)} />
                                                <label for="rating-checkbox-5"><i className="fa fa-solid fa-star"></i><i className="fa fa-solid fa-star"></i><i className="fa fa-solid fa-star"></i><i className="fa fa-solid fa-star"></i><i className="fa fa-solid fa-star"></i></label>
                                            </div>
                                            <div className="checkbox-cliker">
                                                <input type="checkbox" id="rating-checkbox-4" name="option2" value="option2" onChange={() => handleChangeQuery("ratings", 4)} />
                                                <label for="rating-checkbox-4"><i className="fa fa-solid fa-star"></i><i className="fa fa-solid fa-star"></i><i className="fa fa-solid fa-star"></i><i className="fa fa-solid fa-star"></i></label>
                                            </div>
                                            <div className="checkbox-cliker">
                                                <input type="checkbox" id="rating-checkbox-3" name="option1" value="option1" onChange={() => handleChangeQuery("ratings", 3)} />
                                                <label for="rating-checkbox-3"><i className="fa fa-solid fa-star"></i><i className="fa fa-solid fa-star"></i><i className="fa fa-solid fa-star"></i></label>
                                            </div>
                                            <div className="checkbox-cliker">
                                                <input type="checkbox" id="rating-checkbox-2" name="option2" value="option2" onChange={() => handleChangeQuery("ratings", 2)} />
                                                <label for="rating-checkbox-2"><i className="fa fa-solid fa-star"></i><i className="fa fa-solid fa-star"></i></label>
                                            </div>
                                            <div className="checkbox-cliker">
                                                <input type="checkbox" id="rating-checkbox-1" name="option1" value="option1" onChange={() => handleChangeQuery("ratings", 1)} />
                                                <label for="rating-checkbox-1"><i className="fa fa-solid fa-star"></i></label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-sm-12 col-md-8 col-lg-9 col-xl-9">
                            <div className="container">
                                <div className="row g-4">
                                    {products.map((product) => {
                                        return (
                                            <Product product={product} xl={4} lg={4} md={6} />
                                        )
                                    })}
                                </div>
                            </div>
                            <div className="d-flex justify-content-center mt-5">
                                <ReactPaginate
                                    breakLabel="..."
                                    nextLabel=">"
                                    onPageChange={(e) => fetchProducts(e.selected)}
                                    pageRangeDisplayed={documents}
                                    pageCount={pages}
                                    previousLabel="<"
                                    renderOnZeroPageCount={null}
                                    className="pagination"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <FirmVisit />
            <Testimonial />
        </>
    )
}