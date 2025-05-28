import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
// import { DatePicker } from "@/components/ui/datepicker"; // Assuming you might have or add this

const MyProfilePatient = ({ patientId }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        fullname: '',
        email: '', // Email might be read-only
        phone: '',
        address: '',
        gender: '',
        birthday: '', // Format: YYYY-MM-DD
        image: null, // For file input
    });
    const [previewImage, setPreviewImage] = useState(null);
    const queryClient = useQueryClient();

    const API_BASE_URL = 'http://127.0.0.1:5000/api'; // Or from env var

    console.log("MyProfilePatient rendered/re-rendered with patientId:", patientId); // Added for debugging patientId stability

    // Fetch patient data
    const {data: patientData, isLoading, isError, error, refetch } = useQuery({
        queryKey: ['patientProfile', patientId],
        queryFn: async () => {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_BASE_URL}/patients/${patientId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log('Full Axios response (inside queryFn):', response.data);
            return response.data;
        },
        enabled: !!patientId, // Only run if patientId is available
        onError: (err) => { // It's good practice to keep an onError handler
            console.error("React Query Error in MyProfilePatient useQuery:", err);
            alert("Error fetching patient profile: " + (err.message || "Unknown error"));
        }
    });

    // ADDED: useEffect to update form data when patientData is available
    useEffect(() => {
        if (patientData) {
            console.log("useEffect reacting to patientData change:", patientData);
            setFormData({
                fullname: patientData.fullname || '',
                email: patientData.email || '',
                phone: patientData.phone || '',
                address: patientData.address || '',
                gender: patientData.gender || '',
                birthday: patientData.birthday || '', // Assuming backend sends YYYY-MM-DD
                image: null, // Clear file input on new data load
            });
            setPreviewImage(patientData.image_url || null);
        }
    }, [patientData]); // Dependency array ensures this runs when patientData changes

    // Mutation for updating patient data
    const updateProfileMutation = useMutation({
        mutationFn: async (profileData) => {
            const token = localStorage.getItem('token');
            // FormData is used for multipart/form-data (if image is included)
            const dataToSubmit = new FormData();
            Object.keys(profileData).forEach(key => {
                if (profileData[key] !== null && profileData[key] !== undefined) {
                    dataToSubmit.append(key, profileData[key]);
                }
            });
            
            const response = await axios.post(`${API_BASE_URL}/patients/${patientId}/edit`, dataToSubmit, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        },
        onSuccess: () => {
            alert('Profile updated successfully!');
            setIsEditing(false);
            queryClient.invalidateQueries(['patientProfile']);
        },
        onError: (err) => {
            console.error("Profile update failed:", err.response?.data);
            alert("Profile update failed: " + (err.response?.data?.error || "Unknown error"));
        },
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setFormData(prev => ({ ...prev, image: file }));
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const { email, ...dataToSubmit } = formData; // Exclude email if it's not editable
        updateProfileMutation.mutate(dataToSubmit);
    };

    if (isLoading) return <div>Loading patient profile...</div>;
    if (isError) return <div>Error loading profile: {error.message}</div>;
    if (!patientData) return <div>No profile data found.</div>

    return (
        <div className="container mx-auto p-4 max-w-2xl">
            <Card>
                <CardHeader className="flex flex-row justify-between items-center">
                    <div>
                        <CardTitle className="text-2xl">My Profile (Patient)</CardTitle>
                        <CardDescription>View and update your personal information.</CardDescription>
                    </div>
                    {!isEditing && (
                        <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
                    )}
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {previewImage && (
                            <div className="flex justify-center mb-4">
                                <img src={previewImage} alt="Profile" className="rounded-full w-32 h-32 object-cover" />
                            </div>
                        )}
                        {isEditing && (
                             <div className="space-y-2">
                                <Label htmlFor="image">Profile Picture</Label>
                                <Input 
                                    id="image"
                                    name="image"
                                    type="file"
                                    onChange={handleImageChange} 
                                    className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                />
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="fullname">Full Name</Label>
                                <Input id="fullname" name="fullname" value={formData.fullname} onChange={handleInputChange} disabled={!isEditing} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" name="email" type="email" value={formData.email} disabled /* Email usually not editable */ />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone</Label>
                                <Input id="phone" name="phone" value={formData.phone} onChange={handleInputChange} disabled={!isEditing} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="address">Address</Label>
                                <Input id="address" name="address" value={formData.address} onChange={handleInputChange} disabled={!isEditing} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="gender">Gender</Label>
                                {/* Consider using a select for gender */}
                                <Input id="gender" name="gender" value={formData.gender} onChange={handleInputChange} disabled={!isEditing} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="birthday">Birthday</Label>
                                <Input id="birthday" name="birthday" type="date" value={formData.birthday} onChange={handleInputChange} disabled={!isEditing} placeholder="YYYY-MM-DD" />
                            </div>
                        </div>

                        {isEditing && (
                            <CardFooter className="flex justify-end gap-2 pt-6">
                                <Button variant="outline" onClick={() => { setIsEditing(false); refetch(); /* Reset form */ }}>Cancel</Button>
                                <Button type="submit" disabled={updateProfileMutation.isPending}>
                                    {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
                                </Button>
                            </CardFooter>
                        )}
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default MyProfilePatient; 