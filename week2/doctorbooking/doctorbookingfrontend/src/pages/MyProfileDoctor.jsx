import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"; // For bio
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // For specialty
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

// Assuming Specialty enum values from backend - this should ideally be dynamically fetched or kept in sync
const specialties = [
    "General Physician", "Gynecologist", "Dermatologist", 
    "Pediatrician", "Neurologist", "Gastroenterologist"
];

const MyProfileDoctor = ({ doctorId }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        fullname: '',
        email: '', // Read-only
        specialty: '',
        bio: '',
        years_of_experience: '',
        appointment_fee: '',
        image: null, // For file input
    });
    const [previewImage, setPreviewImage] = useState(null);

    const API_BASE_URL = 'http://127.0.0.1:5000/api';

    console.log("MyProfileDoctor rendered/re-rendered with doctorId:", doctorId); // Added for debugging doctorId stability

    // Fetch doctor data
    const { data: doctorData, isLoading, isError, error, refetch } = useQuery({
        queryKey: ['doctorProfile', doctorId],
        queryFn: async () => {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_BASE_URL}/doctors/${doctorId}`, {
                 headers: { Authorization: `Bearer ${token}` }, 
            });
            console.log('Full Axios response (inside queryFn for doctor):', response.data); // Clarified log
            return response.data;
        },
        enabled: !!doctorId,
        // REMOVED onSuccess callback
        onError: (err) => { // Keep onError for query issues
            console.error("React Query Error in MyProfileDoctor useQuery:", err);
            alert("Error fetching doctor profile: " + (err.message || "Unknown error"));
        }
    });

    // ADDED: useEffect to update form data when doctorData is available
    useEffect(() => {
        if (doctorData) {
            console.log("useEffect reacting to doctorData change:", doctorData);
            setFormData({
                fullname: doctorData.fullname || '',
                email: doctorData.email || '', // Email is typically read-only
                specialty: doctorData.specialty || '',
                bio: doctorData.bio || '',
                years_of_experience: doctorData.years_of_experience || '',
                appointment_fee: doctorData.appointment_fee || '',
                image: null, // Clear file input on new data load
            });
            setPreviewImage(doctorData.image_url || null);
        }
    }, [doctorData]); // Dependency array ensures this runs when doctorData changes

    // Mutation for updating doctor data
    const updateProfileMutation = useMutation({
        mutationFn: async (profileData) => {
            const token = localStorage.getItem('token');
            const dataToSubmit = new FormData();
            Object.keys(profileData).forEach(key => {
                if (profileData[key] !== null && profileData[key] !== undefined) {
                    dataToSubmit.append(key, profileData[key]);
                }
            });

            const response = await axios.post(`${API_BASE_URL}/doctors/${doctorId}/edit`, dataToSubmit, {
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
            refetch();
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

    const handleSpecialtyChange = (value) => {
        setFormData(prev => ({ ...prev, specialty: value }));
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
        const { email, ...dataToSubmit } = formData; // Exclude email
        updateProfileMutation.mutate(dataToSubmit);
    };

    if (isLoading) return <div>Loading doctor profile...</div>;
    if (isError) return <div>Error loading profile: {error.message}</div>;
    if (!doctorData) return <div>No profile data found.</div>;

    return (
        <div className="container mx-auto p-4 max-w-2xl">
            <Card>
                <CardHeader className="flex flex-row justify-between items-center">
                    <div>
                        <CardTitle className="text-2xl">My Profile (Doctor)</CardTitle>
                        <CardDescription>View and update your professional information.</CardDescription>
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
                                <Input id="image" name="image" type="file" onChange={handleImageChange} 
                                       className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="fullname">Full Name</Label>
                                <Input id="fullname" name="fullname" value={formData.fullname} onChange={handleInputChange} disabled={!isEditing} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" name="email" type="email" value={formData.email} disabled />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="specialty">Specialty</Label>
                                {isEditing ? (
                                    <Select name="specialty" value={formData.specialty} onValueChange={handleSpecialtyChange}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select specialty" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {specialties.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                ) : (
                                    <Input value={formData.specialty} disabled />
                                )}
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="years_of_experience">Years of Experience</Label>
                                <Input id="years_of_experience" name="years_of_experience" type="number" value={formData.years_of_experience} onChange={handleInputChange} disabled={!isEditing} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="appointment_fee">Appointment Fee ($)</Label>
                                <Input id="appointment_fee" name="appointment_fee" type="number" step="0.01" value={formData.appointment_fee} onChange={handleInputChange} disabled={!isEditing} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="bio">Bio</Label>
                            <Textarea id="bio" name="bio" value={formData.bio} onChange={handleInputChange} disabled={!isEditing} rows={4} />
                        </div>

                        {isEditing && (
                            <CardFooter className="flex justify-end gap-2 pt-6">
                                <Button variant="outline" onClick={() => { setIsEditing(false); refetch(); }}>Cancel</Button>
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

export default MyProfileDoctor; 