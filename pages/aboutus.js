import Banner from "@/components/user/Banner";
import About from "@/components/user/home/About";
import FirmVisit from "@/components/user/home/FirmVisit";
import OurFitures from "@/components/user/home/OurFitures";

export default function AboutUs() {
    return (
        <>
            <Banner name={"About Us"} />
            <About />
            <OurFitures />
            <FirmVisit />
        </>
    )
}