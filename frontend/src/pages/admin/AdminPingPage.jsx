import React, { useState } from 'react';
import { apiFetch } from '../../services/api';
import Card from '../../components/ui/Card';
import Btn from '../../components/ui/Btn';
import { useToast } from '../../components/shared/ToastProvider';

const AdminPingPage = () => {
    const [url, setUrl] = useState('');
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);
    const toast = useToast();

    const handlePing = async () => {
        if (!url.trim()) {
            return toast('Please enter an URL!', 'warning');
        }
        
        setLoading(true);
        setResult('Pinging ' + url + '...\n');
        
        try {
            const res = await apiFetch('/ping/ping-ok', {
                method: 'POST',
                body: JSON.stringify({ url })
            });
            setResult(prev => prev + '\n' + res.data);
        } catch (err) {
            toast(err.message, 'error');
            setResult(prev => prev + '\nError: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style = {{ maxWidth: "800px", margin: "0 auto", padding: "3rem 1.5rem" }}>
            <h1 style = {{ fontFamily: "var(--fontDisplay)", fontSize: "2rem", marginBottom: "1.5rem" }}>
                Network Ping Tool
            </h1>
            
            <Card style = {{ padding: "1.5rem" }}>
                <p style = {{ color: "var(--textMuted)", marginBottom: "1rem", fontSize: "14px" }}>
                    Test internet latency from server to a website or IP address
                </p>
                
                <div style = {{ display: "flex", gap: "1rem", marginBottom: "1.5rem" }}>
                    <input 
                        type = "text" 
                        placeholder = "Enter a domain or IP (For example: google.com)" 
                        value = {url}
                        onChange = {(e) => setUrl(e.target.value)}
                        onKeyDown = {(e) => e.key === 'Enter' && handlePing()}
                        style = {{ flex: 1 }}
                    />
                    <Btn onClick={handlePing} disabled={loading}>
                        {loading ? "Pending..." : "Ping Server"}
                    </Btn>
                </div>

                <div style = {{
                    background: "#0f0f11",
                    color: "#22c55e",
                    padding: "1rem",
                    borderRadius: "8px",
                    border: "1px solid var(--border)",
                    minHeight: "250px",
                    fontFamily: "monospace",
                    whiteSpace: "pre-wrap",
                    fontSize: "13px",
                    overflowX: "auto"
                }}>
                    {result || '> Ready. Enter an address and click Ping...'}
                </div>
            </Card>
        </div>
    );
};

export default AdminPingPage;