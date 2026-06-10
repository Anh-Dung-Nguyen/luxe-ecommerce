import React from 'react';
import { useSelector } from 'react-redux';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';

const ProfilePage = () => {
    const user = useSelector((state) => state.auth.user);

    if (!user) {
        return null;
    }

    return (
        <div style = {{ maxWidth: "600px", margin: "0 auto", padding: "3rem 1.5rem" }}>
            <h1 style = {{ fontFamily: "var(--fontDisplay)", fontSize: "2rem", marginBottom: "2rem" }}>
                My Profile
            </h1>
            
            <Card style = {{ padding: "2rem" }}>
                <div style = {{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "2rem" }}>
                    <div style = {{ 
                        width: "64px", height: "64px", background: "#201c12", borderRadius: "50%", 
                        display: "flex", alignItems: "center", justifyContent: "center", 
                        border: "2px solid var(--accentDim)" 
                    }}>
                        <span style = {{ fontFamily: "var(--fontDisplay)", fontSize: "1.5rem", color: "var(--accent)" }}>
                            {(user.username?.[0] || "?").toUpperCase()}
                        </span>
                    </div>
                    <div>
                        <p style = {{ fontSize: "18px", fontWeight: 500 }}>{user.username}</p>
                        <div style = {{ display: "flex", gap: "0.5rem", marginTop: "0.25rem" }}>
                            <Badge color = "accent">
                                {user.role}
                            </Badge>
                            <Badge color = "success">
                                Verified
                            </Badge>
                        </div>
                    </div>
                </div>
                    
                <div style = {{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {[
                        ["Email", user.username], 
                        ["Role", user.role], 
                        ["Account ID", `#${user.id}`]
                    ].map(([k, v]) => (
                        <div key = {k} style = {{ display: "flex", justifyContent: "space-between", padding: "0.75rem 0", borderBottom: "1px solid var(--border)" }}>
                            <span style = {{ color: "var(--textMuted)", fontSize: "14px" }}>
                                {k}
                            </span>
                            <span style = {{ fontSize: "14px" }}>
                                {v}
                            </span>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
}

export default ProfilePage;