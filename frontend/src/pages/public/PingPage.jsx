import React, { useState } from 'react';
import Card from '../../components/ui/Card';
import Btn from '../../components/ui/Btn';
import { useToast } from '../../components/shared/ToastProvider';
import { apiFetch } from '../../services/api';

const PingPage = () => {
    const [host, setHost] = useState('');
    const [output, setOutput] = useState('');
    const [loading, setLoading] = useState(false);

    const toast = useToast();

    const runPing = async () => {
        if (!host.trim()) {
            toast('Please enter a host.', 'warning');
            return;
        }

        setLoading(true);
        setOutput(`> Running ping command...\n`);

        try {
            const response = await apiFetch('/ping/ping-vuln', {
                method: 'POST',
                body: JSON.stringify({
                    host
                })
            });

            setOutput(response.data || 'No output');
        } catch (err) {
            toast(err.message, 'error');
            setOutput(`Error: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const loadPayload = (payload) => {
        setHost(payload);
    };

    return (
        <div
            style={{
                maxWidth: '1000px',
                margin: '0 auto',
                padding: '3rem 1.5rem'
            }}
        >
            <h1
                style={{
                    fontFamily: 'var(--fontDisplay)',
                    fontSize: '2rem',
                    marginBottom: '1rem'
                }}
            >
                Command Injection Lab
            </h1>

            <Card style={{ padding: '1.5rem' }}>
                <h3 style={{ marginBottom: '1rem' }}>
                    Vulnerable Ping Tool
                </h3>

                <div
                    style={{
                        display: 'flex',
                        gap: '1rem',
                        marginBottom: '1rem'
                    }}
                >
                    <input
                        type="text"
                        value={host}
                        placeholder="google.com"
                        onChange={(e) => setHost(e.target.value)}
                        onKeyDown={(e) =>
                            e.key === 'Enter' && runPing()
                        }
                        style={{
                            flex: 1,
                            padding: '0.75rem',
                            borderRadius: '8px',
                            border: '1px solid var(--border)',
                            background: 'var(--surface)',
                            color: 'var(--text)'
                        }}
                    />

                    <Btn
                        onClick={runPing}
                        disabled={loading}
                    >
                        {loading ? 'Running...' : 'Execute'}
                    </Btn>
                </div>

                <div
                    style={{
                        display: 'flex',
                        gap: '0.5rem',
                        flexWrap: 'wrap',
                        marginBottom: '1rem'
                    }}
                >
                    <Btn
                        size="sm"
                        variant="secondary"
                        onClick={() =>
                            loadPayload('google.com')
                        }
                    >
                        Normal Ping
                    </Btn>

                    <Btn
                        size="sm"
                        variant="secondary"
                        onClick={() =>
                            loadPayload(
                                'google.com && whoami'
                            )
                        }
                    >
                        whoami
                    </Btn>

                    <Btn
                        size="sm"
                        variant="secondary"
                        onClick={() =>
                            loadPayload(
                                'google.com && pwd'
                            )
                        }
                    >
                        pwd
                    </Btn>

                    <Btn
                        size="sm"
                        variant="secondary"
                        onClick={() =>
                            loadPayload(
                                'google.com && ls'
                            )
                        }
                    >
                        ls
                    </Btn>
                </div>

                <div
                    style={{
                        background: '#0f0f11',
                        color: '#22c55e',
                        borderRadius: '10px',
                        padding: '1rem',
                        minHeight: '300px',
                        fontFamily: 'monospace',
                        whiteSpace: 'pre-wrap',
                        overflowX: 'auto',
                        border: '1px solid var(--border)'
                    }}
                >
                    {output ||
                        '> Waiting for command execution...'}
                </div>
            </Card>
        </div>
    );
};

export default PingPage;