import { Img } from "react-image"
import { useNavigate } from "react-router-dom"
import logo from '../../assets/logo.png';

const Logo = () => {
    const navigate = useNavigate()

    return (
        <Img
            alt="Logo"
            className="hidden md:block cursor-pointer"
            height="150"
            width="150"
            src={logo}
        />
    )

}

export default Logo