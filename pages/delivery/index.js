import { month } from "@/utils/month";
import { notifyError, notifySuccess } from "@/utils/notify";
import { useState } from "react";
import { Button } from "react-bootstrap";

export default function Delivery() {
    const [email, setEmail] = useState('')
    const [orderId, setOrderId] = useState(null)
    const [otp, setOTP] = useState(null)
    const [orders, setOrders] = useState([])
    const [emailSend, setEmailSend] = useState(false);

    const copyOrderID = (orderId) => {
        navigator.clipboard.writeText(orderId)
        notifySuccess("Copied order id.")
    }

    const getUsersShippedOrder = async () => {
        const ordersResponse = await fetch(`${process.env.API_BASE_URL}/delivery/orders/getshippedorders`, {
            method: 'POST',
            body: JSON.stringify({
                email: email
            }),
            headers: {
                "Content-Type": "application/json",
            }
        })

        const ordersData = await ordersResponse.json();

        setOrders(ordersData.data);
        setEmailSend(true)
    }

    const sendOTP = async () => {
        const ordersResponse = await fetch(`${process.env.API_BASE_URL}/delivery/orders/sendotp`, {
            method: 'PATCH',
            body: JSON.stringify({
                email: email,
                orderId: orderId
            }),
            headers: {
                "Content-Type": "application/json",
            }
        })

        const ordersData = await ordersResponse.json();

        if (ordersData.success) {
            notifySuccess(ordersData.message)
            getUsersShippedOrder()
        }
    }

    const orderDeliver = async () => {
        const ordersResponse = await fetch(`${process.env.API_BASE_URL}/delivery/orders/orderdeliver`, {
            method: 'PATCH',
            body: JSON.stringify({
                orderId: orderId,
                otp: otp
            }),
            headers: {
                "Content-Type": "application/json",
            }
        })

        const ordersData = await ordersResponse.json();

        if (ordersData.success) {
            notifySuccess(ordersData.message)
            setEmailSend(false)
            getUsersShippedOrder()
        } else {
            notifyError(ordersData.message)
        }
    }

    return (
        <div className="container my-2">
            <div className="row">
                <div className="col-sm-12 col-md-10 col-lg-8 col-xl-6 m-auto">
                    <div className="my-2">
                        <form className="d-flex w-100 row">
                            <div className="col-9">
                                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter email" class="form-control w-100" id="exampleInputEmail1" aria-describedby="emailHelp" />
                            </div>
                            <Button className="btn btn-success col-3" onClick={() => getUsersShippedOrder()}>Get Orders</Button>
                        </form>
                    </div>
                    <div className="my-2">
                        <form className="d-flex w-100 row">
                            <div className="col-9">
                                <input type="number" value={orderId} onChange={(e) => setOrderId(e.target.value)} placeholder="Enter order id" class="form-control w-100" id="exampleInputEmail1" aria-describedby="emailHelp" />
                            </div>
                            <Button className="btn btn-success col-3" onClick={() => sendOTP()}>Send OTP</Button>
                        </form>
                    </div>
                    <div className="my-2">
                        <form className="d-flex w-100 row">
                            <div className="col-9">
                                <input type="number" value={otp} onChange={(e) => setOTP(e.target.value)} placeholder="Enter otp" class="form-control w-100" id="exampleInputEmail1" aria-describedby="emailHelp" />
                            </div>
                            <Button className="btn btn-success col-3" onClick={() => orderDeliver()}>Deliver</Button>
                        </form>
                    </div>
                    <div className="my-3 row gap-3">
                        {orders && emailSend && orders.length === 0 && (
                            <div>
                                <h1>No more orders are shipped.</h1>
                            </div>
                        )}
                        {orders && orders.map((order) => {
                            const createdOnDate = new Date(order[1][0].createdOn)
                            const totalAmount = order[1].reduce((acc, item) => acc + item.products.price * item.products.quantity, 0);
                            return (
                                <div className="col-12 border p-2 ">
                                    <div className="d-flex justify-content-between">
                                        <h5 className="m-0">Order ID: {order[0]}</h5>
                                        <Button className="btn btn-success" onClick={() => copyOrderID(order[0])}>Copy</Button>
                                    </div>
                                    <div className="row my-2">
                                        <div className="col-2 d-flex align-items-center">
                                            <p className="text-muted mb-0 small">Image</p>
                                        </div>
                                        <div className="col-2 d-flex align-items-center">
                                            <p className="text-muted mb-0 small">Name</p>
                                        </div>
                                        <div className="col-2 d-flex align-items-center">
                                            <p className="text-muted mb-0 small">Company</p>
                                        </div>
                                        <div className="col-2 d-flex align-items-center">
                                            <p className="text-muted mb-0 small">Price</p>
                                        </div>
                                        <div className="col-2 d-flex align-items-center">
                                            <p className="text-muted mb-0 small">Quantity</p>
                                        </div>
                                        <div className="col-2 d-flex align-items-center">
                                            <p className="text-muted mb-0 small">Total</p>
                                        </div>
                                    </div>
                                    {order[1].map((idvsulOrder) => {
                                        return (
                                            <div className="row p-2">
                                                <div className="col-2 d-flex align-items-center">
                                                    <img src={`/user/images/dynamic/products/${idvsulOrder.orderInfo.images[0]}`} width={60} height={60} className="order-details-product-img" alt="Phone" />
                                                </div>
                                                <div className="col-2 d-flex align-items-center">
                                                    <p className="text-muted mb-0 small">{idvsulOrder.orderInfo.name}</p>
                                                </div>
                                                <div className="col-2 d-flex align-items-center">
                                                    <p className="text-muted mb-0 small">{idvsulOrder.orderInfo.company}</p>
                                                </div>
                                                <div className="col-2 d-flex align-items-center">
                                                    <p className="text-muted mb-0 small">₹{idvsulOrder.products.price}</p>
                                                </div>
                                                <div className="col-2 d-flex align-items-center">
                                                    <p className="text-muted mb-0 small">{idvsulOrder.products.quantity}</p>
                                                </div>
                                                <div className="col-2 d-flex align-items-center">
                                                    <p className="text-muted mb-0 small">₹{idvsulOrder.products.price * idvsulOrder.products.quantity}</p>
                                                </div>
                                            </div>
                                        )
                                    })}
                                    <h6 className="d-flex justify-content-end">{createdOnDate.getDate() + "th " + month[createdOnDate.getMonth()] + ", " + createdOnDate.getFullYear()}</h6>
                                    <h5 className="d-flex justify-content-end">Total amount: ₹{totalAmount}</h5>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}