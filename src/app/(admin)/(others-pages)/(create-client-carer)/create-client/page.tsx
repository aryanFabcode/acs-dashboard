// CreateClientForm.tsx
"use client";
import ComponentCard from "@/components/common/ComponentCard";
import Form from "@/components/form/Form";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { useCreateClientMutation } from "@/lib/redux/api/clientApi";
import React, { useState } from "react";

const CreateClientForm = () => {
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        address: "",
        zip: "",
        password: "",
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const [createClient, { isLoading, isSuccess, isError }] = useCreateClientMutation();

    // Validation function
    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^\+\d{1,15}$/;

        // Required fields validation
        if (!formData.name.trim()) newErrors.name = "Name is required";
        if (!formData.address.trim()) newErrors.address = "Address is required";
        if (!formData.zip.trim()) newErrors.zip = "Postal code is required";

        if (!formData.phone.trim()) {
            newErrors.phone = "Phone is required";
        } else if (!phoneRegex.test(formData.phone)) {
            newErrors.phone = "Invalid phone format";
        }
        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = "Invalid email format";
        }
        if (!formData.password) newErrors.password = "Password is required";
        // Add validations for other fields as needed...

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;
        try {
            await createClient(formData).unwrap();
            setFormData({
                name: "",
                phone: "",
                email: "",
                address: "",
                zip: "",
                password: "",
            });
        } catch (error) {
            console.error("Creation failed:", error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user starts typing
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
    };

    return (
        <ComponentCard title="Create New Client">
            <Form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="col-span-full">
                        <Label>Full Name</Label>
                        <Input
                            type="text"
                            name="name"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={handleChange}
                            error={!!errors.name}
                            hint={errors.name}
                            required
                        />
                    </div>

                    <div>
                        <Label>Phone Number</Label>
                        <Input
                            type="tel"
                            name="phone"
                            placeholder="+91 1234567890"
                            value={formData.phone}
                            onChange={handleChange}
                            error={!!errors.phone}
                            hint={errors.phone}
                            required
                        />
                    </div>

                    <div>
                        <Label>Email Address</Label>
                        <Input
                            type="email"
                            name="email"
                            placeholder="john@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            error={!!errors.email}
                            hint={errors.email}
                            required
                        />
                    </div>

                    <div className="col-span-full">
                        <Label>Address</Label>
                        <Input
                            type="text"
                            name="address"
                            placeholder="123 Main Street, City"
                            value={formData.address}
                            onChange={handleChange}
                            error={!!errors.address}
                            hint={errors.address}
                            required
                        />
                    </div>

                    <div>
                        <Label>Zip Code</Label>
                        <Input
                            type="text"
                            name="zip"
                            placeholder="CV18CQ"
                            value={formData.zip}
                            onChange={handleChange}
                            error={!!errors.zip}
                            hint={errors.zip}
                            required
                        />
                    </div>

                    <div>
                        <Label>Password</Label>
                        <Input
                            type="password"
                            name="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                            error={!!errors.password}
                            hint={errors.password}
                            required
                        />
                    </div>

                    <div className="col-span-full">
                        <Button
                            type="submit"
                            size="sm"
                            className="w-full"
                            disabled={isLoading}
                        >
                            {isLoading ? "Creating..." : "Create Client"}
                        </Button>

                        {isSuccess && (
                            <p className="mt-3 text-sm text-success-500">
                                Client created successfully!
                            </p>
                        )}

                        {isError && (
                            <p className="mt-3 text-sm text-error-500">
                                Error creating client. Please try again.
                            </p>
                        )}
                    </div>
                </div>
            </Form>
        </ComponentCard>
    );
};

export default CreateClientForm;