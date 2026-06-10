import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../services/api';
import Card from '../../components/ui/Card';
import Btn from '../../components/ui/Btn';
import Spinner from '../../components/ui/Spinner';
import ProductCard from '../../components/shared/ProductCard';
import EmptyState from '../../components/shared/EmptyState';
import Pagination from '../../components/shared/Pagination';

const ProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    
    const [filters, setFilters] = useState({ keyword: "", categoryId: "", minPrice: "", maxPrice: "" });
    const [applied, setApplied] = useState({});

    useEffect(() => {
        apiFetch("/categories").then(d => setCategories(d.data || [])).catch(() => {});
    }, []);

    useEffect(() => {
        setLoading(true);
        const params = { page, limit: 12, ...Object.fromEntries(Object.entries(applied).filter(([_, v]) => v)) };
        const q = new URLSearchParams(params);
        
        apiFetch(`/products?${q}`)
            .then(d => {
                setProducts(d.data || []);
                setTotal(d.totalItems || 0);
                setTotalPages(d.totalPages || 1);
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [page, applied]);

    const search = () => { setApplied(filters); setPage(1); };
    const reset = () => { 
        setFilters({ keyword: "", categoryId: "", minPrice: "", maxPrice: "" }); 
        setApplied({}); 
        setPage(1); 
    };

    return (
        <div style = {{ maxWidth: "1280px", margin: "0 auto", padding: "3rem 1.5rem" }}>
            <div style = {{ marginBottom: "2.5rem" }}>
                <h1 style = {{ fontFamily: "var(--fontDisplay)", fontSize: "2.5rem", marginBottom: "0.5rem" }}>
                    All Products
                </h1>
                <p style = {{ color: "var(--textMuted)" }}>
                    {total} products available
                </p>
            </div>

            {/* Filters */}
            <Card style = {{ 
                padding: "1.25rem", 
                marginBottom: "2rem" 
            }}>
                <div style = {{ 
                    display: "grid", 
                    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", 
                    gap: "0.75rem", 
                    alignItems: "end" 
                }}>
                    <input 
                        placeholder = "Search products…" 
                        value = {filters.keyword} 
                        onChange = {e => setFilters(f => ({ ...f, keyword: e.target.value }))} 
                        onKeyDown = {e => e.key === "Enter" && search()} 
                    />
                    <select 
                        value = {filters.categoryId} 
                        onChange = {e => setFilters(f => ({ ...f, categoryId: e.target.value }))}
                    >
                        <option value = "">
                            All Categories
                        </option>
                        {categories.map(c => <option key = {c.id} value = {c.id}>{c.name}</option>)}
                    </select>
                    <input 
                        type = "number" 
                        placeholder = "Min price" 
                        value = {filters.minPrice} 
                        onChange = {e => setFilters(f => ({ ...f, minPrice: e.target.value }))} 
                    />
                    <input 
                        type = "number" 
                        placeholder = "Max price" 
                        value = {filters.maxPrice} 
                        onChange = {e => setFilters(f => ({ ...f, maxPrice: e.target.value }))} 
                    />
                    <div style = {{ display: "flex", gap: "8px" }}>
                        <Btn 
                            onClick = {search} 
                            style = {{ flex: 1 }}
                        >
                            Search
                        </Btn>
                        <Btn 
                            variant = "secondary" 
                            onClick = {reset}
                        >
                            Reset
                        </Btn>
                    </div>
                </div>
            </Card>

            {/* Results */}
            {loading ? (
                <div style = {{ 
                    textAlign: "center", 
                    padding: "5rem" 
                }}>
                    <Spinner />
                </div>
            ) : products.length === 0 ? (
                <EmptyState 
                    icon = "🔍" 
                    title = "No products found" 
                    subtitle = "Try adjusting your filters" 
                />
            ) : (
                <>
                    <div style = {{ 
                        display: "grid", 
                        gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", 
                        gap: "1.5rem" 
                    }}>
                        {products.map(p => <ProductCard key = {p.id} product = {p} />)}
                    </div>
                    <Pagination page = {page} totalPages = {totalPages} onChange = {setPage} />
                </>
            )}
        </div>
    );
}

export default ProductsPage;