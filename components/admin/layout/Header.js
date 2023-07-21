import Link from "next/link"

export default function Header({ me }) {
    function handleSidebarOpenClose() {
        const sidebar = document.getElementsByClassName("left-sidebar")[0]
        sidebar.style.left = "0px"
    }

    return (
        <header className="app-header shadow-sm mb-5 bg-white">
            <nav className="navbar navbar-expand-lg navbar-light">
                <ul className="navbar-nav mt-0">
                    <li className="nav-item d-block d-xl-none" onClick={() => handleSidebarOpenClose()}>
                        <Link className="nav-link sidebartoggler nav-icon-hover" id="headerCollapse" href="#">
                            <i className="ti ti-menu-2"></i>
                        </Link>
                    </li>
                </ul>
                <div className="navbar-collapse justify-content-end px-0 border-0" id="navbarNav">
                    <ul className="navbar-nav mt-0 flex-row ms-auto align-items-center justify-content-end">
                        <li className="nav-item dropdown">
                            <Link className="btn-sm-square bg-white rounded-circle ms-3" href="/admin/profile/account">
                                <img className="profile-icon rounded-circle" src={`/user/images/dynamic/users/${me?.data?.avatar}`} width={32} height={32} alt="" />
                            </Link>
                        </li>
                    </ul>
                </div>
            </nav>
        </header>
    )
}