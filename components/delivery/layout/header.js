import Link from "next/link";

export default function Header({ me, handleLogout }) {
    return (
        <nav class="navbar navbar-expand-lg navbar-light bg-white border p-0">
            <div class="container-fluid">
                <ul class="m-0 d-flex align-items-center justify-content-between w-100 gap-3 p-2">
                    <li>
                        <Link href="/" className="lora-font">
                            <h1 className="fw-bold text-primary m-0">F<span className="text-secondary">oo</span>dy</h1>
                        </Link>
                    </li>
                    <li>
                        <ul className="d-flex align-items-center gap-3">
                            <li class="nav-item">
                                <Link class="nav-link" aria-current="page" href="/delivery">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-home-2" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                        <path d="M5 12l-2 0l9 -9l9 9l-2 0"></path>
                                        <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7"></path>
                                        <path d="M10 12h4v4h-4z"></path>
                                    </svg>
                                </Link>
                            </li>
                            <li class="nav-item">
                                <Link class="nav-link" href="/" onClick={() => handleLogout()}>
                                    <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-logout" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                        <path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2"></path>
                                        <path d="M9 12h12l-3 -3"></path>
                                        <path d="M18 15l3 -3"></path>
                                    </svg>
                                </Link>
                            </li>
                            <li class="nav-item">
                                <Link class="nav-link" href="/delivery/profile/account">
                                    <img className="profile-icon rounded-circle" src={`/user/images/dynamic/users/${me?.data?.avatar}`} width={28} height={28} alt="" />
                                </Link>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        </nav>
    )
}