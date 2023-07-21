import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Footer from "./Footer";
import Header from "./Header";

export default function UserLayout({ children }) {
    const router = useRouter();
    const [me, setMe] = useState();

    const handleLogout = async () => {
        await fetch(`${process.env.API_BASE_URL}/auth/logout`, {
            method: 'DELETE'
        })

        setMe(null);

        router.push('/');
    }

    const fetchMe = async () => {
        try {
            const meResponse = await fetch(`${process.env.API_BASE_URL}/profile/me`, {
                method: 'GET'
            })

            const meData = await meResponse.json();

            if (!meData.success) {
                setMe(null);
            }

            setMe(meData);
        } catch (error) {
            setMe(null);
        }
    }

    useEffect(() => {
        fetchMe();
    }, [router.pathname]);

    return (
        <div>
            <Head>
                <link rel="stylesheet" href="../../../user/css/styles.css" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
                <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500&family=Lora:wght@600;700&display=swap" rel="stylesheet" />
                <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.10.0/css/all.min.css" rel="stylesheet" />
                <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.4.1/font/bootstrap-icons.css" rel="stylesheet" />
                <link href="lib/animate/animate.min.css" rel="stylesheet" />
                <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.min.js" integrity="sha384-mQ93GR66B00ZXjt0YO5KlohRA5SY2XofN4zfuZxLkoj1gXtW8ANNCe9d5Y3eG5eD" crossOrigin="anonymous" ></script>
                <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.6/dist/umd/popper.min.js" integrity="sha384-oBqDVmMz9ATKxIep9tiCxS/Z9fNfEXiDAYTujMAeBAsjFuCZSmKbSSUnQlmh/jp3" crossOrigin="anonymous" ></script>
                <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0/dist/js/bootstrap.bundle.min.js"></script>
                <script src="lib/wow/wow.min.js"></script>
                <script src="https://cdn.jsdelivr.net/npm/react/umd/react.production.min.js" crossorigin></script>
                <script src="https://cdn.jsdelivr.net/npm/react-dom/umd/react-dom.production.min.js" crossorigin></script>
                <script src="https://cdn.jsdelivr.net/npm/react-bootstrap@next/dist/react-bootstrap.min.js" crossorigin></script>
            </Head>
            {(router.pathname === '/paymentsuccess' || router.pathname === '/paymentcancel') ? (
                <main className="foody-user">
                    {children}
                </main>
            ) : (
                <>
                    <Header me={me} handleLogout={handleLogout} />
                    <main className="foody-user">
                        {children}
                    </main>
                    <Footer />
                </>
            )}
        </div>
    )
}