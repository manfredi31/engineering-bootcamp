import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from 'axios';
import toast from "react-hot-toast";

const useLogout = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () =>
            axios.post("http://127.0.0.1:5000/auth/logout", {}, { withCredentials: true }),
        onSuccess: () => {
            toast.success("Logged out!");
            queryClient.invalidateQueries({ queryKey: ["currentUser"]});
            
        },
        onError: () => {
            toast.error("Logout failed");
        }, 
    });
};

export default useLogout;