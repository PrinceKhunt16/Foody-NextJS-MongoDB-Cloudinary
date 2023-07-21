import { useState } from "react";
import { checkConfirmPassword, checkEmail, checkImage, checkPassword, checkText } from "@/utils/validator";
import { notifyError, notifySuccess } from "@/utils/notify";
import { useRouter } from "next/router";
import Link from "next/link";
import Banner from "@/components/user/Banner";

export default function Register() {
    const router = useRouter()
    const [user, setUser] = useState({ firstName: '', lastName: '', avatar: '', email: '', password: '', confirmPassword: '' });
    const [validPassword, setValidPassword] = useState({ uppercase: false, lowercase: false, digit: false, specialCharacters: false });

    const handleChange = (e) => {
        if (e.target.name === 'password') {
            const regex = { uppercase: /[A-Z]/, lowercase: /[a-z]/, digit: /\d/, specialCharacters: /[@!#]/ };
            const newValidPassword = { uppercase: false, lowercase: false, digit: false, specialCharacters: false };

            for (const key in regex) {
                newValidPassword[key] = regex[key].test(e.target.value)
            }

            setValidPassword(newValidPassword)
        }

        if (e.target.name === 'avatar') {
            setUser({
                ...user,
                avatar: e.target.files[0]
            });
        } else {
            setUser({
                ...user,
                [e.target.name]: e.target.value
            });
        }
    }

    const checkAllFieldsValidation = () => {
        const fields = {
            firstName: checkText("Firstname", user.firstName, 2, 20, true),
            lastName: checkText("Lastname", user.lastName, 2, 20, true),
            avatar: checkImage("Avatar", user.avatar),
            email: checkEmail(user.email),
            password: checkPassword(user.password, true),
            confirmPassword: checkConfirmPassword(user.password, user.confirmPassword),
        }

        for (const field in fields) {
            if (fields[field].error) {
                notifyError(fields[field].message);
                return true;
            }
        }

        return false;
    }

    const uploadImageByMulter = async () => {
        try {
            const formData = new FormData()
            formData.append("avatar", user.avatar)

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

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (checkAllFieldsValidation()) {
            return;
        }

        const avatarResponse = await uploadImageByMulter()

        if (avatarResponse.error) {
            notifyError("Error occured while uploading avatar.")
            return
        }

        try {
            const registerResponse = await fetch(`${process.env.API_BASE_URL}/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    ...user,
                    avatar: avatarResponse.avatar
                })
            });

            const registerData = await registerResponse.json();

            if (registerData.success) {
                notifySuccess(registerData.message);
                router.push("/auth/login");
            } else {
                await fetch(`${process.env.API_BASE_URL}/multer/deleteimage/${avatarResponse.avatar}`, {
                    method: "DELETE"
                });

                notifyError(registerData.message);
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <Banner name={"Register"} />
            <div className="container">
                <div className="form-body">
                    <form onSubmit={(e) => handleSubmit(e)}>
                        <div className="form-group">
                            <label for="firstName">Firstname</label>
                            <input type="text" id="firstName" name="firstName" onChange={(e) => handleChange(e)} />
                        </div>
                        <div className="form-group">
                            <label for="lastName">Lastname</label>
                            <input type="text" id="lastName" name="lastName" onChange={(e) => handleChange(e)} />
                        </div>
                        <div className="form-group">
                            <label for="avatar">Avatar</label>
                            <div className="file-input-body">
                                <label className="custom-file-upload">
                                    <input type="file" name="avatar" onChange={(e) => handleChange(e)} />
                                    Upload your avatar
                                </label>
                                {user.avatar && (
                                    <img src={URL.createObjectURL(user.avatar)} alt="" />
                                )}
                            </div>
                        </div>
                        <div className="form-group">
                            <label for="email">Email</label>
                            <input type="text" id="email" name="email" onChange={(e) => handleChange(e)} />
                        </div>
                        <div className="form-group">
                            <label for="password">Password</label>
                            <input type="password" id="password" name="password" onChange={(e) => handleChange(e)} />
                            <div className="strong-password-suggestion">
                                <p className={validPassword.uppercase ? "valid-strong-password" : "wrong-strong-password"}>A-Z</p>
                                <p className={validPassword.lowercase ? "valid-strong-password" : "wrong-strong-password"}>a-z</p>
                                <p className={validPassword.digit ? "valid-strong-password" : "wrong-strong-password"}>0-9</p>
                                <p className={validPassword.specialCharacters ? "valid-strong-password" : "wrong-strong-password"}>@ ! #</p>
                            </div>
                        </div>
                        <div className="form-group">
                            <label for="confirmPassword">Confirm Password</label>
                            <input type="password" id="confirmPassword" name="confirmPassword" onChange={(e) => handleChange(e)} />
                        </div>
                        <div className="form-group">
                            <input type="submit" value="Register" />
                        </div>
                        <div className="form-group">
                            <p>If you are already registered here. <br /> Please proceed to the <Link href="./login">Login</Link> to access your account.</p>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}