import React, { useState } from 'react';
import Card from '../../components/ui/Card';
import Btn from '../../components/ui/Btn';
import { apiFetch } from '../../services/api';

const SQLiDemoPage = () => {
    const [keyword, setKeyword] = useState("");
    const [results, setResults] = useState([]);
    const [queryExecuted, setQueryExecuted] = useState("");
    const [error, setError] = useState("");

    const handleSearch = async (level) => {
        try {
            setError("");
            const endpoint = level === 'easy' ? '/products/search-vulnerable-easy' : '/products/search-vulnerable-medium';
            const data = await apiFetch(`${endpoint}?keyword=${encodeURIComponent(keyword)}`);
            
            setResults(data.data || []);
            setQueryExecuted(data.query_executed);
        } catch (err) {
            setError(err.message);
            setResults([]);
            setQueryExecuted("");
        }
    };

    return (
        <div style = {{ maxWidth: "800px", margin: "0 auto", padding: "3rem 1.5rem" }}>
            <h1 style = {{ fontFamily: "var(--fontDisplay)", fontSize: "2rem", marginBottom: "1rem" }}>
                SQL Injection Demo Form
            </h1>

            <Card style = {{ padding: "1.5rem", marginBottom: "2rem" }}>
                <div style = {{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <input 
                        type = "text"
                        placeholder = "Enter a keyword to search (Test payload SQLi...)"
                        value = {keyword}
                        onChange = {(e) => setKeyword(e.target.value)}
                    />
                    
                    <div style = {{ display: "flex", gap: "1rem" }}>
                        <Btn onClick = {() => handleSearch('easy')} variant = "danger">
                            Search (Easy mode)
                        </Btn>
                        <Btn onClick = {() => handleSearch('medium')} variant = "warning">
                            Search (Medium mode)
                        </Btn>
                    </div>
                </div>
            </Card>

            {error && <p style = {{ color: "var(--danger)" }}>Error: {error}</p>}

            {queryExecuted && (
                <Card style = {{ padding: "1rem", marginBottom: "1.5rem", backgroundColor: "#1e1e1e" }}>
                    <p style = {{ color: "var(--textMuted)", fontSize: "12px", marginBottom: "0.5rem" }}>SQL query executed on server:</p>
                    <code style = {{ color: "var(--info)", fontSize: "14px", wordBreak: "break-all" }}>
                        {queryExecuted}
                    </code>
                </Card>
            )}

            <h3>{results.length} returned results:</h3>
            <ul style = {{ marginTop: "1rem", paddingLeft: "1.5rem" }}>
                {results.map(item => (
                    <li key = {item.id} style = {{ marginBottom: "0.5rem" }}>
                        {item.name} - Price: ${item.price}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SQLiDemoPage;