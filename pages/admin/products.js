import { month } from "@/utils/month";
import { notifyError, notifySuccess } from "@/utils/notify";
import { checkDiscount, checkImages, checkPrice, checkText, checkWeight } from "@/utils/validator";
import { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import Swal from "sweetalert2";

export default function Products() {
    const [showModal, setShowModal] = useState(false);
    const [product, setProduct] = useState({ name: "", images: [], price: "", wrongPrice: "", weight: 0, company: "", category: "", preferences: "", origin: "", discount: 0 });
    const [apiCallCheck, setApiCallCheck] = useState(false);
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(0);
    const [pages, setPages] = useState(0);
    const [documents] = useState(10);
    const [edit, setEdit] = useState(false);
    const [editProductId, setEditProductId] = useState(null);
    const [newImages, setNewImages] = useState([]);
    const [deletedImages, setDeletedImages] = useState([]);

    const handleChange = (e) => {
        if (e.target.name === 'images') {
            if (edit) {
                setNewImages(Array.from(e.target.files))
            } else {
                setProduct({
                    ...product,
                    images: Array.from(e.target.files)
                });
            }
        } else {
            setProduct({
                ...product,
                [e.target.name]: e.target.value
            });
        }
    }

    const uploadImagesByMulter = async () => {
        try {
            const formData = new FormData()

            if (edit) {
                newImages.forEach((file) => {
                    formData.append('images', file);
                });
            } else {
                product.images.forEach((file) => {
                    formData.append('images', file);
                });
            }

            const imagesResponse = await fetch(`${process.env.API_BASE_URL}/admin/multer/uploadimages`, {
                method: "POST",
                body: formData
            })

            const imagesData = await imagesResponse.json();

            return {
                urls: imagesData.urls,
                error: false
            }
        } catch (error) {
            return {
                error: true
            }
        }
    }

    const checkAllFieldsValidation = () => {
        const fields = {
            name: checkText("Product name", product.name, 2, 100, false),
            images: checkImages("Product images", product.images),
            price: checkPrice("Product price", product.price),
            wrongPrice: checkPrice("Product wrong price", product.wrongPrice),
            weight: checkWeight("Product weight", product.weight),
            company: checkText("Product company", product.company, 2, 100, false),
            category: checkText("Product category", product.category, 2, 100, false),
            preferences: checkText("Product preferences", product.preferences, 2, 100, false),
            origin: checkText("Product origin", product.origin, 2, 100, false),
            discount: checkDiscount("Product discount", product.discount),
        }

        for (const field in fields) {
            if (fields[field].error) {
                notifyError(fields[field].message);
                return true;
            }
        }

        return false;
    }

    const handleSubmitAddProduct = async () => {
        const swalRes = Swal.fire({
            title: `Are you sure you want to add product ?`,
            icon: 'question',
            confirmButtonText: 'Yes',
            showCancelButton: true,
            cancelButtonText: 'No',
        })

        if ((await swalRes).isConfirmed) {
            let allApiCallDone = false;

            if (checkAllFieldsValidation()) {
                return;
            }

            const imagesUpload = await uploadImagesByMulter()

            if (imagesUpload.error) {
                notifyError("Error occured while uploading images.")
                return
            }

            try {
                const productResponse = await fetch(`${process.env.API_BASE_URL}/admin/products/create`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        ...product,
                        images: imagesUpload.urls
                    })
                });

                const productData = await productResponse.json();

                if (productData.success) {
                    notifySuccess(productData.message);
                    setShowModal(!showModal);
                    setApiCallCheck(!apiCallCheck);
                    setProduct({ name: "", images: [], price: "", wrongPrice: "", weight: 0, company: "", category: "", preferences: "", origin: "", discount: 0 })
                } else {
                    allApiCallDone = true;
                    notifyError(productData.message);
                }
            } catch (error) {
                allApiCallDone = true;
                console.log(error);
            }

            if (allApiCallDone) {
                await fetch(`${process.env.API_BASE_URL}/admin/multer/deleteimages`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ urls: imagesUpload.urls })
                });
            }
        }
    }

    const handleChangeStatus = async (status, productId) => {
        const swalRes = Swal.fire({
            title: `Are you sure you want to change status ?`,
            icon: 'question',
            confirmButtonText: 'Yes',
            showCancelButton: true,
            cancelButtonText: 'No',
        })

        if ((await swalRes).isConfirmed) {
            const statusResponse = await fetch(`${process.env.API_BASE_URL}/admin/products/status/${productId}`, {
                method: 'POST',
                body: JSON.stringify({
                    status: status
                }),
                headers: {
                    "Content-Type": "application/json",
                }
            })

            const statusData = await statusResponse.json();

            if (statusData.success) {
                setApiCallCheck(!apiCallCheck);
            }
        }
    }

    const handleEditProduct = async (productId) => {
        setEdit(true)
        setShowModal(true)
        setEditProductId(productId)

        const productResponse = await fetch(`${process.env.API_BASE_URL}/admin/products/indivisual/${productId}`, {
            method: "GET"
        });

        const productData = await productResponse.json();

        setProduct({ name: productData.data.name, images: productData.data.images, price: productData.data.price, wrongPrice: productData.data.wrongPrice, weight: productData.data.weight, company: productData.data.company, category: productData.data.category, preferences: productData.data.preferences, origin: productData.data.origin, discount: productData.data.discount });
    }

    const handleEditProductSubmit = async (productId) => {
        const swalRes = Swal.fire({
            title: `Are you sure you want to edit product ?`,
            icon: 'question',
            confirmButtonText: 'Yes',
            showCancelButton: true,
            cancelButtonText: 'No',
        })

        if ((await swalRes).isConfirmed) {
            let error = false;
            let newUploadedImages = [];
            let allImages = [];

            if (!productId) {
                return;
            }

            if (product.images.length === 0) {
                if (newImages.length === 0) {
                    notifyError("Images filed is required.");
                    return;
                }
            }

            if (newImages.length >= 1) {
                const imagesUpload = await uploadImagesByMulter()

                if (imagesUpload.error) {
                    error = true;
                    notifyError("Error occured while uploading new images.")
                    return
                }

                newUploadedImages = imagesUpload.urls;
            }

            allImages = [...newUploadedImages, ...product.images];

            const editProductResponse = await fetch(`${process.env.API_BASE_URL}/admin/products/indivisual/${productId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    ...product,
                    images: allImages
                })
            });

            const editProductData = await editProductResponse.json();

            if (editProductData.success) {
                await fetch(`${process.env.API_BASE_URL}/admin/multer/deleteimages`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ urls: deletedImages })
                });

                notifySuccess(editProductData.message);
            } else {
                await fetch(`${process.env.API_BASE_URL}/admin/multer/deleteimages`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ urls: newUploadedImages })
                });

                notifyError('Error occurred. Please try again.')
            }

            fetchProducts();
            setShowModal(false);
        }
    }

    const deleteExistingImages = (selectedImage) => {
        setProduct({
            ...product,
            images: product.images.filter((image) => image !== selectedImage)
        });

        setDeletedImages([...deletedImages, selectedImage]);
    }

    const fetchProducts = async (page = 0) => {
        const productsResponse = await fetch(`${process.env.API_BASE_URL}/admin/products/getallproducts`, {
            method: 'POST',
            body: JSON.stringify({
                page: page,
                documents: documents
            }),
            headers: {
                "Content-Type": "application/json",
            }
        })

        const productsData = await productsResponse.json();

        setPage(page);
        setPages(productsData.pages);
        setProducts(productsData.data);
    }

    useEffect(() => {
        if (!showModal && edit) {
            setEdit(false);
            setProduct({ name: "", images: [], price: "", wrongPrice: "", weight: 0, company: "", category: "", preferences: "", origin: "", discount: 0 });
            setEditProductId(null);
            setDeletedImages([]);
            setNewImages([]);
        }
    }, [showModal, edit]);

    useEffect(() => {
        fetchProducts(page);
    }, [apiCallCheck]);

    return (
        <>
            <div className="container">
                <div className="d-flex mt-4 justify-content-between">
                    <h1>Products</h1>
                    <div>
                        <Button onClick={() => setShowModal(!showModal)}>Add Product</Button>
                    </div>
                </div>
                <div className="table-body table-responsive">
                    <table className="table mt-4 mb-4 text-nowrap">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>Images</th>
                                <th>Company</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Wrong price</th>
                                <th>Weight</th>
                                <th>Discount (%)</th>
                                <th>Rating</th>
                                <th>Preferences</th>
                                <th>Origin</th>
                                <th>Created date</th>
                                <th>Action (Edit, Stoke)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products && products.map((product, index) => {
                                const d = new Date(Number(product.createdOn))
                                return (
                                    <tr className="custom-table-row" key={product.id}>
                                        <td><div>{Number((page * documents) + (index + 1))}</div></td>
                                        <td><div>{product.name}</div></td>
                                        <td><img src={`/user/images/dynamic/products/${product.images[0]}`} width={60} height={60} alt="" /></td>
                                        <td><div>{product.company}</div></td>
                                        <td><div>{product.category}</div></td>
                                        <td><div>₹{product.price}</div></td>
                                        <td><div>₹{product.wrongPrice}</div></td>
                                        <td><div>{product.weight}</div></td>
                                        <td><div>{product.discount}</div></td>
                                        <td><div>{product.rating}</div></td>
                                        <td><div>{product.preferences}</div></td>
                                        <td><div>{product.origin}</div></td>
                                        <td><div>{month[d.getMonth()] + ' ' + d.getDate() + ' ' + d.getFullYear() + ' ' + (d.getHours() % 12) + ':' + d.getMinutes() + ' ' + (d.getHours() > 12 ? 'PM' : 'AM')}</div></td>
                                        <td>
                                            <div className="d-flex gap-2">
                                                <Button className="rounded-circle action-button" onClick={() => handleEditProduct(product.id)}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-pencil" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" strokeLinejoin="round">
                                                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                                        <path d="M4 20h4l10.5 -10.5a1.5 1.5 0 0 0 -4 -4l-10.5 10.5v4"></path>
                                                        <path d="M13.5 6.5l4 4"></path>
                                                    </svg>
                                                </Button>
                                                {product.status ?
                                                    (
                                                        <Button className="rounded-circle action-button" onClick={() => handleChangeStatus(1, product.id)}>
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-circle-check-filled" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" strokeLinejoin="round">
                                                                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                                                <path d="M17 3.34a10 10 0 1 1 -14.995 8.984l-.005 -.324l.005 -.324a10 10 0 0 1 14.995 -8.336zm-1.293 5.953a1 1 0 0 0 -1.32 -.083l-.094 .083l-3.293 3.292l-1.293 -1.292l-.094 -.083a1 1 0 0 0 -1.403 1.403l.083 .094l2 2l.094 .083a1 1 0 0 0 1.226 0l.094 -.083l4 -4l.083 -.094a1 1 0 0 0 -.083 -1.32z" stroke-width="0" fill="currentColor"></path>
                                                            </svg>
                                                        </Button>
                                                    ) : (
                                                        <Button variant="danger" className="rounded-circle action-button" onClick={() => handleChangeStatus(0, product.id)}>
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-square-rounded-x-filled" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" strokeLinejoin="round">
                                                                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                                                <path d="M12 2l.324 .001l.318 .004l.616 .017l.299 .013l.579 .034l.553 .046c4.785 .464 6.732 2.411 7.196 7.196l.046 .553l.034 .579c.005 .098 .01 .198 .013 .299l.017 .616l.005 .642l-.005 .642l-.017 .616l-.013 .299l-.034 .579l-.046 .553c-.464 4.785 -2.411 6.732 -7.196 7.196l-.553 .046l-.579 .034c-.098 .005 -.198 .01 -.299 .013l-.616 .017l-.642 .005l-.642 -.005l-.616 -.017l-.299 -.013l-.579 -.034l-.553 -.046c-4.785 -.464 -6.732 -2.411 -7.196 -7.196l-.046 -.553l-.034 -.579a28.058 28.058 0 0 1 -.013 -.299l-.017 -.616c-.003 -.21 -.005 -.424 -.005 -.642l.001 -.324l.004 -.318l.017 -.616l.013 -.299l.034 -.579l.046 -.553c.464 -4.785 2.411 -6.732 7.196 -7.196l.553 -.046l.579 -.034c.098 -.005 .198 -.01 .299 -.013l.616 -.017c.21 -.003 .424 -.005 .642 -.005zm-1.489 7.14a1 1 0 0 0 -1.218 1.567l1.292 1.293l-1.292 1.293l-.083 .094a1 1 0 0 0 1.497 1.32l1.293 -1.292l1.293 1.292l.094 .083a1 1 0 0 0 1.32 -1.497l-1.292 -1.293l1.292 -1.293l.083 -.094a1 1 0 0 0 -1.497 -1.32l-1.293 1.292l-1.293 -1.292l-.094 -.083z" fill="currentColor" stroke-width="0"></path>
                                                            </svg>
                                                        </Button>
                                                    )
                                                }
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                    <ReactPaginate
                        breakLabel="..."
                        nextLabel=">"
                        onPageChange={(e) => fetchProducts(e.selected)}
                        pageRangeDisplayed={documents}
                        pageCount={pages}
                        previousLabel="<"
                        renderOnZeroPageCount={null}
                        className="pagination"
                    />
                </div>
            </div>
            <Modal show={showModal} onHide={() => setShowModal(!showModal)}>
                <Modal.Header closeButton>
                    <Modal.Title>{edit ? "Edit Product" : "Add Product"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" placeholder="Enter name" name="name" value={product.name} onChange={(e) => handleChange(e)} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Images</Form.Label>
                        <div className="file-input-body">
                            <label className="custom-file-upload">
                                <input type="file" name="images" multiple onChange={(e) => handleChange(e)} />
                                Upload products images
                            </label>
                        </div>
                        {edit ? (
                            <>
                                <h6>Existing images</h6>
                                {product?.images?.length >= 1 && (
                                    <div className="product-images">
                                        {product.images.map((image) => {
                                            return (
                                                <div className="edit-existing-images">
                                                    <Button variant="warning" className="rounded-circle delete-button" onClick={() => deleteExistingImages(image)}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-trash-x-filled" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" strokeLinejoin="round">
                                                            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                                            <path d="M20 6a1 1 0 0 1 .117 1.993l-.117 .007h-.081l-.919 11a3 3 0 0 1 -2.824 2.995l-.176 .005h-8c-1.598 0 -2.904 -1.249 -2.992 -2.75l-.005 -.167l-.923 -11.083h-.08a1 1 0 0 1 -.117 -1.993l.117 -.007h16zm-9.489 5.14a1 1 0 0 0 -1.218 1.567l1.292 1.293l-1.292 1.293l-.083 .094a1 1 0 0 0 1.497 1.32l1.293 -1.292l1.293 1.292l.094 .083a1 1 0 0 0 1.32 -1.497l-1.292 -1.293l1.292 -1.293l.083 -.094a1 1 0 0 0 -1.497 -1.32l-1.293 1.292l-1.293 -1.292l-.094 -.083z" stroke-width="0" fill="currentColor"></path>
                                                            <path d="M14 2a2 2 0 0 1 2 2a1 1 0 0 1 -1.993 .117l-.007 -.117h-4l-.007 .117a1 1 0 0 1 -1.993 -.117a2 2 0 0 1 1.85 -1.995l.15 -.005h4z" stroke-width="0" fill="currentColor"></path>
                                                        </svg>
                                                    </Button>
                                                    <img src={`/user/images/dynamic/products/${image}`} alt="" width={100} height={100} />
                                                </div>
                                            )
                                        })}
                                    </div>
                                )}
                                {product.images.length === 0 && <h5>You remove all existing images. Now you have to upload at least one image.</h5>}
                                <h6>New images</h6>
                                {newImages.length >= 1 && (
                                    <div className="product-images">
                                        {newImages.map((image) => {
                                            return (
                                                <div>
                                                    <img src={URL.createObjectURL(image)} alt="" width={100} height={100} />
                                                </div>
                                            )
                                        })}
                                    </div>
                                )}
                            </>
                        ) : (
                            <>
                                {product.images.length >= 1 && (
                                    <div className="product-images">
                                        {product.images.map((image) => {
                                            return (
                                                <div>
                                                    <img src={URL.createObjectURL(image)} alt="" width={100} height={100} />
                                                </div>
                                            )
                                        })}
                                    </div>
                                )}
                            </>
                        )}

                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Price</Form.Label>
                        <Form.Control type="number" placeholder="Enter price" name="price" value={product.price} onChange={(e) => handleChange(e)} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Wrong Price</Form.Label>
                        <Form.Control type="number" placeholder="Enter wrong price" name="wrongPrice" value={product.wrongPrice} onChange={(e) => handleChange(e)} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Weight (g)</Form.Label>
                        <Form.Control type="number" placeholder="Enter weight" name="weight" value={product.weight} onChange={(e) => handleChange(e)} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Company</Form.Label>
                        <Form.Control type="text" placeholder="Enter company" name="company" value={product.company} onChange={(e) => handleChange(e)} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Category</Form.Label>
                        <Form.Control type="text" placeholder="Enter category" name="category" value={product.category} onChange={(e) => handleChange(e)} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Preferences</Form.Label>
                        <Form.Control type="text" placeholder="Enter preferences" name="preferences" value={product.preferences} onChange={(e) => handleChange(e)} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Origin</Form.Label>
                        <Form.Control type="text" placeholder="Enter origin" name="origin" value={product.origin} onChange={(e) => handleChange(e)} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Discount (%)</Form.Label>
                        <Form.Control type="number" placeholder="Enter discount" name="discount" value={product.discount} onChange={(e) => handleChange(e)} />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(!showModal)}>
                        Close
                    </Button>
                    {edit &&
                        <Button variant="primary" onClick={() => handleEditProductSubmit(editProductId)}>
                            Edit Product
                        </Button>
                    }
                    {!edit &&
                        <Button variant="primary" onClick={() => handleSubmitAddProduct()}>
                            Add Product
                        </Button>
                    }
                </Modal.Footer>
            </Modal>
        </>
    )
}