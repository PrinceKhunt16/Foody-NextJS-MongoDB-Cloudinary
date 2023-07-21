import { month } from "@/utils/month";
import { notifySuccess } from "@/utils/notify";
import { useEffect, useRef } from "react";
import { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useReactToPrint } from "react-to-print";
import Swal from "sweetalert2";

export default function Orders() {
    const [current, setCurrent] = useState(0);
    const [orders, setOrders] = useState([]);
    const [showBillModal, setShowBillModal] = useState(false);
    const [billContent, setBillContent] = useState();
    const billRef = useRef();

    const getBillContent = (orderId) => {
        setBillContent(orders.find(order => order[0] === orderId));
    }

    const handleDownloadLabel = useReactToPrint({
        documentTitle: `${billContent && billContent[0]}`,
        content: () => billRef.current,
        onAfterPrint: () => {
            setShowBillModal(false);
        }
    });

    const changeStatus = async (orderId, status) => {
        const swalRes = Swal.fire({
            title: `Are you sure you want to change order status ?`,
            icon: 'question',
            confirmButtonText: 'Yes',
            showCancelButton: true,
            cancelButtonText: 'No',
        })

        if ((await swalRes).isConfirmed) {
            const ordersResponse = await fetch(`${process.env.API_BASE_URL}/admin/orders/changestatus`, {
                method: 'PATCH',
                body: JSON.stringify({
                    orderId: orderId,
                    status: status
                }),
                headers: {
                    "Content-Type": "application/json",
                }
            })

            if (ordersResponse.status) {
                fetchCurrentTab(current);
                notifySuccess(`Order ${orderId} has been updated.`);
            }
        }
    }

    const fetchCurrentTab = async (tab) => {
        const ordersResponse = await fetch(`${process.env.API_BASE_URL}/admin/orders/ordersfilter`, {
            method: 'POST',
            body: JSON.stringify({
                status: tab
            }),
            headers: {
                "Content-Type": "application/json",
            }
        })

        const ordersData = await ordersResponse.json();

        setOrders(ordersData.data);
    }

    useEffect(() => {
        if (current === 0) {
            fetchCurrentTab(0);
        }
    }, [current]);

    useEffect(() => {
        if (current === 1) {
            fetchCurrentTab(1);
        }
    }, [current]);

    useEffect(() => {
        if (current === 2) {
            fetchCurrentTab(2);
        }
    }, [current]);

    useEffect(() => {
        if (current === 3) {
            fetchCurrentTab(3);
        }
    }, [current]);

    useEffect(() => {
        if (current === 4) {
            fetchCurrentTab(4);
        }
    }, [current]);

    useEffect(() => {
        if (current === 5) {
            fetchCurrentTab(5);
        }
    }, [current]);


    return (
        <div className="container">
            <div className="mt-4">
                <h1>Orders</h1>
                <ul class="nav nav-tabs">
                    <li class="nav-item">
                        <a class={`nav-link ${current === 0 ? "active text-dark" : "text-muted"}`} aria-current="page" href="#" onClick={() => setCurrent(0)}>Ordered</a>
                    </li>
                    <li class="nav-item">
                        <a class={`nav-link ${current === 1 ? "active text-dark" : "text-muted"}`} aria-current="page" href="#" onClick={() => setCurrent(1)}>Accepted</a>
                    </li>
                    <li class="nav-item">
                        <a class={`nav-link ${current === 2 ? "active text-dark" : "text-muted"}`} aria-current="page" href="#" onClick={() => setCurrent(2)}>Shipped</a>
                    </li>
                    <li class="nav-item">
                        <a class={`nav-link ${current === 3 ? "active text-dark" : "text-muted"}`} aria-current="page" href="#" onClick={() => setCurrent(3)}>Delivered</a>
                    </li>
                    <li class="nav-item">
                        <a class={`nav-link ${current === 4 ? "active text-dark" : "text-muted"}`} aria-current="page" href="#" onClick={() => setCurrent(4)}>Canceled</a>
                    </li>
                    <li class="nav-item">
                        <a class={`nav-link ${current === 5 ? "active text-dark" : "text-muted"}`} aria-current="page" href="#" onClick={() => setCurrent(5)}>Refunded</a>
                    </li>
                </ul>
                <div>
                    {orders?.map((order) => {
                        const createdOnDate = new Date(order[1][0].createdOn)
                        const totalAmount = order[1].reduce((acc, item) => acc + item.products.price * item.products.quantity, 0);
                        return (
                            <>
                                <div className="card shadow-0 border my-2" key={order[0]}>
                                    <div className="card-body">
                                        <div className="py-2 d-flex justify-content-between">
                                            <h4>Order id: {order[0]}</h4>
                                            <h6>{createdOnDate.getDate() + "th " + month[createdOnDate.getMonth()] + ", " + createdOnDate.getFullYear()}</h6>
                                        </div>
                                        <div className="row mb-3">
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
                                                <div className="row border p-2">
                                                    <div className="col-2 d-flex align-items-center">
                                                        <img src={`/user/images/dynamic/products/${idvsulOrder.orderInfo.images[0]}`} width={100} height={100} className="order-details-product-img" alt="" />
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
                                        <div className="pt-4 d-flex justify-content-between">
                                            <h5>Total amount: ₹{totalAmount}</h5>
                                            <div className="d-flex gap-2">
                                                {(current === 0 || current === 1) && (
                                                    <Button variant="success" onClick={() => changeStatus(order[0], current)}>{current === 0 && "Accept" || current === 1 && "Ship"} Order</Button>
                                                )}
                                                {(current === 0 || current === 1) && (
                                                    <Button variant="warning" onClick={() => { setShowBillModal(true); getBillContent(order[0]); }}>Download Label</Button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )
                    })}
                </div>
            </div>
            <Modal className="bill-modal" show={showBillModal} onHide={() => setShowBillModal(!showBillModal)}>
                <Modal.Header closeButton>
                    <Modal.Title>Download Label</Modal.Title>
                </Modal.Header>
                <Modal.Body ref={billRef}>
                    {billContent && (
                        <div class="container">
                            <div class="row">
                                <div class="col-lg-12">
                                    <div class="card">
                                        <div class="card-body">
                                            <div class="invoice-title">
                                                <h4 class="float-end font-size-15">Invoice #{billContent[0]}</h4>
                                                <div class="mb-4">
                                                    <h2 class="mb-1 text-muted">Foody.com</h2>
                                                </div>
                                            </div>
                                            <hr class="my-4" />
                                            <div class="row">
                                                <div class="col-sm-6">
                                                    <div class="text-muted">
                                                        <h5 class="font-size-16 mb-3">To:</h5>
                                                        <h5 class="font-size-15 mb-2">{billContent[1][0].userInfo.firstName} {billContent[1][0].userInfo.lastName}</h5>
                                                        <p class="mb-1">{billContent[1][0].address}</p>
                                                        <p class="mb-1">{billContent[1][0].pincode}</p>
                                                        <p class="mb-1">{billContent[1][0].userInfo.email}</p>
                                                    </div>
                                                </div>
                                                <div class="col-sm-6">
                                                    <div class="text-muted text-sm-end">
                                                        <div>
                                                            <h5 class="font-size-15 mb-1">Invoice No:</h5>
                                                            <p>#{billContent[0]}</p>
                                                        </div>
                                                        <div class="mt-4">
                                                            <h5 class="font-size-15 mb-1">Order No:</h5>
                                                            <p>#{billContent[0]}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="py-2">
                                                <h5 class="font-size-15">Order Summary</h5>
                                                <div class="table-responsive">
                                                    <table class="table align-middle table-nowrap table-centered mb-0">
                                                        <thead>
                                                            <tr>
                                                                <th>No.</th>
                                                                <th>Item</th>
                                                                <th>Price</th>
                                                                <th>Quantity</th>
                                                                <th class="text-end">Total</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {billContent[1].map((order, index) => {
                                                                return (
                                                                    <tr>
                                                                        <th scope="row">{index + 1}</th>
                                                                        <td>
                                                                            <div>
                                                                                <h5 class="text-truncate font-size-14 mb-1">{order.orderInfo.name}</h5>
                                                                            </div>
                                                                        </td>
                                                                        <td>₹{order.products.price}</td>
                                                                        <td>{order.products.quantity}</td>
                                                                        <td class="text-end">₹{order.products.price * order.products.quantity}</td>
                                                                    </tr>
                                                                )
                                                            })}
                                                            <tr>
                                                                <th scope="row" colSpan="4" class="text-end">Sub Total</th>
                                                                <td class="text-end">₹{billContent[1].reduce((acc, item) => acc + item.products.price * item.products.quantity, 0)}</td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowBillModal(false)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={() => handleDownloadLabel()}>
                        Download PDF
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}