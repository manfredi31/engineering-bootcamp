import { Img } from "react-image"
import placeholder from '../assets/placeholder.png';

const Avatar = () => {
    return (

        <Img
            className="rounded-full"
            height="30"
            width="30"
            alt="Avatar"
            src={placeholder}
        />


    )
}

export default Avatar