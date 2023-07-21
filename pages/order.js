import Banner from "@/components/user/Banner";
import { month } from "@/utils/month";
import { notifySuccess } from "@/utils/notify";
import { useEffect, useRef, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useReactToPrint } from 'react-to-print';
import Swal from "sweetalert2";

export default function Cart() {
    const [orders, setOrders] = useState([])
    const [showBillModal, setShowBillModal] = useState(false);
    const [billContent, setBillContent] = useState();
    const billRef = useRef();

    const getBillContent = (orderId) => {
        setBillContent(orders.find(order => order[0] === orderId));
    }

    const cancelOrder = async (orderId) => {
        const swalRes = Swal.fire({
            title: `Are you sure you want to cancel order ?`,
            icon: 'question',
            confirmButtonText: 'Yes',
            showCancelButton: true,
            cancelButtonText: 'No',
        })

        if ((await swalRes).isConfirmed) {
            const cancelOrdersResponse = await fetch(`${process.env.API_BASE_URL}/payment/refundpayment`, {
                method: 'POST',
                body: JSON.stringify({
                    orderId: orderId
                }),
                headers: {
                    "Content-Type": "application/json",
                }
            })

            const cancelOrdersData = await cancelOrdersResponse.json();

            if (cancelOrdersData.success) {
                notifySuccess(cancelOrdersData.message)
            }
        }
    }

    const handleDownloadBill = useReactToPrint({
        documentTitle: `${billContent && billContent[0]}`,
        content: () => billRef.current,
        onAfterPrint: () => {
            setShowBillModal(false);
        }
    });

    const fetchOrders = async () => {
        const ordersResponse = await fetch(`${process.env.API_BASE_URL}/order/getuserorders`, {
            method: 'GET'
        })

        const ordersData = await ordersResponse.json();

        if (ordersData.success) {
            setOrders(ordersData.data)
        }
    }

    useEffect(() => {
        fetchOrders();
    }, []);

    return (
        <>
            <Banner name={"Orders"} />
            <section className="h-100 h-custom">
                <div className="container h-100">
                    <h1>Orders</h1>
                    <section className="h-100 gradient-custom">
                        <div className="container py-4 h-100">
                            <div className="row d-flex justify-content-center align-items-center h-100">
                                <div className="p-0">
                                    <div className="card border-0">
                                        <div className="card-body p-0">
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
                                                                                <img src={`/user/images/dynamic/products/${idvsulOrder.orderInfo.images[0]}`} className="order-details-product-img" alt="Phone" />
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
                                                                <div className="pt-4 d-flex justify-content-end">
                                                                    <h5>Total amount: ₹{totalAmount}</h5>
                                                                </div>
                                                                <hr className="mb-4" />
                                                                {((order[1][0].status === 0 || order[1][0].status === 1 || order[1][0].status === 2) && order[1][0].payment !== 2) && (
                                                                    <>
                                                                        <div className="row d-flex align-items-center">
                                                                            <div className="col-md-12">
                                                                                <progress className="progress-bar" value={order[1][0].status + 1} min="0" max="4"></progress>
                                                                                <div className="d-flex justify-content-around mb-1">
                                                                                    <p className="text-muted mt-3">Ordered</p>
                                                                                    <p className="text-muted mt-3">Accepted</p>
                                                                                    <p className="text-muted mt-3">Shipped</p>
                                                                                    <p className="text-muted mt-3">Delivered</p>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="d-flex justify-content-center">
                                                                            <Button className="btn btn-danger" onClick={() => { cancelOrder(order[0]); }}>Cancel Order</Button>
                                                                        </div>
                                                                    </>
                                                                )}
                                                                <div className="d-flex justify-content-center">
                                                                    {(order[1][0].status === 3 && order[1][0].payment !== 2) && (
                                                                        <Button className="btn btn-success" onClick={() => { setShowBillModal(true); getBillContent(order[0]); }}>Download Bill</Button>
                                                                    )}
                                                                </div>
                                                                <div className="d-flex align-items-start">
                                                                    {(order[1][0].payment === 2) && (
                                                                        <div>
                                                                            <p className="text-muted small text-start">* This order is canceled by you. You will get refund payment in next 5 to 10 days.</p>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
                <Modal className="bill-modal" show={showBillModal} onHide={() => setShowBillModal(!showBillModal)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Download Bill</Modal.Title>
                    </Modal.Header>
                    <Modal.Body ref={billRef}>
                        {billContent && (
                            <div class="container">
                                <div class="row">
                                    <div class="col-lg-12">
                                        <div class="card">
                                            <div class="card-body">
                                                <div class="invoice-title">
                                                    <h4 class="float-end font-size-15">Invoice #{billContent[0]} <span class="badge bg-success font-size-12 ms-2">Paid</span></h4>
                                                    <div class="mb-4">
                                                        <h2 class="mb-1 text-muted">Foody.com</h2>
                                                    </div>
                                                    <div class="text-muted">
                                                        <p class="mb-1">3184 Surat Gujarat India, PA 15201</p>
                                                        <p class="mb-1"><i class="uil uil-envelope-alt me-1"></i>foodycustomercare@gmail.com</p>
                                                        <p><i class="uil uil-phone me-1"></i> 012-345-6789</p>
                                                    </div>
                                                </div>
                                                <hr class="my-4" />
                                                <div class="row">
                                                    <div class="col-sm-6">
                                                        <div class="text-muted">
                                                            <h5 class="font-size-16 mb-3">Billed To:</h5>
                                                            <h5 class="font-size-15 mb-2">{billContent[1][0].userInfo.firstName} {billContent[1][0].userInfo.lastName}</h5>
                                                            <p class="mb-1">{billContent[1][0].address}</p>
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
                        <Button variant="primary" onClick={() => handleDownloadBill()}>
                            Download PDF
                        </Button>
                    </Modal.Footer>
                </Modal>
            </section>
        </>
    )
}