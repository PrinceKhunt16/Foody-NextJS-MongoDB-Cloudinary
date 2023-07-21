import Link from "next/link";

export default function Banner({ name }) {
    return (
        <div className="container-fluid page-header mb-5 wow fadeIn" data-wow-delay="0.1s">
            <div className="container">
                <h1 className="display-3 mb-3 animated slideInDown">{name}</h1>
                <nav aria-label="breadcrumb animated slideInDown">
                    <ol className="breadcrumb mb-0">
                        <li className="breadcrumb-item"><Link className="text-body" href="/">Home</Link></li>
                        <li className="breadcrumb-item text-dark active" aria-current="page">{name}</li>
                    </ol>
                </nav>
            </div>
        </div>
    )
}