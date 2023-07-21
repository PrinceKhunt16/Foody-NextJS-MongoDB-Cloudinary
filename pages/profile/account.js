import Banner from "@/components/user/Banner";
import { notifyError, notifySuccess } from "@/utils/notify";
import { checkConfirmPassword, checkImage, checkPassword, checkText } from "@/utils/validator";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

export default function Account() {
    const router = useRouter();
    const [details, setDetails] = useState({ firstName: '', lastName: '' });
    const [avatar, setAvatar] = useState(null);
    const [password, setPassword] = useState({ newPassword: '', oldPassword: '', confirmPassword: '' });
    const [me, setMe] = useState();
    const [check, setCheck] = useState();
    const [showChangeProfile, setShowChangeProfile] = useState(false);
    const [showChangeAvatar, setShowChangeAvatar] = useState(false);
    const [showChangePassword, setShowChangePassword] = useState(false);

    const handleLogout = async () => {
        await fetch(`${process.env.API_BASE_URL}/auth/logout`, {
            method: 'DELETE'
        })

        router.push('/');
    }

    const handleChangePassword = (e) => {
        setPassword({
            ...password,
            [e.target.name]: e.target.value
        })
    }

    const openChangePassword = () => {
        setShowChangePassword(!showChangePassword)
    }

    const checkChangePasswordValidation = () => {
        const fields = {
            oldPassword: checkPassword(password.oldPassword, true),
            newPassword: checkPassword(password.newPassword, true),
            confirmPassword: checkConfirmPassword(password.newPassword, password.confirmPassword),
        }

        for (const field in fields) {
            if (fields[field].error) {
                notifyError(fields[field].message);
                return true;
            }
        }

        return false;
    }

    const handleSubmitChangePassword = async () => {
        if (checkChangePasswordValidation()) {
            return;
        }

        try {
            const passwordResponse = await fetch(`${process.env.API_BASE_URL}/profile/password`, {
                method: 'PUT',
                body: JSON.stringify(password),
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            const passwordData = await passwordResponse.json();

            if (!passwordData.success) {
                await handleLogout()

                notifyError(passwordData.message)

                router.push('/')
            } else {
                notifySuccess(passwordData.message)
            }
        } catch (error) {
            console.log(error)
            await handleLogout()
        }

        setCheck(!check);
        setShowChangePassword(!showChangePassword);
    }

    const openChangeAvatar = () => {
        setShowChangeAvatar(!showChangeAvatar)
    }

    const uploadImageByMulter = async () => {
        try {
            const formData = new FormData()
            formData.append("avatar", avatar)

            const response = await fetch(`${process.env.API_BASE_URL}/multer/uploadimage`, {
                method: "POST",
                body: formData
            })

            const avatarData = await response.json();

            return {
                avatar: avatarData.url,
                error: false
            }
        } catch (error) {
            return {
                error: true
            }
        }
    }

    const checkChangeAvatarValidation = () => {
        const fields = {
            avatar: checkImage("Avatar", avatar),
        }

        for (const field in fields) {
            if (fields[field].error) {
                notifyError(fields[field].message);
                return true;
            }
        }

        return false;
    }

    const handleSubmitChangeAvatar = async () => {
        if (checkChangeAvatarValidation()) {
            return;
        }

        const avatarUploadResponse = await uploadImageByMulter()

        if (avatarUploadResponse.error) {
            notifyError("Error occured while uploading avatar.")
            return
        }

        try {
            const avatarResponse = await fetch(`${process.env.API_BASE_URL}/profile/avatar`, {
                method: 'PUT',
                body: JSON.stringify({ avatar: avatarUploadResponse.avatar }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            const avatarData = await avatarResponse.json();

            if (avatarData.success) {
                await fetch(`${process.env.API_BASE_URL}/multer/deleteimage/${me.avatar}`, {
                    method: "DELETE"
                });

                notifySuccess(avatarData.message)
            } else {
                await fetch(`${process.env.API_BASE_URL}/multer/deleteimage/${avatarResponse.avatar}`, {
                    method: "DELETE"
                });

                notifyError(avatarData.message)

                await handleLogout()
            }
        } catch (error) {
            console.log(error)

            await fetch(`${process.env.API_BASE_URL}/multer/deleteimage/${avatarResponse.avatar}`, {
                method: "DELETE"
            });

            await handleLogout()
        }

        setCheck(!check);
        setShowChangeAvatar(!showChangeAvatar);
    }

    const handleChangeProfileDetails = (e) => {
        setDetails({
            ...details,
            [e.target.name]: e.target.value
        })
    }

    const checkChangeProfileValidation = () => {
        const fields = {
            firstName: checkText("Firstname", details.firstName, 2, 20, true),
            lastName: checkText("Lastname", details.lastName, 2, 20, true),
        }

        for (const field in fields) {
            if (fields[field].error) {
                notifyError(fields[field].message);
                return true;
            }
        }

        return false;
    }

    const handleSubmitChangeProfile = async () => {
        if (checkChangeProfileValidation()) {
            return;
        }

        try {
            const detailsResponse = await fetch(`${process.env.API_BASE_URL}/profile/me`, {
                method: 'PUT',
                body: JSON.stringify(details),
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            const detailsData = await detailsResponse.json();

            if (!detailsData.success) {
                notifyError(detailsData.message)
                await handleLogout()
            } else {
                notifySuccess(detailsData.message)
            }
        } catch (error) {
            console.log(error)
            await handleLogout()
        }

        setCheck(!check);
        setShowChangeProfile(!showChangeProfile);
    }

    const openChangeProfile = async () => {
        setDetails({
            firstName: me.firstName,
            lastName: me.lastName
        })

        setShowChangeProfile(!showChangeProfile)
    }

    const fetchMe = async () => {
        try {
            const meResponse = await fetch(`${process.env.API_BASE_URL}/profile/me`, {
                method: 'GET'
            })

            const meData = await meResponse.json();

            if (!meData.success) {
                await handleLogout()
            }

            setMe(meData.data);
        } catch (error) {
            console.log(error)
            await handleLogout()
        }
    }

    useEffect(() => {
        fetchMe();
    }, [check]);

    return (
        <>
            <Banner name={"Account"} />
            <div className="container">
                <div className="account-details">
                    <div className="details">
                        <h5>User name</h5>
                        <h5>{me?.firstName} {me?.lastName}</h5>
                    </div>
                    <div className="details">
                        <h5>Email</h5>
                        <h5>{me?.email}</h5>
                    </div>
                    <div className="details">
                        <h5>Avatar</h5>
                        <img className="profile-icon" src={`/user/images/dynamic/users/${me?.avatar}`} width={100} height={100} alt="" />
                    </div>
                    <div className="btns">
                        <button onClick={() => openChangeProfile()}>Change Profile</button>
                        <button onClick={() => openChangeAvatar()}>Change Avatar</button>
                        <button onClick={() => openChangePassword()}>Change Password</button>
                    </div>
                </div>
            </div>
            <Modal show={showChangeProfile} onHide={() => setShowChangeProfile(!showChangeProfile)}>
                <Modal.Header closeButton>
                    <Modal.Title>Change Profile</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Firstname</Form.Label>
                        <Form.Control type="text" placeholder="Enter first name" name="firstName" value={details.firstName} onChange={(e) => handleChangeProfileDetails(e)} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Lastname</Form.Label>
                        <Form.Control type="text" placeholder="Enter last name" name="lastName" value={details.lastName} onChange={(e) => handleChangeProfileDetails(e)} />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowChangeProfile(false)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={() => handleSubmitChangeProfile()}>
                        Change
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showChangeAvatar} onHide={() => setShowChangeAvatar(!showChangeAvatar)}>
                <Modal.Header closeButton>
                    <Modal.Title>Change Avatar</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="details">
                        <h5>Previous Avatar</h5>
                        <img className="profile-icon" src={`/user/images/dynamic/users/${me?.avatar}`} width={100} height={100} alt="" />
                    </div>
                    <div className="file-input-body my-4">
                        <label className="custom-file-upload">
                            <input type="file" name="avatar" onChange={(e) => setAvatar(e.target.files[0])} />
                            Upload your avatar
                        </label>
                    </div>
                    {avatar && (
                        <div className="details">
                            <h5>New Avatar</h5>
                            <img src={URL.createObjectURL(avatar)} alt="" width={100} height={100} />
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowChangeAvatar(false)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={() => handleSubmitChangeAvatar()}>
                        Change
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showChangePassword} onHide={() => setShowChangePassword(!showChangePassword)}>
                <Modal.Header closeButton>
                    <Modal.Title>Change Password</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Old Password</Form.Label>
                        <Form.Control type="password" placeholder="Enter old password" name="oldPassword" onChange={(e) => handleChangePassword(e)} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>New Password</Form.Label>
                        <Form.Control type="password" placeholder="Enter new password" name="newPassword" onChange={(e) => handleChangePassword(e)} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control type="password" placeholder="Enter confirm password" name="confirmPassword" onChange={(e) => handleChangePassword(e)} />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowChangePassword(false)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={() => handleSubmitChangePassword()}>
                        Change
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}