"use client" // This component must be a client component

import {
    ImageKitAbortError,
    ImageKitInvalidRequestError,
    ImageKitServerError,
    ImageKitUploadNetworkError,
    upload,
} from "@imagekit/next";
import { useRef, useState } from "react";

// UploadExample component demonstrates file uploading using ImageKit's Next.js SDK.
const UploadFile = async (
    file: File | null,
    authParams: {token: string , expire: number, signature: string, publicKey: string}
) => {

    const abortController = new AbortController();

    
        if(!file) {
            alert("Please select a file to upload");
            return;
        }
    
        if(!authParams) {
            console.error("Failed to authenticate for upload:");
            return;
        }
        const { signature, expire, token, publicKey } = authParams;

        // Call the ImageKit SDK upload function with the required parameters and callbacks.
        try {
            const uploadResponse = await upload({
                
                expire,
                token,
                signature,
                publicKey,
                file,
                fileName: file.name,
                abortSignal: abortController.signal,
            });

            return uploadResponse
        } catch (error) {
            // Handle specific error types provided by the ImageKit SDK.
            if (error instanceof ImageKitAbortError) {
                console.error("Upload aborted:", error.reason);
            } else if (error instanceof ImageKitInvalidRequestError) {
                console.error("Invalid request:", error.message);
            } else if (error instanceof ImageKitUploadNetworkError) {
                console.error("Network error:", error.message);
            } else if (error instanceof ImageKitServerError) {
                console.error("Server error:", error.message);
            } else {
                // Handle any other errors that may occur.
                console.error("Upload error:", error);
            }
        }
};

export default UploadFile;