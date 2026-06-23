import React, { useState, useRef } from 'react';
import Card from '../../components/ui/Card';
import Btn from '../../components/ui/Btn';
import { useToast } from '../../components/shared/ToastProvider';

const UploadPage = () => {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    
    const fileInputRef = useRef(null);
    const toast = useToast();

    const uploadFile = async () => {
        if (!file) {
            return toast("Choose a file to upload!", "warning");
        }

        setLoading(true);
        setMessage('');
        
        const formData = new FormData();
        formData.append('file', file);

        try {
            const token = localStorage.getItem("token");
            
            const response = await fetch('http://localhost:5000/api/uploadFile/upload', {
                method: 'POST',
                headers: {
                    ...(token ? { Authorization: `Bearer ${token}` } : {})
                },
                body: formData
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || "Upload failed");
            }

            setMessage(JSON.stringify(data, null, 2));
            toast("Upload!");
            
        } catch (err) {
            toast(err.message, "error");
            setMessage(`Error: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: "600px", margin: "0 auto", padding: "3rem 1.5rem" }}>
            <h1 style={{ fontFamily: "var(--fontDisplay)", fontSize: "2rem", marginBottom: "1.5rem" }}>
                File Upload Testing
            </h1>
            <p style={{ color: "var(--textMuted)", marginBottom: "2rem", fontSize: "14px" }}>
                Upload file feature test tool (Local/CTF environment).
            </p>

            <Card style={{ padding: "2rem" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                    
                    <div>
                        <label style={{ fontSize: "13px", color: "var(--textMuted)", display: "block", marginBottom: "0.5rem" }}>
                            Choose a file to upload
                        </label>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={(e) => setFile(e.target.files[0])}
                            style={{ 
                                background: "var(--surface)", 
                                border: "1px dashed var(--border)", 
                                padding: "0.75rem", 
                                borderRadius: "8px",
                                width: "100%",
                                color: "var(--text)",
                                cursor: "pointer"
                            }}
                        />
                    </div>

                    <Btn 
                        onClick={uploadFile} 
                        disabled={loading || !file}
                        style={{ width: "100%" }}
                    >
                        {loading ? "Pending ..." : "Upload"}
                    </Btn>

                    {message && (
                        <div style={{ marginTop: "1rem" }}>
                            <label style={{ fontSize: "13px", color: "var(--textMuted)", display: "block", marginBottom: "0.5rem" }}>
                                Result: (Response)
                            </label>
                            <pre style={{
                                background: "#0f0f11",
                                padding: "1rem",
                                borderRadius: "8px",
                                border: "1px solid var(--border)",
                                color: "var(--info)",
                                fontFamily: "monospace",
                                fontSize: "13px",
                                overflowX: "auto",
                                whiteSpace: "pre-wrap"
                            }}>
                                {message}
                            </pre>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
}

export default UploadPage;