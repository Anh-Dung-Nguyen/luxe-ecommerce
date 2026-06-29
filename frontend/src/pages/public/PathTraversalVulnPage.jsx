import React, { useState } from 'react';
import Card from '../../components/ui/Card';
import Btn from '../../components/ui/Btn';

const PathTraversalVulnPage = () => {

    const [pathInput, setPathInput] = useState('');
    const [result, setResult] = useState('');

    const downloadFile = async () => {

        const response = await fetch(
            `http://localhost:5000/api/path/pathVuln?path=${encodeURIComponent(pathInput)}`
        );

        const text = await response.text();

        setResult(text);
    };

    return (
        <div
            style={{
                maxWidth:'900px',
                margin:'0 auto',
                padding:'3rem'
            }}
        >
            <h1>
                Path Traversal Lab
            </h1>

            <Card style={{padding:'1rem'}}>

                <input
                    type="text"
                    placeholder="uploads/avatar1.jpg"
                    value={pathInput}
                    onChange={(e)=>
                        setPathInput(e.target.value)
                    }
                    style={{
                        width:'100%',
                        marginBottom:'1rem'
                    }}
                />

                <Btn onClick={downloadFile}>
                    Read File
                </Btn>

                <pre
                    style={{
                        marginTop:'1rem',
                        background:'#111',
                        color:'#0f0',
                        padding:'1rem'
                    }}
                >
                    {result}
                </pre>

            </Card>
        </div>
    );
};

export default PathTraversalVulnPage;