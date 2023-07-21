import { useEffect, useState } from "react"

export default function Dashboard() {
    const [revenue, setRevenue] = useState({})
    const [products, setProducts] = useState({})
    const [orders, setOrders] = useState({})
    const [users, setUsers] = useState({})

    const fetchRevenue = async () => {
        const revenueResponse = await fetch(`${process.env.API_BASE_URL}/admin/dashboard/revenue`, {
            method: "GET"
        });

        const revenueData = await revenueResponse.json();

        setRevenue(revenueData.data);
    }

    const fetchProducts = async () => {
        const productsResponse = await fetch(`${process.env.API_BASE_URL}/admin/dashboard/products`, {
            method: "GET"
        });

        const productsData = await productsResponse.json();

        setProducts(productsData.data);
    }

    const fetchOrders = async () => {
        const ordersResponse = await fetch(`${process.env.API_BASE_URL}/admin/dashboard/orders`, {
            method: "GET"
        });

        const ordersData = await ordersResponse.json();

        setOrders(ordersData.data);
    }

    const fetchUsers = async () => {
        const usersResponse = await fetch(`${process.env.API_BASE_URL}/admin/dashboard/users`, {
            method: "GET"
        });

        const usersData = await usersResponse.json();

        setUsers(usersData.data);
    }

    useEffect(() => {
        fetchRevenue();
        fetchProducts();
        fetchOrders();
        fetchUsers();
    }, []);

    return (
        <div className="container mt-3">
            <h1>Dashboard</h1>
            <div className="my-4">
                <h3 className="side-line">Revenue</h3>
                <div className="row mt-3">
                    <div className="col-md-3 col-sm-6 col-6">
                        <div className="admin-small-card admin-card-color-1 py-3 m-2 mx-1 d-flex flex-column align-items-center justify-content-center rounded">
                            <span>
                                <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-sort-descending" width="30" height="30" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                    <path d="M4 6l9 0"></path>
                                    <path d="M4 12l7 0"></path>
                                    <path d="M4 18l7 0"></path>
                                    <path d="M15 15l3 3l3 -3"></path>
                                    <path d="M18 6l0 12"></path>
                                </svg>
                            </span>
                            <h4 className="text-center mt-2">Ordered</h4>
                            <h4 className="text-center">₹{revenue.ordered}</h4>
                        </div>
                    </div>
                    <div className="col-md-3 col-sm-6 col-6">
                        <div className="admin-small-card admin-card-color-1 py-3 m-2 mx-1 d-flex flex-column align-items-center justify-content-center rounded">
                            <span>
                                <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-circle-check" width="30" height="30" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                    <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"></path>
                                    <path d="M9 12l2 2l4 -4"></path>
                                </svg>
                            </span>
                            <h4 className="text-center mt-2">Accepted</h4>
                            <h4 className="text-center">₹{revenue.accepted}</h4>
                        </div>
                    </div>
                    <div className="col-md-3 col-sm-6 col-6">
                        <div className="admin-small-card admin-card-color-1 py-3 m-2 mx-1 d-flex flex-column align-items-center justify-content-center rounded">
                            <span>
                                <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-cube-send" width="30" height="30" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                    <path d="M16 12.5l-5 -3l5 -3l5 3v5.5l-5 3z"></path>
                                    <path d="M11 9.5v5.5l5 3"></path>
                                    <path d="M16 12.545l5 -3.03"></path>
                                    <path d="M7 9h-5"></path>
                                    <path d="M7 12h-3"></path>
                                    <path d="M7 15h-1"></path>
                                </svg>
                            </span>
                            <h4 className="text-center mt-2">Shipped</h4>
                            <h4 className="text-center">₹{revenue.shipped}</h4>
                        </div>
                    </div>
                    <div className="col-md-3 col-sm-6 col-6">
                        <div className="admin-small-card admin-card-color-1 py-3 m-2 mx-1 d-flex flex-column align-items-center justify-content-center rounded">
                            <span>
                                <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-truck-delivery" width="30" height="30" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                    <path d="M7 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path>
                                    <path d="M17 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path>
                                    <path d="M5 17h-2v-4m-1 -8h11v12m-4 0h6m4 0h2v-6h-8m0 -5h5l3 5"></path>
                                    <path d="M3 9l4 0"></path>
                                </svg>
                            </span>
                            <h4 className="text-center mt-2">Delivered</h4>
                            <h4 className="text-center">₹{revenue.delivered}</h4>
                        </div>
                    </div>
                    <div className="col-md-3 col-sm-6 col-6">
                        <div className="admin-small-card admin-card-color-1 py-3 m-2 mx-1 d-flex flex-column align-items-center justify-content-center rounded">
                            <span>
                                <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-report-money" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                    <path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2"></path>
                                    <path d="M9 3m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z"></path>
                                    <path d="M14 11h-2.5a1.5 1.5 0 0 0 0 3h1a1.5 1.5 0 0 1 0 3h-2.5"></path>
                                    <path d="M12 17v1m0 -8v1"></path>
                                </svg>
                            </span>
                            <h4 className="text-center mt-2">Estimeted</h4>
                            <h4 className="text-center">₹{revenue.estimated}</h4>
                        </div>
                    </div>
                </div>
            </div>
            <div className="my-4">
                <h3 className="side-line">Products</h3>
                <div className="row mt-3">
                    <div className="col-md-3 col-sm-6 col-6">
                        <div className="admin-small-card admin-card-color-2 py-3 m-2 mx-1 d-flex flex-column align-items-center justify-content-center rounded">
                            <span>
                                <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-arrows-down-up" width="30" height="30" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                    <path d="M17 3l0 18"></path>
                                    <path d="M10 18l-3 3l-3 -3"></path>
                                    <path d="M7 21l0 -18"></path>
                                    <path d="M20 6l-3 -3l-3 3"></path>
                                </svg>
                            </span>
                            <h4 className="text-center mt-2">Total</h4>
                            <h4 className="text-center">{products.total}</h4>
                        </div>
                    </div>
                    <div className="col-md-3 col-sm-6 col-6">
                        <div className="admin-small-card admin-card-color-2 py-3 m-2 mx-1 d-flex flex-column align-items-center justify-content-center rounded">
                            <span>
                                <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-arrow-narrow-up" width="30" height="30" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                    <path d="M12 5l0 14"></path>
                                    <path d="M16 9l-4 -4"></path>
                                    <path d="M8 9l4 -4"></path>
                                </svg>
                            </span>
                            <h4 className="text-center mt-2">In Stock</h4>
                            <h4 className="text-center">{products.inStock}</h4>
                        </div>
                    </div>
                    <div className="col-md-3 col-sm-6 col-6">
                        <div className="admin-small-card admin-card-color-2 py-3 m-2 mx-1 d-flex flex-column align-items-center justify-content-center rounded">
                            <span>
                                <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-arrow-narrow-down" width="30" height="30" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                    <path d="M12 5l0 14"></path>
                                    <path d="M16 15l-4 4"></path>
                                    <path d="M8 15l4 4"></path>
                                </svg>
                            </span>
                            <h4 className="text-center mt-2">Out Of Stock</h4>
                            <h4 className="text-center">{products.outOfStock}</h4>
                        </div>
                    </div>
                </div>
            </div>
            <div className="my-4">
                <h3 className="side-line">Orders</h3>
                <div className="row mt-3">
                    <div className="col-md-3 col-sm-6 col-6">
                        <div className="admin-small-card admin-card-color-3 py-3 m-2 mx-1 d-flex flex-column align-items-center justify-content-center rounded">
                            <span>
                                <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-border-all" width="30" height="30" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                    <path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z"></path>
                                    <path d="M4 12l16 0"></path>
                                    <path d="M12 4l0 16"></path>
                                </svg>
                            </span>
                            <h4 className="text-center mt-2">Total</h4>
                            <h4 className="text-center">{orders.total}</h4>
                        </div>
                    </div>
                    <div className="col-md-3 col-sm-6 col-6">
                        <div className="admin-small-card admin-card-color-3 py-3 m-2 mx-1 d-flex flex-column align-items-center justify-content-center rounded">
                            <span>
                                <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-sort-descending" width="30" height="30" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                    <path d="M4 6l9 0"></path>
                                    <path d="M4 12l7 0"></path>
                                    <path d="M4 18l7 0"></path>
                                    <path d="M15 15l3 3l3 -3"></path>
                                    <path d="M18 6l0 12"></path>
                                </svg>
                            </span>
                            <h4 className="text-center mt-2">Ordered</h4>
                            <h4 className="text-center">{orders.ordered}</h4>
                        </div>
                    </div>
                    <div className="col-md-3 col-sm-6 col-6">
                        <div className="admin-small-card admin-card-color-3 py-3 m-2 mx-1 d-flex flex-column align-items-center justify-content-center rounded">
                            <span>
                                <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-circle-check" width="30" height="30" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                    <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"></path>
                                    <path d="M9 12l2 2l4 -4"></path>
                                </svg>
                            </span>
                            <h4 className="text-center mt-2">Accepted</h4>
                            <h4 className="text-center">{orders.accepted}</h4>
                        </div>
                    </div>
                    <div className="col-md-3 col-sm-6 col-6">
                        <div className="admin-small-card admin-card-color-3 py-3 m-2 mx-1 d-flex flex-column align-items-center justify-content-center rounded">
                            <span>
                                <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-cube-send" width="30" height="30" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                    <path d="M16 12.5l-5 -3l5 -3l5 3v5.5l-5 3z"></path>
                                    <path d="M11 9.5v5.5l5 3"></path>
                                    <path d="M16 12.545l5 -3.03"></path>
                                    <path d="M7 9h-5"></path>
                                    <path d="M7 12h-3"></path>
                                    <path d="M7 15h-1"></path>
                                </svg>
                            </span>
                            <h4 className="text-center mt-2">Shipped</h4>
                            <h4 className="text-center">{orders.shipped}</h4>
                        </div>
                    </div>
                    <div className="col-md-3 col-sm-6 col-6">
                        <div className="admin-small-card admin-card-color-3 py-3 m-2 mx-1 d-flex flex-column align-items-center justify-content-center rounded">
                            <span>
                                <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-truck-delivery" width="30" height="30" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                    <path d="M7 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path>
                                    <path d="M17 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path>
                                    <path d="M5 17h-2v-4m-1 -8h11v12m-4 0h6m4 0h2v-6h-8m0 -5h5l3 5"></path>
                                    <path d="M3 9l4 0"></path>
                                </svg>
                            </span>
                            <h4 className="text-center mt-2">Delivered</h4>
                            <h4 className="text-center">{orders.delivered}</h4>
                        </div>
                    </div>
                    <div className="col-md-3 col-sm-6 col-6">
                        <div className="admin-small-card admin-card-color-3 py-3 m-2 mx-1 d-flex flex-column align-items-center justify-content-center rounded">
                            <span>
                                <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-truck-delivery" width="30" height="30" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                    <path d="M7 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path>
                                    <path d="M17 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path>
                                    <path d="M5 17h-2v-4m-1 -8h11v12m-4 0h6m4 0h2v-6h-8m0 -5h5l3 5"></path>
                                    <path d="M3 9l4 0"></path>
                                </svg>
                            </span>
                            <h4 className="text-center mt-2">Canceled</h4>
                            <h4 className="text-center">{orders.canceled}</h4>
                        </div>
                    </div>
                    <div className="col-md-3 col-sm-6 col-6">
                        <div className="admin-small-card admin-card-color-3 py-3 m-2 mx-1 d-flex flex-column align-items-center justify-content-center rounded">
                            <span>
                                <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-truck-delivery" width="30" height="30" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                    <path d="M7 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path>
                                    <path d="M17 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path>
                                    <path d="M5 17h-2v-4m-1 -8h11v12m-4 0h6m4 0h2v-6h-8m0 -5h5l3 5"></path>
                                    <path d="M3 9l4 0"></path>
                                </svg>
                            </span>
                            <h4 className="text-center mt-2">Refunded</h4>
                            <h4 className="text-center">{orders.refunded}</h4>
                        </div>
                    </div>
                </div>
            </div>
            <div className="my-4">
                <h3 className="side-line">Users</h3>
                <div className="row mt-3">
                    <div className="col-md-3 col-sm-6 col-6">
                        <div className="admin-small-card admin-card-color-4 py-3 m-2 mx-1 d-flex flex-column align-items-center justify-content-center rounded">
                            <span>
                                <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-border-all" width="30" height="30" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                    <path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z"></path>
                                    <path d="M4 12l16 0"></path>
                                    <path d="M12 4l0 16"></path>
                                </svg>
                            </span>
                            <h4 className="text-center mt-2">Total</h4>
                            <h4 className="text-center">{users.total}</h4>
                        </div>
                    </div>
                    <div className="col-md-3 col-sm-6 col-6">
                        <div className="admin-small-card admin-card-color-4 py-3 m-2 mx-1 d-flex flex-column align-items-center justify-content-center rounded">
                            <span>
                                <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-users" width="30" height="30" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                    <path d="M9 7m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0"></path>
                                    <path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2"></path>
                                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                    <path d="M21 21v-2a4 4 0 0 0 -3 -3.85"></path>
                                </svg>
                            </span>
                            <h4 className="text-center mt-2">User</h4>
                            <h4 className="text-center">{users.users}</h4>
                        </div>
                    </div>
                    <div className="col-md-3 col-sm-6 col-6">
                        <div className="admin-small-card admin-card-color-4 py-3 m-2 mx-1 d-flex flex-column align-items-center justify-content-center rounded">
                            <span>
                                <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-user-shield" width="30" height="30" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                    <path d="M6 21v-2a4 4 0 0 1 4 -4h2"></path>
                                    <path d="M22 16c0 4 -2.5 6 -3.5 6s-3.5 -2 -3.5 -6c1 0 2.5 -.5 3.5 -1.5c1 1 2.5 1.5 3.5 1.5z"></path>
                                    <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0"></path>
                                </svg>
                            </span>
                            <h4 className="text-center mt-2">Admin</h4>
                            <h4 className="text-center">{users.admins}</h4>
                        </div>
                    </div>
                    <div className="col-md-3 col-sm-6 col-6">
                        <div className="admin-small-card admin-card-color-4 py-3 m-2 mx-1 d-flex flex-column align-items-center justify-content-center rounded">
                            <span>
                                <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-user-bolt" width="30" height="30" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                    <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0"></path>
                                    <path d="M6 21v-2a4 4 0 0 1 4 -4h4c.267 0 .529 .026 .781 .076"></path>
                                    <path d="M19 16l-2 3h4l-2 3"></path>
                                </svg>
                            </span>
                            <h4 className="text-center mt-2">Delivery Boy</h4>
                            <h4 className="text-center">{users.deliveryBoys}</h4>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}