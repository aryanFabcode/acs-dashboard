// CreateCarerForm.tsx
"use client";
import React, { useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import { useCreateCarerMutation } from "@/lib/redux/api/carersApi";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import MultiSelect from "@/components/form/MultiSelect";
import TextArea from "@/components/form/input/TextArea";
import Button from "@/components/ui/button/Button";
import Form from "@/components/form/Form";

const CreateCarerForm = () => {
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        password: "",
        profile_image: "",
        doc_dbs: "",
        doc_rtw_uk: "",
        doc_training_certificates: "",
        doc_cqc_registration: "",
        reference_email: "",
        skills: [],
        care_types: [],
        languages: [],
        has_own_car: 0,
        get_to_work_by: "",
        event_chaperoning: "",
        holiday_chaperoning: "",
        can_drive_patients: 0,
        about_me: "",
        title: "",
        gender: "",
        own_car: false,
        total_experience: 0,
        digital_signature: "",
        experience: [],
        experience_with_conditions: [],
        hobbies: [],
        pet_preferences: [],
        charges: "",
        carer_type: "",
        hourly_rate: 0,
        live_in_rate: 0,
        certificates: [],
        training_certificate: "",
        travel_receipt: "",
        otp: "",
        otpExpiresAt: "",
        point_address: {
            latitude: 0,
            longitude: 0,
            address: "",
        },
        status: "active",
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const [createCarer, { isLoading, isSuccess, isError }] = useCreateCarerMutation();

    // Validation function
    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^\+\d{1,15}$/;

        // Required fields validation
        if (!formData.name.trim()) newErrors.name = "Name is required";
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
        if (formData.skills.length === 0) newErrors.skills = "At least one skill is required";
        if (formData.care_types.length === 0) newErrors.care_types = "At least one care type is required";
        if (!formData.about_me.trim()) newErrors.about_me = "About me is required";
        if (!formData.gender) newErrors.gender = "Gender is required";
        if (formData.hourly_rate <= 0) newErrors.hourly_rate = "Hourly rate must be greater than 0";
        // Add validations for other fields as needed...

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;
        try {
            await createCarer(formData).unwrap();
            setFormData({
                ...formData,
                name: "",
                phone: "",
                email: "",
                password: "",
            });
        } catch (error) {
            console.error("Creation failed:", error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // Clear error when user starts typing
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
    };

    const handleMultiSelectChange = (name: string, values: string[]) => {
        setFormData((prev) => ({ ...prev, [name]: values }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
    };

    const handleCheckboxChange = (name: string, checked: boolean) => {
        setFormData((prev) => ({ ...prev, [name]: checked }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <ComponentCard title="Create New Carer">
            <Form
                onSubmit={handleSubmit}
            >
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    {/* Basic Information */}
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
                            placeholder="+1234567890"
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
                            placeholder="johndoe@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            error={!!errors.email}
                            hint={errors.email}
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

                    {/* Skills */}
                    <div className="col-span-full">
                        <Label>Skills</Label>
                        <MultiSelect
                            label="Select Skills"
                            options={[
                                { value: "First Aid", text: "First Aid", selected: false },
                                { value: "Elderly Care", text: "Elderly Care", selected: false },
                            ]}
                            onChange={(values) => handleMultiSelectChange("skills", values)}
                            error={!!errors.skills}
                        />
                        {errors.skills && (
                            <p className="mt-1 text-sm text-error-500">{errors.skills}</p>
                        )}
                    </div>

                    {/* Care Types */}
                    <div className="col-span-full">
                        <Label>Care Types</Label>
                        <MultiSelect
                            label="Select Care Types"
                            options={[
                                { value: "residential", text: "Residential", selected: false },
                                { value: "domiciliary", text: "Domiciliary", selected: false },
                            ]}
                            onChange={(values) => handleMultiSelectChange("care_types", values)}
                            error={!!errors.care_types}
                        />
                        {errors.care_types && (
                            <p className="mt-1 text-sm text-error-500">{errors.care_types}</p>
                        )}
                    </div>

                    {/* About Me */}
                    <div className="col-span-full">
                        <Label>About Me</Label>
                        <TextArea
                            name="about_me"
                            placeholder="Passionate caregiver with 5 years of experience."
                            value={formData.about_me}
                            onChange={handleChange}
                            rows={4}
                            error={!!errors.about_me}
                            hint={errors.about_me}
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="col-span-full">
                        <Button
                            // type="submit"
                            size="sm"
                            className="w-full"
                            disabled={isLoading}
                        >
                            {isLoading ? "Creating..." : "Create Carer"}
                        </Button>

                        {isSuccess && (
                            <p className="mt-3 text-sm text-success-500">
                                Carer created successfully!
                            </p>
                        )}

                        {isError && (
                            <p className="mt-3 text-sm text-error-500">
                                Error creating carer. Please try again.
                            </p>
                        )}
                    </div>
                </div>
            </Form>
        </ComponentCard>
    );
};

export default CreateCarerForm;