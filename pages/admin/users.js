import { month } from "@/utils/month";
import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import Swal from "sweetalert2";

export default function Users() {
    const [apiCallCheck, setApiCallCheck] = useState(false);
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(0);
    const [pages, setPages] = useState(0);
    const [documents] = useState(10);

    const handleUserType = async (userId, type) => {
        const swalRes = Swal.fire({
            title: `Are you sure you want to change user status ?`,
            icon: 'question',
            confirmButtonText: 'Yes',
            showCancelButton: true,
            cancelButtonText: 'No',
        })

        if ((await swalRes).isConfirmed) {
            const response = await fetch(`${process.env.API_BASE_URL}/admin/users/type/${userId}`, {
                method: "POST",
                body: JSON.stringify({
                    type: type
                }),
                headers: {
                    "Content-Type": "application/json",
                }
            })

            const data = await response.json();

            if (data.success) {
                setApiCallCheck(!apiCallCheck);
            }
        }
    }

    const handleUserStatus = async (userId, status) => {
        const swalRes = Swal.fire({
            title: `Are you sure you want to change user status ?`,
            icon: 'question',
            confirmButtonText: 'Yes',
            showCancelButton: true,
            cancelButtonText: 'No',
        })

        if ((await swalRes).isConfirmed) {
            const response = await fetch(`${process.env.API_BASE_URL}/admin/users/status/${userId}`, {
                method: "POST",
                body: JSON.stringify({
                    status: status
                }),
                headers: {
                    "Content-Type": "application/json",
                }
            })

            const data = await response.json();

            if (data.success) {
                setApiCallCheck(!apiCallCheck);
            }
        }
    }

    const fetchUsers = async (page = 0) => {
        const usersResponse = await fetch(`${process.env.API_BASE_URL}/admin/users/getallusers`, {
            method: 'POST',
            body: JSON.stringify({
                page: page,
                documents: documents
            }),
            headers: {
                "Content-Type": "application/json",
            }
        })

        const usersData = await usersResponse.json();

        setPage(page);
        setPages(usersData.pages);
        setUsers(usersData.data);
    }

    useEffect(() => {
        fetchUsers(page);
    }, [apiCallCheck]);

    return (
        <>
            <div className="container">
                <div className="d-flex mt-4 justify-content-between">
                    <h1>Users</h1>
                </div>
                <div className="table-responsive">
                    <div className="table-body">
                        <table className="table mt-4 mb-4 text-nowrap">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">User</th>
                                    <th scope="col">Email</th>
                                    <th scope="col">Registred date</th>
                                    <th scope="col">Status</th>
                                    <th scope="col">Type</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users && users.map((user, index) => {
                                    const d = new Date(Number(user.createdOn))
                                    return (
                                        <tr className="custom-table-row" key={user.id}>
                                            <td><div>{index + 1}</div></td>
                                            <td><div className="d-flex gap-2"><img src={`/user/images/dynamic/users/${user.avatar}`} className="obj-cover" width="50" alt="" /> <div>{user.firstName} {user.lastName}</div></div></td>
                                            <td><div>{user.email}</div></td>
                                            <td><div>{month[d.getMonth()] + ' ' + d.getDate() + ' ' + d.getFullYear() + ' ' + (d.getHours() % 12) + ':' + d.getMinutes() + ' ' + (d.getHours() > 12 ? 'PM' : 'AM')}</div></td>
                                            <td>
                                                <div>
                                                    <select value={user.status} onChange={() => handleUserStatus(user.id, user.status)} className="status-change-dropdown">
                                                        <option value="1">Active</option>
                                                        <option value="0">Deactive</option>
                                                    </select>
                                                </div>
                                            </td>
                                            <td>
                                                <div>
                                                    <select value={user.type} onChange={(e) => handleUserType(user.id, e.target.value)} className="status-change-dropdown">
                                                        <option value="0">User</option>
                                                        <option value="1">Admin</option>
                                                        <option value="2">Delivery Boy</option>
                                                    </select>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
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
        </>
    )
}