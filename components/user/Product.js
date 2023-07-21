import Link from "next/link";

export default function Product({ product, xl, lg, md }) {
    return (
        <div className={`col-xl-${xl} col-lg-${lg} col-md-${md} wow fadeInUp`} data-wow-delay="0.3s">
            <div className="product-item">
                <div className="position-relative bg-light overflow-hidden product-card-image">
                    <img className="img-fluid h-100" src={`/user/images/dynamic/products/${product.images[0]}`} alt="" />
                </div>
                <div className="text-center p-4">
                    <Link className="d-block h5 mb-2" href={`/products/${product.id}`}>{product.name}</Link>
                    <span className="text-primary me-1">₹{product.price}</span>
                    <span className="text-body text-decoration-line-through">₹{product.wrongPrice}</span>
                </div>
                <div className="d-flex border-top">
                    <small className="w-50 text-center border-end py-2">
                        <Link className="text-body" href={`/products/${product.id}`}><i className="fa fa-eye text-primary me-2"></i>View detail</Link>
                    </small>
                    <small className="w-50 text-center py-2">
                        <Link className="text-body" href="/cart"><i className="fa fa-shopping-bag text-primary me-2"></i>Add to cart</Link>
                    </small>
                </div>
            </div>
        </div>
    )
}