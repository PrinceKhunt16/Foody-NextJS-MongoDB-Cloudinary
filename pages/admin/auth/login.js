import { useState } from "react";
import { useRouter } from "next/router";
import { notifyError, notifySuccess } from "@/utils/notify";

export default function Login() {
    const router = useRouter();
    const [user, setUser] = useState({ email: 'prince180@webmail.rainit.in', password: 'qweqweqwe' });

    const handleChange = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const loginResponse = await fetch(`${process.env.API_BASE_URL}/admin/auth/login`, {
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
                router.push("/admin/dashboard");
            } else {
                notifyError(loginData.message);
            }
        } catch (error) {
            router.push("/");
            console.log(error);
        }
    }

    return (
        <>
            <div className="container mt-5">
                <h1 className="lora-font title">Login</h1>
                <div className="form-body">
                    <form onSubmit={(e) => handleSubmit(e)}>
                        <div className="form-group">
                            <label for="email">Email</label>
                            <input type="text" id="email" name="email" value={user.email} onChange={(e) => handleChange(e)} />
                        </div>
                        <div className="form-group">
                            <label for="password">Password</label>
                            <input type="password" id="password" name="password" value={user.email} onChange={(e) => handleChange(e)} />
                        </div>
                        <div className="form-group">
                            <input type="submit" value="Login" />
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}