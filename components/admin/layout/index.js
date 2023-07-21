import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Sidebar from "../sidebar";
import Header from "./Header";

export default function AdminLayout({ children }) {
    const router = useRouter()
    const [show, setShow] = useState(false)
    const [loading, setLoding] = useState(true)
    const [me, setMe] = useState();

    useEffect(() => {
        if (router.pathname.startsWith('/admin/auth/login')) {
            setShow(false)
        } else {
            setShow(true)
        }

        setLoding(false)
    }, [router.pathname]);

    const fetchMe = async () => {
        try {
            const meResponse = await fetch(`${process.env.API_BASE_URL}/admin/profile/me`, {
                method: 'GET'
            })

            const meData = await meResponse.json();

            if (!meData.success) {
                setMe(null);
            }

            setMe(meData);
        } catch (error) {
            router.push('/');
            setMe(null);
        }
    }

    useEffect(() => {
        if (router.pathname !== '/admin/auth/login') {
            fetchMe();
        }
    }, [router.pathname]);

    return (
        <div>
            <Head>
                <link rel="stylesheet" href="../../../admin/css/styles.css" />
                <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.10.0/css/all.min.css" rel="stylesheet" />
                <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.4.1/font/bootstrap-icons.css" rel="stylesheet" />
                <script src="https://kit.fontawesome.com/40a13032f8.js" crossorigin="anonymous"></script>
            </Head>
            <main className="foody-admin">
                {show && !loading && (
                    <div className="page-wrapper" id="main-wrapper" data-layout="vertical" data-navbarbg="skin6" data-sidebartype="full" data-sidebar-position="fixed" data-header-position="fixed">
                        <Sidebar />
                        <div className="body-wrapper">
                            <Header me={me} />
                            <div className="admin-children">
                                {children}
                            </div>
                        </div>
                    </div>
                )}
                {!show && !loading && (
                    <div className="page-wrapper" id="main-wrapper" data-layout="vertical" data-navbarbg="skin6" data-sidebartype="full" data-sidebar-position="fixed" data-header-position="fixed">
                        {children}
                    </div>
                )}
            </main>
        </div>
    )
}