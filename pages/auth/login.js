import { useState } from "react";
import { useRouter } from "next/router";
import { notifyError, notifySuccess } from "@/utils/notify";
import Link from "next/link";
import Banner from "@/components/user/Banner";

export default function Login() {
    const router = useRouter();
    const [user, setUser] = useState({ email: 'cebete3060@peogi.com', password: 'qweqweqwe' });

    const handleChange = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const loginResponse = await fetch(`${process.env.API_BASE_URL}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    ...user
                })
            });

            const loginData = await loginResponse.json();

            if (loginData.success) {
                notifySuccess(loginData.message);
                router.push("/profile/account");
            } else {
                notifyError(loginData.message);
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <Banner name={"Login"} />
            <div className="container">
                <div className="form-body">
                    <form onSubmit={(e) => handleSubmit(e)}>
                        <div className="form-group">
                            <label for="email">Email</label>
                            <input type="text" id="email" name="email" value={user.email} onChange={(e) => handleChange(e)} />
                        </div>
                        <div className="form-group">
                            <label for="password">Password</label>
                            <input type="password" id="password" name="password" value={user.password} onChange={(e) => handleChange(e)} />
                        </div>
                        <div className="form-group">
                            <input type="submit" value="Login" />
                        </div>
                        <div className="form-group">
                            <p>Oops! It seems like you are not registered. <br /> Please <Link href="./register">Register</Link> to create an account.</p>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}