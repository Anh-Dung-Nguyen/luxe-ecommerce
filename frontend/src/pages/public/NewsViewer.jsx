import { useState } from "react";
import axios from "axios";

import Card from "../../components/ui/Card";
import Btn from "../../components/ui/Btn";
import Badge from "../../components/ui/Badge";
import Spinner from "../../components/ui/Spinner";
import { useToast } from "../../components/shared/ToastProvider";

export default function NewsViewer() {
    const toast = useToast();

    const [url, setUrl] = useState("https://example.com");
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);

    const loadArticle = async () => {
        if (!url.trim()) {
            toast("Please enter an URL", "warning");
            return;
        }

        try {
            setLoading(true);

            const res = await axios.get(
                "http://localhost:5000/api/path/news",
                {
                    params: { url }
                }
            );

            setContent(res.data);

            toast("Remote content loaded");
        } catch (err) {
            toast(
                err.response?.data || err.message,
                "error"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                maxWidth: "1100px",
                margin: "0 auto",
                padding: "3rem 1.5rem"
            }}
        >
            <div style={{ marginBottom: "2rem" }}>
                <Badge color="warning">
                    Security Lab
                </Badge>

                <h1
                    style={{
                        fontFamily: "var(--fontDisplay)",
                        fontSize: "2.4rem",
                        marginTop: "1rem",
                        marginBottom: ".5rem"
                    }}
                >
                    Remote Content Inclusion Demo
                </h1>

                <p
                    style={{
                        color: "var(--textMuted)",
                        maxWidth: "700px",
                        lineHeight: 1.7
                    }}
                >
                    This page demonstrates an intentionally vulnerable feature
                    that retrieves content from an external URL and renders it
                    inside the application. It is intended for security
                    laboratory use only.
                </p>
            </div>

            <Card
                style={{
                    padding: "1.5rem",
                    marginBottom: "2rem"
                }}
            >
                <div
                    style={{
                        display: "flex",
                        gap: "1rem",
                        alignItems: "end",
                        flexWrap: "wrap"
                    }}
                >
                    <div style={{ flex: 1 }}>
                        <label
                            style={{
                                display: "block",
                                marginBottom: ".5rem",
                                color: "var(--textMuted)",
                                fontSize: "13px"
                            }}
                        >
                            External URL
                        </label>

                        <input
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="https://example.com"
                            style={{
                                width: "100%",
                                padding: "12px 14px",
                                borderRadius: "8px",
                                border: "1px solid var(--border)",
                                background: "var(--surface)",
                                color: "var(--text)",
                                outline: "none"
                            }}
                        />
                    </div>

                    <Btn
                        onClick={loadArticle}
                        disabled={loading}
                    >
                        {loading ? "Loading..." : "Load Content"}
                    </Btn>
                </div>
            </Card>

            <Card
                style={{
                    overflow: "hidden"
                }}
            >
                <div
                    style={{
                        padding: "1rem 1.5rem",
                        borderBottom: "1px solid var(--border)",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                    }}
                >
                    <h2
                        style={{
                            fontSize: "18px",
                            fontFamily: "var(--fontDisplay)"
                        }}
                    >
                        Remote Content
                    </h2>

                    <Badge color="info">
                        HTML Preview
                    </Badge>
                </div>

                <div
                    style={{
                        minHeight: 450,
                        padding: "1.5rem",
                        background: "var(--bg)"
                    }}
                >
                    {loading ? (
                        <Spinner />
                    ) : content ? (
                        <div
                            dangerouslySetInnerHTML={{
                                __html: content
                            }}
                        />
                    ) : (
                        <div
                            style={{
                                color: "var(--textMuted)",
                                textAlign: "center",
                                padding: "5rem 0"
                            }}
                        >
                            No remote content loaded.
                        </div>
                    )}
                </div>
            </Card>

            <Card
                style={{
                    marginTop: "2rem",
                    padding: "1.5rem"
                }}
            >
                <div
                    style={{
                        display: "flex",
                        gap: ".5rem",
                        alignItems: "center",
                        marginBottom: ".75rem"
                    }}
                >
                    <Badge color="danger">
                        Vulnerable Lab
                    </Badge>

                    <span
                        style={{
                            color: "var(--textMuted)",
                            fontSize: "13px"
                        }}
                    >
                        Educational Environment
                    </span>
                </div>
            </Card>
        </div>
    );
}