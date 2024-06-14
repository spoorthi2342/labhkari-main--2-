/* eslint-disable react-hooks/rules-of-hooks */
'use client';
import React, { useEffect, useState } from 'react';
import Dropzone, { DropzoneOptions } from 'react-dropzone';

const page: React.FC = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [ratings, setRatings] = useState('');
    const [tags, setTags] = useState('');
    const [gst, setGst] = useState('');
    const [weight, setWeight] = useState('');
    const [files, setFiles] = useState<File[]>([]);
    const dropzoneOptions: DropzoneOptions = { accept: 'image/*' as unknown as DropzoneOptions['accept'] };


    useEffect(() => {
        const isAdmin = localStorage.getItem('adminLoggedIn') === 'true';

        if (!isAdmin) {
            window.location.href = '/'; // Redirect to home page
            return; // Prevent rendering the rest of the component
        }
    }, []);

    const handleImageDrop = (acceptedFiles: File[]) => {
        setFiles(acceptedFiles);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const url = process.env.NEXT_PUBLIC_SERVER_URL + "/product/add";

        if (files.length === 0) {
            alert("Please select file");
            return;
        }

        if (files.length > 2) {
            alert("Can't upload more than 2 files");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("title", title);
            formData.append("description", description);
            formData.append("price", price);
            formData.append("ratings", ratings);
            formData.append("tag", tags);
            formData.append("gst", gst);
            formData.append("weight", weight);
            files.forEach((file, index) => {
                formData.append(`s3Images`, file);
            });

            const response = await fetch(url, {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                console.log('Product added successfully!');
                alert('Product added successfully');
            } else {
                console.error('Failed to add product:', response);
                alert('Failed to add product:');
            }
        } catch (error) {
            console.error('Error adding product:', error);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6 text-center">Add Product</h1>
            <form onSubmit={handleSubmit} className="space-y-4" encType='multipart/form-data'>
                <div className="flex flex-wrap gap-4 justify-center">
                    <div className="w-full md:w-1/2 lg:w-1/3 p-4 bg-white rounded-lg shadow-md">
                        <label className="block mb-1 text-gray-600">Title:</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-500"
                            placeholder="Enter product title"
                        />
                    </div>
                    <div className="w-full md:w-1/2 lg:w-1/3 p-4 bg-white rounded-lg shadow-md">
                        <label className="block mb-1 text-gray-600">Description:</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-500"
                            placeholder="Enter product description"
                        ></textarea>
                    </div>
                    <div className="w-full md:w-1/2 lg:w-1/3 p-4 bg-white rounded-lg shadow-md">
                        <label className="block mb-1 text-gray-600">Price:</label>
                        <input
                            type="text"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-500"
                            placeholder="Enter product price"
                        />
                    </div>
                    <div className="w-full md:w-1/2 lg:w-1/3 p-4 bg-white rounded-lg shadow-md">
                        <label className="block mb-1 text-gray-600">Ratings:</label>
                        <input
                            type="text"
                            value={ratings}
                            onChange={(e) => setRatings(e.target.value)}
                            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-500"
                            placeholder="Enter product ratings"
                        />
                    </div>
                    <div className="w-full md:w-1/2 lg:w-1/3 p-4 bg-white rounded-lg shadow-md">
                        <label className="block mb-1 text-gray-600">Tags:</label>
                        <input
                            type="text"
                            value={tags}
                            onChange={(e
                            ) => setTags(e.target.value)}
                            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-500"
                            placeholder="Enter product tags"
                        />
                    </div>
                    <div className="w-full md:w-1/2 lg:w-1/3 p-4 bg-white rounded-lg shadow-md">
                        <label className="block mb-1 text-gray-600">GST:</label>
                        <input
                            type="text"
                            value={gst}
                            onChange={(e) => setGst(e.target.value)}
                            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-500"
                            placeholder="Enter GST percentage"
                        />
                    </div>
                    <div className="w-full md:w-1/2 lg:w-1/3 p-4 bg-white rounded-lg shadow-md">
                        <label className="block mb-1 text-gray-600">Weight:</label>
                        <input
                            type="text"
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-500"
                            placeholder="Enter Weight of product"
                        />
                    </div>
                    <div className="w-full md:w-1/2 lg:w-1/3 p-4 bg-white rounded-lg shadow-md">
                        <Dropzone onDrop={handleImageDrop} {...dropzoneOptions} maxFiles={2}>
                            {({ getRootProps, getInputProps }) => (
                                <div {...getRootProps({ className: "dropzone" })}>
                                    <input {...getInputProps()} />
                                    <p>Drag  drop some files here, or click to select files</p>
                                    <em>(2 files are the maximum number of files you can drop here)</em>
                                </div>
                            )}
                        </Dropzone>
                    </div>
                </div>
                <div className="flex justify-center">
                    <button
                        type="submit"
                        className="bg-blue-500 text-white py-2 px-8 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    >
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
};

export default page;
