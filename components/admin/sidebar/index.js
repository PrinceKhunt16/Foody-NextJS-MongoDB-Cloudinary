import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Sidebar() {
    const router = useRouter()
    const [windowWidth, setWindowWidth] = useState(null)
    const [once, setOnce] = useState(true)
    const [highlight, setHighlight] = useState('dashboard')
    const routerMap = new Map()

    const handleLogout = async () => {
        await fetch(`${process.env.API_BASE_URL}/admin/auth/logout`, {
            method: 'DELETE'
        })
    }

    const handleHighlight = (e) => {
        const beforeElement = document.getElementById(highlight)
        beforeElement.classList.remove("active")

        setHighlight(e)

        const nowElement = document.getElementById(e)
        nowElement.classList.add("active")
    }

    const handleSidebarOpenClose = () => {
        const sidebar = document.getElementsByClassName("left-sidebar")[0]
        sidebar.style.left = "-270px"
    }

    const makeDefault = () => {
        if (windowWidth < 1200 && once) {
            const sidebar = document.getElementsByClassName("left-sidebar")[0]
            sidebar.style.left = "-270px"
            setOnce(false)
        }
    }

    useEffect(() => {
        setWindowWidth(window.innerWidth)

        function handleResize() {
            if (windowWidth > 1200) {
                const sidebar = document.getElementsByClassName("left-sidebar")[0]
                sidebar.style.left = "0px"
                setOnce(true)
            }

            makeDefault()
            setWindowWidth(window.innerWidth)
        }

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [windowWidth])

    useEffect(() => {
        const element = document.getElementById(highlight)
        element.classList.add("active")
    }, []);

    useEffect(() => {
        routerMap.set("/admin/dashboard", "dashboard");
        routerMap.set("/admin/products", "products");
        routerMap.set("/admin/orders", "orders");
        routerMap.set("/admin/users", "users");
        routerMap.set("/admin/profile/account", "account");
        routerMap.set("/admin/auth/login", "logout");
        routerMap.set("/", "backtohome");

        if (routerMap.has(router.pathname)) {
            handleHighlight(routerMap.get(router.pathname));
        }
    }, [router.pathname]);

    return (
        <aside className="left-sidebar shadow-sm bg-white">
            <div>
                <div className="brand-logo d-flex align-items-center justify-content-between">
                    <Link href="/admin/dashboard" className="text-nowrap logo-text">
                        <h1 className="fw-bold text-primary m-0">F<span className="text-secondary">oo</span>dy</h1>
                    </Link>
                    <div className="close-btn d-xl-none d-block sidebartoggler cursor-pointer" id="sidebarCollapse" onClick={() => handleSidebarOpenClose()}>
                        <i className="ti ti-x fs-8"></i>
                    </div>
                </div>
                <nav className="sidebar-nav scroll-sidebar" data-simplebar="">
                    <ul id="sidebarnav" className="p-0">
                        <li className="nav-small-cap">
                            <i className="ti ti-dots nav-small-cap-icon fs-4"></i>
                            <span className="hide-menu">Home</span>
                        </li>
                        <li className="sidebar-item">
                            <Link className="sidebar-link" id="dashboard" href="/admin/dashboard" aria-expanded="false">
                                <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-layout-dashboard" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" strokeLinejoin="round">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                    <path d="M4 4h6v8h-6z"></path>
                                    <path d="M4 16h6v4h-6z"></path>
                                    <path d="M14 12h6v8h-6z"></path>
                                    <path d="M14 4h6v4h-6z"></path>
                                </svg>
                                <span className="hide-menu">Dashboard</span>
                            </Link>
                        </li>
                        <li className="nav-small-cap">
                            <i className="ti ti-dots nav-small-cap-icon fs-4"></i>
                            <span className="hide-menu">MANAGE</span>
                        </li>
                        <li className="sidebar-item">
                            <Link className="sidebar-link" id="products" href="/admin/products" aria-expanded="false">
                                <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-shopping-cart" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" strokeLinejoin="round">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                    <path d="M6 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path>
                                    <path d="M17 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path>
                                    <path d="M17 17h-11v-14h-2"></path>
                                    <path d="M6 5l14 1l-1 7h-13"></path>
                                </svg>
                                <span className="hide-menu">Products</span>
                            </Link>
                        </li>
                        <li className="sidebar-item">
                            <Link className="sidebar-link" id="orders" href="/admin/orders" aria-expanded="false">
                                <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-truck-delivery" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" strokeLinejoin="round">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                    <path d="M7 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path>
                                    <path d="M17 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path>
                                    <path d="M5 17h-2v-4m-1 -8h11v12m-4 0h6m4 0h2v-6h-8m0 -5h5l3 5"></path>
                                    <path d="M3 9l4 0"></path>
                                </svg>
                                <span className="hide-menu">Orders</span>
                            </Link>
                        </li>
                        <li className="sidebar-item">
                            <Link className="sidebar-link" id="users" href="/admin/users" aria-expanded="false">
                                <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-user-cog" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" strokeLinejoin="round">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                    <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0"></path>
                                    <path d="M6 21v-2a4 4 0 0 1 4 -4h2.5"></path>
                                    <path d="M19.001 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path>
                                    <path d="M19.001 15.5v1.5"></path>
                                    <path d="M19.001 21v1.5"></path>
                                    <path d="M22.032 17.25l-1.299 .75"></path>
                                    <path d="M17.27 20l-1.3 .75"></path>
                                    <path d="M15.97 17.25l1.3 .75"></path>
                                    <path d="M20.733 20l1.3 .75"></path>
                                </svg>
                                <span className="hide-menu">Users</span>
                            </Link>
                        </li>
                        <li className="nav-small-cap">
                            <i className="ti ti-dots nav-small-cap-icon fs-4"></i>
                            <span className="hide-menu">Account</span>
                        </li>
                        <li className="sidebar-item">
                            <Link className="sidebar-link" id="account" href="/admin/profile/account" aria-expanded="false">
                                <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-user-circle" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" strokeLinejoin="round">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                    <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"></path>
                                    <path d="M12 10m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"></path>
                                    <path d="M6.168 18.849a4 4 0 0 1 3.832 -2.849h4a4 4 0 0 1 3.834 2.855"></path>
                                </svg>
                                <span className="hide-menu">Account</span>
                            </Link>
                        </li>
                        <li className="nav-small-cap">
                            <i className="ti ti-dots nav-small-cap-icon fs-4"></i>
                            <span className="hide-menu">Logout</span>
                        </li>
                        <li className="sidebar-item">
                            <Link className="sidebar-link" onClick={() => handleLogout()} id="logout" href="/admin/auth/login" aria-expanded="false">
                                <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-logout" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" strokeLinejoin="round">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                    <path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2"></path>
                                    <path d="M9 12h12l-3 -3"></path>
                                    <path d="M18 15l3 -3"></path>
                                </svg>
                                <span className="hide-menu">Logout</span>
                            </Link>
                        </li>
                        <li className="nav-small-cap">
                            <i className="ti ti-dots nav-small-cap-icon fs-4"></i>
                            <span className="hide-menu">Back To Home</span>
                        </li>
                        <li className="sidebar-item">
                            <Link className="sidebar-link" id="backtohome" href="/" aria-expanded="false">
                                <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-home-2" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" strokeLinejoin="round">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                    <path d="M5 12l-2 0l9 -9l9 9l-2 0"></path>
                                    <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7"></path>
                                    <path d="M10 12h4v4h-4z"></path>
                                </svg>
                                <span className="hide-menu">Home</span>
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </aside>
    )
}