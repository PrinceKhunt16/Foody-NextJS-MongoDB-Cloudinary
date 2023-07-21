import "bootstrap/dist/css/bootstrap.css"
import "react-multi-carousel/lib/styles.css";
import AdminLayout from '@/components/admin/layout';
import UserLayout from '@/components/user/layout'
import { useRouter } from 'next/router';
import { Toaster } from 'react-hot-toast';
import 'bootstrap/dist/css/bootstrap.min.css';
import DeliveryLayout from "@/components/delivery/layout";

export default function App({ Component, pageProps }) {
  const router = useRouter()

  return (
    <>
      <Toaster />
      {(router.pathname.split('/')[1] === 'admin') && (
        <AdminLayout>
          <Component {...pageProps} />
        </AdminLayout>
      )}
      {(router.pathname.split('/')[1] === 'delivery') && (
        <DeliveryLayout>
          <Component {...pageProps} />
        </DeliveryLayout>
      )}
      {(router.pathname.split('/')[1] !== 'admin' &&
        router.pathname.split('/')[1] !== 'delivery') && (
          <UserLayout>
            <Component {...pageProps} />
          </UserLayout>
        )}
    </>
  )
}
