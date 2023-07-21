import Banner from "@/components/user/Banner";
import { notifyError, notifySuccess } from "@/utils/notify";
import { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { Country, State, City } from 'country-state-city';
import Select from "react-select";
import { checkPincode, checkText } from "@/utils/validator";
import { useRouter } from "next/router";

export default function Cart() {
    const router = useRouter();
    const [cart, setCart] = useState([]);
    const [apiCallCheck, setApiCallCheck] = useState(false);
    const [subtotal, setSubtotal] = useState(0);
    const [orderModal, setOrderModal] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [selectedState, setSelectedState] = useState(null);
    const [selectedCity, setSelectedCity] = useState(null);
    const [order, setOrder] = useState({
        products: [],
        address: "Atlanta Mall, Mota Varachha, Surat, Gujarat.",
        pincode: 395004,
        country: "India",
        state: "Gujarat",
        city: "Surat"
    });

    const handleOrderDetails = (e) => {
        setOrder({
            ...order,
            [e.target.name]: e.target.value
        })
    }

    const checkAllFieldsValidation = () => {
        const fields = {
            address: checkText("Address", order.address, 2, 200, false),
            pincode: checkPincode(order.pincode),
            country: checkText("Country", order.country, 2, 200, false),
            state: checkText("State", order.state, 2, 200, false),
            city: checkText("City", order.city, 2, 200, false),
        }

        for (const field in fields) {
            if (fields[field].error) {
                notifyError(fields[field].message);
                return true;
            }
        }

        return false;
    }

    const handleCheckOutOrder = async () => {
        if (checkAllFieldsValidation()) {
            return
        }

        const orderResponse = await fetch(`${process.env.API_BASE_URL}/order/create`, {
            method: 'POST',
            body: JSON.stringify({
                order
            }),
            headers: {
                "Content-Type": "application/json",
            }
        });

        const orderData = await orderResponse.json();

        if (orderData.success) {
            const checkoutSessionResponse = await fetch(`${process.env.API_BASE_URL}/payment/checkoutsessions`, {
                method: "POST",
                body: JSON.stringify({
                    amount: orderData.data.amount,
                    orderId: orderData.data.orderId
                }),
                headers: {
                    "Content-Type": "application/json",
                }
            })

            const checkoutSessionData = await checkoutSessionResponse.json();

            router.push(checkoutSessionData.data.url)
        }
    }

    const editItemInCart = async (productId, quantity, type) => {
        if (quantity === 0 && type === 0) {
            return;
        }

        const cartResponse = await fetch(`${process.env.API_BASE_URL}/cart/addtocart`, {
            method: 'POST',
            body: JSON.stringify({
                quantity: quantity,
                productId: productId,
                status: 1
            }),
            headers: {
                "Content-Type": "application/json",
            }
        })

        const cartData = await cartResponse.json();

        if (cartData.success) {
            notifySuccess(cartData.message)
            setApiCallCheck(!apiCallCheck)
        } else {
            notifyError(cartData.message)
        }
    }

    const deleteItemInCart = async (productId) => {
        const cartResponse = await fetch(`${process.env.API_BASE_URL}/cart/addtocart`, {
            method: 'POST',
            body: JSON.stringify({
                productId: productId,
                status: 0
            }),
            headers: {
                "Content-Type": "application/json",
            }
        })

        const cartData = await cartResponse.json();

        if (cartData.success) {
            notifySuccess(cartData.message)
            setApiCallCheck(!apiCallCheck)
        } else {
            notifyError(cartData.message)
        }
    }

    const fetchCart = async () => {
        const cartResponse = await fetch(`${process.env.API_BASE_URL}/cart/getcart`, {
            method: 'GET'
        })

        const cartData = await cartResponse.json();

        if (cartData.success) {
            setCart(cartData.data.cart)
            setSubtotal(cartData.data.subtotal)
        }
    }

    useEffect(() => {
        setOrder({
            ...order,
            products: cart.map(c => ({ id: c.productId, price: c.price, quantity: c.quantity }))
        })
    }, [cart]);

    useEffect(() => {
        fetchCart()
    }, [apiCallCheck]);

    useEffect(() => {
        if (selectedCountry) {
            setOrder({
                ...order,
                country: selectedCountry.name
            })

            if (selectedState) {
                setOrder({
                    ...order,
                    state: selectedState.name
                })

                if (selectedCity) {
                    setOrder({
                        ...order,
                        city: selectedCity.name
                    })
                }
            }
        }
    }, [selectedCountry, selectedState, selectedCity]);

    return (
        <>
            <Banner name={"Cart"} />
            <section className="h-100 h-custom">
                <div className="container py-5 h-100">
                    <div className="row d-flex justify-content-center align-items-center h-100">
                        <div className="col-12">
                            <div className="card card-registration card-registration-2">
                                <div className="card-body p-0">
                                    <div className="row g-0">
                                        <div className="col-lg-12">
                                            <div className="p-5">
                                                <div className="d-flex justify-content-between align-items-center mb-5">
                                                    <h1 className="fw-bold mb-0 text-black">Cart</h1>
                                                    <h6 className="mb-0 text-muted">{cart.length} items</h6>
                                                </div>
                                                {cart.length > 0 && (
                                                    <>
                                                        <hr className="my-4" />
                                                        {cart.map((item) => {
                                                            return (
                                                                <div className="row d-flex justify-content-between align-items-center">
                                                                    <div className="col-md-2 col-lg-2 col-xl-2">
                                                                        <img
                                                                            src={`/user/images/dynamic/products/${item.images[0]}`}
                                                                            className="img-fluid rounded-3" alt="Cotton T-shirt" />
                                                                    </div>
                                                                    <div className="col-md-3 col-lg-3 col-xl-3">
                                                                        <h6 className="text-muted my-3">{item.company} - {item.category}</h6>
                                                                        <h6 className="h4 text-black my-3">{item.name}</h6>
                                                                    </div>
                                                                    <div className="col-md-3 col-lg-3 col-xl-2 d-flex">
                                                                        <div className="input-group mb-1">
                                                                            <button className="btn btn-white border border-secondary px-3" onClick={() => editItemInCart(item.productId, item.quantity - 1, 0)} type="button" id="button-addon1" data-mdb-ripple-color="dark">
                                                                                <i className="fas fa-minus"></i>
                                                                            </button>
                                                                            <input type="text" value={item.quantity} className="form-control text-center border border-secondary" placeholder="14" aria-label="Example text with button addon" aria-describedby="button-addon1" />
                                                                            <button className="btn btn-white border border-secondary px-3" onClick={() => editItemInCart(item.productId, item.quantity + 1, 1)} type="button" id="button-addon2" data-mdb-ripple-color="dark">
                                                                                <i className="fas fa-plus"></i>
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-md-3 col-lg-2 col-xl-2 offset-lg-1">
                                                                        <h6 className="my-3">{item.quantity} x ₹{item.price} = {item.quantity * item.price}</h6>
                                                                    </div>
                                                                    <div className="col-md-1 col-lg-1 col-xl-1 text-end">
                                                                        <button className="rounded-circle action-button btn btn-danger" onClick={() => deleteItemInCart(item.productId)}><i className="fas fa-times"></i></button>
                                                                    </div>
                                                                    <hr className="mt-3" />
                                                                </div>
                                                            )
                                                        })}
                                                    </>
                                                )}
                                                {cart.length === 0 && (
                                                    <>
                                                        <h1 className="text-center">Your cart is empty.</h1>
                                                    </>
                                                )}
                                            </div>
                                            {cart.length > 0 && (
                                                <div className="m-5 mt-0 d-flex justify-content-between align-items-center flex-wrap">
                                                    <h3 className="m-0">Subtotal ₹{subtotal}</h3>
                                                    <button onClick={() => setOrderModal(true)} className="btn btn-primary px-3 py-2">Checkout</button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Modal show={orderModal} onHide={() => setOrderModal(!orderModal)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Create Order</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Products</Form.Label>
                            {cart?.map((product) => {
                                return (
                                    <div className="d-flex mb-2">
                                        <img src={`/user/images/dynamic/products/${product.images[0]}`} width={60} height={60} alt="" />
                                        <h5 className="my-3">{product.name} {product.quantity} x ₹{product.price} = {product.quantity * product.price}</h5>
                                    </div>
                                )
                            })}
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Address</Form.Label>
                            <Form.Control type="text" placeholder="Enter address" name="address" value={order.address} onChange={(e) => handleOrderDetails(e)} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Pincode</Form.Label>
                            <Form.Control type="text" placeholder="Enter pincode" name="pincode" value={order.pincode} onChange={(e) => handleOrderDetails(e)} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Country</Form.Label>
                            <div>
                                <Select
                                    options={Country.getAllCountries()}
                                    getOptionLabel={(options) => {
                                        return options["flag"] + ' ' + options["name"];
                                    }}
                                    getOptionValue={(options) => {
                                        return options["name"];
                                    }}
                                    value={selectedCountry}
                                    onChange={(item) => {
                                        setSelectedCountry(item)
                                    }}
                                    placeholder="Select country"
                                />
                            </div>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>State</Form.Label>
                            <div>
                                <Select
                                    options={State?.getStatesOfCountry(selectedCountry?.isoCode)}
                                    getOptionLabel={(options) => {
                                        return options["name"];
                                    }}
                                    getOptionValue={(options) => {
                                        return options["name"];
                                    }}
                                    value={selectedState}
                                    onChange={(item) => {
                                        setSelectedState(item)
                                    }}
                                    placeholder="Select state"
                                />
                            </div>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>City</Form.Label>
                            <div>
                                <Select
                                    options={City.getCitiesOfState(selectedCountry?.isoCode, selectedState?.isoCode)}
                                    getOptionLabel={(options) => {
                                        return options["name"];
                                    }}
                                    getOptionValue={(options) => {
                                        return options["name"];
                                    }}
                                    value={selectedCity}
                                    onChange={(item) => {
                                        setSelectedCity(item)
                                    }}
                                    placeholder="Select city"
                                />
                            </div>
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setOrderModal(false)}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={() => handleCheckOutOrder()}>
                            Pay ₹{subtotal}
                        </Button>
                    </Modal.Footer>
                </Modal>
            </section>
        </>
    )
}