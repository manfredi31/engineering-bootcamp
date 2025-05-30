import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const useCurrentUser = () => {
    return useQuery({
        queryKey: ["currentUser"],
        queryFn: async () => {
            const res = await axios.get("http://127.0.0.1:5000/auth/me", {withCredentials: true});
            return res.data;
        },
        retry: false,
    })
}

export default useCurrentUser