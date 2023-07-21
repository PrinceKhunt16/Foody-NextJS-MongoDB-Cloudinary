import Banner from "@/components/user/Banner";

export default function NotFound() {
    return (
        <>
            <Banner name={"404"} />
            <div className="container my-5">
                <h1>You didn't break the internet, but we can't find what you are looking for.</h1>
            </div>
        </>
    )
}