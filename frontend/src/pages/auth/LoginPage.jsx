import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../store/authSlice';
import { apiFetch } from '../../services/api';
import { useToast } from '../../components/shared/ToastProvider';
import Card from '../../components/ui/Card';
import Btn from '../../components/ui/Btn';

const LoginPage = () => {
    const [form, setForm] = useState({ username: "", password: "", role: "client" });
    const [loading, setLoading] = useState(false);
    
    const [step, setStep] = useState("login");
    const [code, setCode] = useState("");

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const toast = useToast();

    const submit = async () => {
        if (!form.username || !form.password) {
            return toast("Please fill in all fields", "warning");
        }
        setLoading(true);

        try {
            const data = await apiFetch("/auth/login", { 
                method: "POST", 
                body: JSON.stringify(form) 
            });
            
            dispatch(setCredentials({ user: data.user, token: data.token }));
            toast(`Welcome back! Logged in as ${data.user.role}`);
            navigate("/");
        } catch (err) { 
            if (err.message.toLowerCase().includes("verify")) {
                toast("Please verify your email to continue.", "warning");
                setStep("verify");
                handleResend(); 
            } else {
                toast(err.message, "error"); 
            }
        } finally { 
            setLoading(false); 
        }
    };

    const handleVerify = async () => {
        setLoading(true);
        try {
            await apiFetch("/auth/verify", { 
                method: "POST", 
                body: JSON.stringify({ 
                    username: form.username, 
                    verificationCode: code 
                }) 
            });
            toast("Account verified! You can now log in.");
            setStep("login");
            setCode("");
        } catch (err) { 
            toast(err.message, "error"); 
        } 
        finally { 
            setLoading(false); 
        }
    };

    const handleResend = async () => {
        try {
            await apiFetch("/auth/resend-otp", { 
                method: "POST", 
                body: JSON.stringify({ 
                    username: form.username, 
                    role: form.role 
                }) 
            });
            toast("A new verification code has been sent!");
        } catch (err) { 
            toast(err.message, "error"); 
        }
    };

    if (step === "verify") {
        return (
            <div style = {{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Card style = {{ width: "100%", maxWidth: "420px", padding: "2.5rem", textAlign: "center" }}>
                    <div style = {{ fontSize: "3rem", marginBottom: "1rem" }}>
                        📧
                    </div>
                    <h2 style = {{ fontFamily: "var(--fontDisplay)", marginBottom: "1rem" }}>
                        Verify your account
                    </h2>
                    <p style = {{ color: "var(--textMuted)", marginBottom: "2rem", lineHeight: 1.6 }}>
                        We sent a new code to <strong style = {{ color: "var(--text)" }}>{form.username}</strong>. Enter it below to unlock your account.
                    </p>
                    <div style = {{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                        <input 
                            placeholder = "000000" 
                            value = {code} 
                            onChange = {e => setCode(e.target.value)} 
                            style = {{ textAlign: "center", fontSize: "1.5rem", letterSpacing: "0.5rem" }} 
                            maxLength = {6} 
                        />
                        <Btn onClick = {handleVerify} disabled = {loading}>
                            {loading ? "Verifying…" : "Verify Account"}
                        </Btn>
                        <button 
                            onClick = {handleResend} 
                            style = {{ background: "none", border: "none", color: "var(--accent)", fontSize: "13px", cursor: "pointer", marginTop: "0.5rem", textDecoration: "underline" }}
                        >
                            Didn't receive the code? Resend
                        </button>
                        <button 
                            onClick = {() => setStep("login")} 
                            style = {{ background: "none", border: "none", color: "var(--textDim)", fontSize: "13px", cursor: "pointer", marginTop: "1rem" }}
                        >
                            ← Back to Login
                        </button>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div style = {{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
            <Card style = {{ width: "100%", maxWidth: "420px", padding: "2.5rem" }}>
                <h1 style = {{ fontFamily: "var(--fontDisplay)", fontSize: "2rem", marginBottom: "0.5rem", textAlign: "center" }}>
                    Welcome back
                </h1>
                <p style = {{ color: "var(--textMuted)", textAlign: "center", marginBottom: "2rem", fontSize: "14px" }}>
                    Sign in to your account
                </p>
                
                <div style = {{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <div>
                        <label style = {{ fontSize: "12px", color: "var(--textMuted)", display: "block", marginBottom: "4px" }}>
                            Email
                        </label>
                        <input 
                            type = "email" 
                            placeholder = "you@example.com" 
                            value = {form.username} 
                            onChange = {e => setForm(f => ({ ...f, username: e.target.value }))} 
                            onKeyDown = {e => e.key === "Enter" && submit()} 
                        />
                    </div>
                    <div>
                        <label style = {{ fontSize: "12px", color: "var(--textMuted)", display: "block", marginBottom: "4px" }}>
                            Password
                        </label>
                        <input 
                            type = "password" 
                            placeholder = "••••••••" 
                            value = {form.password} 
                            onChange = {e => setForm(f => ({ ...f, password: e.target.value }))} 
                            onKeyDown = {e => e.key === "Enter" && submit()} 
                        />
                    </div>
                    <div>
                        <label style = {{ fontSize: "12px", color: "var(--textMuted)", display: "block", marginBottom: "4px" }}>
                            Login as
                        </label>
                        <select value = {form.role} onChange = {e => setForm(f => ({ ...f, role: e.target.value }))}>
                            <option value = "client">
                                Customer
                            </option>
                            <option value = "seller">
                                Seller
                            </option>
                            <option value = "admin">
                                Admin
                            </option>
                        </select>
                    </div>

                    <Btn size = "lg" onClick = {submit} disabled = {loading} style = {{ width: "100%", marginTop: "0.5rem" }}>
                        {loading ? "Signing in…" : "Sign In"}
                    </Btn>
                </div>

                <p style = {{ textAlign: "center", marginTop: "1.5rem", color: "var(--textMuted)", fontSize: "14px" }}>
                    No account? <Link to="/register" style={{ color: "var(--accent)", fontWeight: 500 }}>Register here</Link>
                </p>
            </Card>
        </div>
    );
}

export default LoginPage;