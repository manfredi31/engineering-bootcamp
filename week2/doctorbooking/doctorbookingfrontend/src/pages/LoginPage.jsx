import { useState } from 'react'
import { useMutation } from "@tanstack/react-query";
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { useAuth } from '../context/auth/AuthContext';

function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [role, setRole] = useState("doctor");
    
    const { login } = useAuth();

    const loginMutation = useMutation({
        mutationFn: async ({ email, password, role }) => {
            const res = await axios.post("http://127.0.0.1:5000/auth/login", {
                email,
                password,
                role,
            });
            return res.data;
        },
        onSuccess: (data) => {
            login(data.access_token, data.user_id, data.role);
        },
        onError: (error) => {
            console.error("Login failed:", error.response?.data);
            alert("Login failed: " + error.response?.data?.error);
        },
    });

    function handleSubmit(e) {
        e.preventDefault();
        console.log("Logging in with:", email, password);
        loginMutation.mutate({ email, password, role });
    }

    return ( 
        <div className="min-h-screen flex items-center justify-center">
            <Card className="w-full max-w-md mx-auto p-6">
                <CardHeader>
                    <CardTitle className="text-2xl">Login</CardTitle>
                    <CardDescription>
                        Please log in to book appointment
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
                            <select 
                                id="role"
                                value={role} 
                                onChange={(e) => setRole(e.target.value)}
                                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <option value="doctor">Doctor</option>
                                <option value="patient">Patient</option>
                            </select>
                        </div>
                        
                        <Button 
                            type="submit" 
                            disabled={loginMutation.isPending}
                            className="w-full mt-6"
                        >
                            {loginMutation.isPending ? "Logging in..." : "Login"}
                        </Button>
                        
                        <div className="text-center text-sm text-muted-foreground mt-4">
                            Do not have an account yet?{" "}
                            <Link 
                                to="/register" 
                                className="text-primary hover:text-primary/90 underline font-medium"
                            >
                                Create one here
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
        );
    }

export default LoginPage