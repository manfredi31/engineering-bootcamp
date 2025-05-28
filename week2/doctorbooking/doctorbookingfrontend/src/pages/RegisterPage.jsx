import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { Link } from "react-router-dom"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

function RegisterPage () {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [role, setRole] = useState("doctor")
    const navigate = useNavigate();

    const registerMutation = useMutation(
        {
            mutationFn: async ({email, password, role}) => {
                const res = await axios.post(
                    "http://127.0.0.1:5000/auth/register",
                    {email, password, role});
                return res.data},
            onSuccess: () => {
                navigate('/login')},
            onError: (error) => {
                console.error("Registration failed:", error.response?.data);
                alert("Registration failed: " + error.response?.data?.error);
        }})
    
    function handleSubmit(e) {
        e.preventDefault();
        registerMutation.mutate({email, password, role});
    }

    return (
        <div className="min-h-screen flex items-center justify-center">
            <Card className="w-full max-w-md mx-auto p-6">
                <CardHeader>
                    <CardTitle className="text-2xl">Register</CardTitle>
                    <CardDescription>
                        Create an account to book appointments
                    </CardDescription>
                </CardHeader>
                
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="role">Role</Label>
                            <Select value={role} onValueChange={setRole}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select your role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="doctor">Doctor</SelectItem>
                                    <SelectItem value="patient">Patient</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        
                        <Button
                            type="submit"
                            disabled={registerMutation.isPending}
                            className="w-full mt-6"
                        >
                            {registerMutation.isPending ? "Registering..." : "Register"}
                        </Button>
                        
                        <div className="text-center text-sm text-muted-foreground mt-4">
                            Already have an account?{" "}
                            <Link
                                to="/login"
                                className="text-primary hover:text-primary/90 underline font-medium"
                            >
                                Login here
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

export default RegisterPage;