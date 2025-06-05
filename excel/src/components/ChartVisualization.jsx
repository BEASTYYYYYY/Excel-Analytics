/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';
import * as THREE from 'three';
import jsPDF from 'jspdf';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

export const ChartVisualization = ({ selectedHistoryItem }) => {
    // State management
    const [selectedXAxis, setSelectedXAxis] = useState('');
    const [selectedYAxis, setSelectedYAxis] = useState('');
    const [chartType, setChartType] = useState('bar');
    const [availableColumns, setAvailableColumns] = useState([]);
    const [isLoading] = useState(false);
    const [error, setError] = useState('');
    const [chartData, setChartData] = useState(null);
    const [parsedData, setParsedData] = useState(null);
    const [is3D, setIs3D] = useState(false);

    // Refs
    const chartRef = useRef(null);
    const threeContainerRef = useRef(null);
    const threeSceneRef = useRef(null);
    const threeControlsRef = useRef(null);

    // Process data when selectedHistoryItem changes
    useEffect(() => {
        if (selectedHistoryItem && !selectedHistoryItem._analyzed) {
            let dataToProcess = selectedHistoryItem.parsedData || selectedHistoryItem.data;

            if (!dataToProcess) {
                setError('No valid data found in the selected file');
                return;
            }

            if (!Array.isArray(dataToProcess)) {
                dataToProcess = processNonArrayData(dataToProcess);
            }

            if (!dataToProcess || dataToProcess.length === 0) {
                setError('No data found in the selected file');
                return;
            }

            processDataColumns(dataToProcess);

            // ✅ Mark this file object as already analyzed
            selectedHistoryItem._analyzed = true;
        }
    }, [selectedHistoryItem]);


    // Process non-array data to array
    const processNonArrayData = (data) => {
        if (typeof data === 'object' && data !== null) {
            if (data.data && Array.isArray(data.data)) {
                return data.data;
            }

            const objKeys = Object.keys(data);
            if (objKeys.length > 0 && typeof data[objKeys[0]] === 'object') {
                return objKeys.map(key => ({
                    id: key,
                    ...data[key]
                }));
            }
        }

        setError('Invalid data format for visualization');
        return [];
    };

    // Process data columns
    const processDataColumns = (data) => {
        // Extract column names, excluding 'id' if present
        const columns = Object.keys(data[0] || {})
            .filter(col => col !== 'id' && typeof data[0][col] !== 'object');

        setAvailableColumns(columns);
        setParsedData(data);

        // Reset axis selections if needed
        if (!columns.includes(selectedXAxis)) {
            setSelectedXAxis(columns[0] || '');
        }
        if (!columns.includes(selectedYAxis)) {
            setSelectedYAxis(columns[1] || columns[0] || '');
        }
    };

    // Generate web-safe colors to avoid oklch color function issue
    const generateWebSafeColors = (count) => {
        const baseColors = [
            '#6A5ACD', // Soft Slate Blue
            '#4BC0C0', // Teal
            '#F67280', // Soft Coral
            '#C06C84', // Muted Rose
            '#F8B195', // Soft Peach
            '#6C5B7B', // Dusty Purple
            '#355C7D', // Deep Blue-Gray
            '#C4B4BC'  // Soft Mauve
        ];

        return Array.from({ length: count }, (_, i) =>
            baseColors[i % baseColors.length]
        );
    };

    // Prepare chart data
    const prepareChartData = () => {
        if (!parsedData || !selectedXAxis || !selectedYAxis) return;

        try {
            const labels = parsedData.map(item => item[selectedXAxis]);
            const data = parsedData.map(item => Number(item[selectedYAxis]));

            // Generate web-safe colors to avoid oklch color function issue
            const backgroundColors = generateWebSafeColors(data.length);
            const borderColors = backgroundColors.map(color => {
                // Convert hex to slightly darker hex for borders
                const r = parseInt(color.slice(1, 3), 16);
                const g = parseInt(color.slice(3, 5), 16);
                const b = parseInt(color.slice(5, 7), 16);
                const darken = (c) => Math.max(0, Math.floor(c * 0.8)).toString(16).padStart(2, '0');
                return `#${darken(r)}${darken(g)}${darken(b)}`;
            });

            const newChartData = {
                labels,
                datasets: [{
                    label: selectedYAxis,
                    data,
                    backgroundColor: backgroundColors,
                    borderColor: borderColors,
                    pointRadius: 6,
                    pointHoverRadius: 8
                }]
            };

            setChartData(newChartData);
        } catch (err) {
            setError('Error preparing chart data');
            console.error(err);
        }
    };

    // Chart options generator
    const getChartOptions = () => ({
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: `${selectedYAxis} by ${selectedXAxis}`
            }
        }
    });

    // Soft gradient background creator
    const createSoftGradientBackground = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const context = canvas.getContext('2d');

        // Create dark gradient background
        const gradient = context.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#1a202c');   // Dark blue-gray at top
        gradient.addColorStop(1, '#2d3748');   // Slightly lighter at bottom

        context.fillStyle = gradient;
        context.fillRect(0, 0, canvas.width, canvas.height);

        // Add subtle noise
        for (let i = 0; i < canvas.width; i++) {
            for (let j = 0; j < canvas.height; j++) {
                const noise = Math.random() * 10;
                context.fillStyle = `rgba(255,255,255,${noise / 50})`;
                context.fillRect(i, j, 1, 1);
            }
        }

        return new THREE.CanvasTexture(canvas);
    };

    // Enhanced grid creator
    const createEnhancedGrid = () => {
        const gridSize = 60; // Increased grid size
        const gridDivisions = 30; // More divisions for finer grid
        const gridHelper = new THREE.GridHelper(
            gridSize,
            gridDivisions,
            0xF5DEB3, // Wheat/light orange-brown for major grid lines
            0xFFF8DC  // Cornsilk/softer color for minor grid lines
        );
        gridHelper.position.y = 0;
        gridHelper.material.opacity = 0.4;
        gridHelper.material.transparent = true;
        return gridHelper;
    };

    // Color palette creator
    const createColorPalette = (count) => {
        const baseColors = [
            0x6A5ACD, // Soft Slate Blue
            0x4BC0C0, // Teal
            0xF67280, // Soft Coral
            0xC06C84, // Muted Rose
            0xF8B195, // Soft Peach
            0x6C5B7B, // Dusty Purple
            0x355C7D, // Deep Blue-Gray
            0xC4B4BC  // Soft Mauve
        ];
        return Array.from({ length: count }, (_, i) =>
            baseColors[i % baseColors.length]
        );
    };

    // Data label creator
    const createDataLabel = (group, label, value, position, scale = 1) => {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 64;
        const context = canvas.getContext('2d');

        // Background: semi-transparent black
        context.fillStyle = 'rgba(0, 0, 0, 0.6)';
        context.fillRect(0, 0, canvas.width, canvas.height);

        // Text: white, smaller size
        context.font = `bold ${24 * scale}px Arial`;
        context.textAlign = 'center';
        context.textBaseline = 'middle';

        // Shadow
        context.fillStyle = 'black';
        context.fillText(label, canvas.width / 2 + 2, canvas.height / 2 + 2);

        // Main text
        context.fillStyle = 'white';
        context.fillText(label, canvas.width / 2, canvas.height / 2);

        const texture = new THREE.CanvasTexture(canvas);
        const material = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true
        });

        const geometry = new THREE.PlaneGeometry(2.2 * scale, 0.6 * scale);
        const labelMesh = new THREE.Mesh(geometry, material);

        labelMesh.position.copy(position);
        labelMesh.rotation.set(0, 0, 0);

        group.add(labelMesh);
    };


    // Axes labels creator
    const createAxesLabels = (scene, xLabel, yLabel) => {
        const createTextLabel = (text, position, rotation) => {
            const canvas = document.createElement('canvas');
            canvas.width = 512;
            canvas.height = 128;
            const context = canvas.getContext('2d');

            context.fillStyle = 'black'; // background color
            context.fillRect(0, 0, canvas.width, canvas.height);

            context.fillStyle = 'white'; // text color
            context.font = 'bold 36px Arial';
            context.textAlign = 'center';
            context.textBaseline = 'middle';
            context.fillText(text, canvas.width / 2, canvas.height / 2);

            const texture = new THREE.CanvasTexture(canvas);
            const material = new THREE.MeshBasicMaterial({
                map: texture,
                transparent: true
            });
            const geometry = new THREE.PlaneGeometry(6, 1.5);
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.copy(position);
            mesh.rotation.copy(rotation);
            scene.add(mesh);
        };

        const margin = 3;

        // X-axis label (centered under front bars)
        createTextLabel(
            xLabel,
            new THREE.Vector3(0, 0.6, chartData.labels.length / 2 + 2),
            new THREE.Euler(0, 0, 0)
        );

        // Y-axis label (to the far left, vertical orientation)
        createTextLabel(
            yLabel,
            new THREE.Vector3(-chartData.labels.length - margin, 6, 0),
            new THREE.Euler(0, Math.PI / 2, 0)
        );
    };

    // 3D Rendering function
    const render3DChart = () => {
        if (!threeContainerRef.current || !chartData) return;

        // Clear previous scene
        const container = threeContainerRef.current;
        container.innerHTML = '';

        // Scene setup with improved background
        const scene = new THREE.Scene();
        const backgroundTexture = createSoftGradientBackground();
        scene.background = backgroundTexture;

        // Renderer with enhanced quality
        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        container.appendChild(renderer.domElement);

        // Camera with better initial positioning
        const camera = new THREE.PerspectiveCamera(
            50,
            container.clientWidth / container.clientHeight,
            0.1,
            1000
        );
        camera.position.set(0, 10, 20);
        camera.lookAt(0, 5, 0);

        // Enhanced Orbit Controls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.1;
        controls.rotateSpeed = 0.5;
        controls.zoomSpeed = 1.2;
        controls.panSpeed = 0.8;
        threeControlsRef.current = controls;

        // Prepare data
        const { labels, datasets } = chartData;
        const data = datasets[0].data;
        const maxValue = Math.max(...data);

        // Create 3D representation group
        const chartGroup = new THREE.Group();

        // Enhanced grid with perspective
        const gridHelper = createEnhancedGrid();
        scene.add(gridHelper);

        // Advanced lighting setup
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 10, 7);
        directionalLight.castShadow = true;
        scene.add(ambientLight, directionalLight);

        // Color palette with better contrast
        const colorPalette = createColorPalette(data.length);

        // Rendering based on chart type
        if (chartType === 'line') {
            // Line chart 3D rendering
            const linePoints = data.map((value, index) =>
                new THREE.Vector3(
                    (index - data.length / 2) * 2,
                    (value / maxValue) * 10,
                    0
                )
            );

            // Create line geometry
            const lineGeometry = new THREE.BufferGeometry().setFromPoints(linePoints);
            const lineMaterial = new THREE.LineBasicMaterial({
                color: 0x4BC0C0,
                linewidth: 5
            });
            const line = new THREE.Line(lineGeometry, lineMaterial);
            chartGroup.add(line);

            // Add points along the line
            data.forEach((value, index) => {
                const pointGeometry = new THREE.SphereGeometry(0.5, 32, 32);
                const pointMaterial = new THREE.MeshStandardMaterial({
                    color: colorPalette[index],
                    metalness: 0.3,
                    roughness: 0.6
                });
                const point = new THREE.Mesh(pointGeometry, pointMaterial);
                point.position.set(
                    (index - data.length / 2) * 2,
                    (value / maxValue) * 10,
                    0
                );
                chartGroup.add(point);

                const labelPosition = point.position.clone();
                labelPosition.y += 0.7;

                createDataLabel(
                    chartGroup,
                    labels[index],
                    value.toFixed(2),
                    labelPosition,
                    0.6 // smaller size
                );
            });
        } else {
            // Bar chart rendering 
            data.forEach((value, index) => {
                const barHeight = (value / maxValue) * 10;
                const barGeometry = new THREE.BoxGeometry(1, barHeight, 1);

                const barMaterial = new THREE.MeshStandardMaterial({
                    color: colorPalette[index],
                    metalness: 0.3,
                    roughness: 0.6
                });

                const bar = new THREE.Mesh(barGeometry, barMaterial);
                bar.position.set(
                    (index - data.length / 2) * 2,
                    barHeight / 2,
                    0
                );
                bar.castShadow = true;
                bar.receiveShadow = true;
                chartGroup.add(bar);

                // Enhanced data labels
                const labelPosition = bar.position.clone();
                labelPosition.z += 0.7; // bring it slightly in front of the bar
                createDataLabel(
                    chartGroup,
                    labels[index],
                    value.toFixed(2),
                    labelPosition,
                    0.9
                );
            });
        }

        // Add axes labels
        createAxesLabels(scene, selectedXAxis, selectedYAxis);

        scene.add(chartGroup);

        // Animation loop
        const animate = () => {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        };
        animate();

        // Store scene for cleanup
        threeSceneRef.current = {
            scene,
            controls,
            renderer
        };

        return () => {
            // Cleanup resources
            if (threeSceneRef.current) {
                threeSceneRef.current.controls.dispose();
                threeSceneRef.current.scene.dispose();
                threeSceneRef.current.renderer.dispose();
            }
        };
    };

    // Cleanup effect for 3D scene
    useEffect(() => {
        return () => {
            if (threeSceneRef.current) {
                threeSceneRef.current.controls?.dispose();
            }
        };
    }, []);

    // Export 3D scene to GLB format
    const exportToGLB = () => {
        if (!threeSceneRef.current || !threeSceneRef.current.scene) return;

        const exporter = new GLTFExporter();
        const options = {
            binary: true,
            trs: true,
            onlyVisible: true
        };

        exporter.parse(
            threeSceneRef.current.scene,
            (buffer) => {
                const blob = new Blob([buffer], { type: 'application/octet-stream' });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = `${selectedHistoryItem?.filename || 'chart'}-3d-${new Date().toISOString()}.glb`;
                link.click();
                URL.revokeObjectURL(link.href);
            },
            (error) => {
                console.error('GLB Export Error:', error);
                setError('Failed to export 3D model');
            },
            options
        );
    };

    // Capture 2D chart image with fixed styling
    const capture2DChart = () => {
        return new Promise((resolve, reject) => {
            if (!chartRef.current || !chartRef.current.canvas) {
                reject('Chart canvas not found');
                return;
            }

            // Get the original canvas and create a temporary copy
            const originalCanvas = chartRef.current.canvas;
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = originalCanvas.width;
            tempCanvas.height = originalCanvas.height;

            const ctx = tempCanvas.getContext('2d');
            ctx.fillStyle = '#ffffff'; // White background
            ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
            ctx.drawImage(originalCanvas, 0, 0);

            resolve(tempCanvas);
        });
    };

    // Download chart functionality
    const downloadChart = async (format = 'png') => {
        try {
            const filename = `${selectedHistoryItem?.filename || 'chart'}-${new Date().toISOString()}`;

            // Special handling for 3D in GLB format
            if (is3D && format === 'glb') {
                exportToGLB();
                return;
            }

            // For 2D charts
            if (!is3D) {
                const canvas = await capture2DChart();

                if (format === 'png') {
                    const link = document.createElement('a');
                    link.download = `${filename}.png`;
                    link.href = canvas.toDataURL('image/png');
                    link.click();
                } else if (format === 'pdf') {
                    const pdf = new jsPDF('landscape');
                    const imgData = canvas.toDataURL('image/png');
                    pdf.addImage(imgData, 'PNG', 10, 10, 280, 150);
                    pdf.save(`${filename}.pdf`);
                }
                return;
            }

            // For 3D charts (screenshot)
            if (is3D && threeContainerRef.current) {
                // Take a screenshot of the current 3D view
                const renderer = threeSceneRef.current?.renderer;
                if (!renderer) return;

                // Render a frame
                threeSceneRef.current.controls.update();
                renderer.render(threeSceneRef.current.scene, threeSceneRef.current.camera);

                // Get the canvas content
                const imgData = renderer.domElement.toDataURL('image/png');

                if (format === 'png') {
                    const link = document.createElement('a');
                    link.download = `${filename}-3d.png`;
                    link.href = imgData;
                    link.click();
                } else if (format === 'pdf') {
                    const pdf = new jsPDF('landscape');
                    pdf.addImage(imgData, 'PNG', 10, 10, 280, 150);
                    pdf.save(`${filename}-3d.pdf`);
                }
            }
        } catch (err) {
            console.error('Download error:', err);
            setError(`Failed to download: ${err.message}`);
        }
    };

    // Render chart effect
    useEffect(() => {
        if (selectedXAxis && selectedYAxis && parsedData) {
            prepareChartData();
        }
    }, [selectedXAxis, selectedYAxis, chartType, parsedData]);

    // 3D rendering effect
    useEffect(() => {
        if (is3D && chartData && (chartType === 'bar' || chartType === 'line')) {
            render3DChart();
        }
    }, [is3D, chartData, chartType]);

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                    Chart Visualization
                </h2>
                <div className="flex items-center space-x-2">
                    {/* 3D Toggle Button */}
                    {(chartType === 'bar' || chartType === 'line') && (
                        <button
                            onClick={() => setIs3D(!is3D)}
                            className={`flex items-center justify-center px-3 py-1.5 rounded-md text-sm transition-colors ${is3D
                                ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                                }`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg"
                                width="24" height="24" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor"
                                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                className="h-4 w-4 mr-1">
                                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4a2 2 0 0 0 1-1.73z" />
                                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                                <line x1="12" y1="22.08" x2="12" y2="12" />
                            </svg>
                            {is3D ? '3D' : '2D'}
                        </button>
                    )}

                    {/* Download Buttons */}
                    {chartData && (
                        <div className="flex space-x-2">
                            <button
                                onClick={() => downloadChart('png')}
                                className="flex items-center px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-1">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                    <polyline points="7 10 12 15 17 10" />
                                    <line x1="12" x2="12" y1="15" y2="3" />
                                </svg>
                                PNG
                            </button>
                            <button
                                onClick={() => downloadChart('pdf')}
                                className="flex items-center px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-1">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                    <polyline points="7 10 12 15 17 10" />
                                    <line x1="12" x2="12" y1="15" y2="3" />
                                </svg>
                                PDF
                            </button>
                            {is3D && (
                                <button
                                    onClick={() => downloadChart('glb')}
                                    className="flex items-center px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-md text-sm transition-colors"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-1">
                                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4a2 2 0 0 0 1-1.73z" />
                                        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                                        <line x1="12" y1="22.08" x2="12" y2="12" />
                                    </svg>
                                    GLB
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Chart Configuration */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {/* X-Axis Selection */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        X-Axis
                    </label>
                    <select
                        value={selectedXAxis}
                        onChange={(e) => setSelectedXAxis(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        disabled={isLoading || !availableColumns.length}
                    >
                        {availableColumns.map((column) => (
                            <option key={column} value={column}>
                                {column}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Y-Axis Selection */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Y-Axis
                    </label>
                    <select
                        value={selectedYAxis}
                        onChange={(e) => setSelectedYAxis(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        disabled={isLoading || !availableColumns.length}
                    >
                        {availableColumns.map((column) => (
                            <option key={column} value={column}>
                                {column}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Chart Type Selection */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Chart Type
                    </label>
                    <div className="grid grid-cols-3 gap-1">
                        <button
                            type="button"
                            onClick={() => {
                                setChartType('bar');
                                setIs3D(false);
                            }}
                            className={`flex items-center justify-center px-2 py-2 rounded-md ${chartType === 'bar'
                                ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300'
                                : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                                }`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                                <line x1="12" x2="12" y1="20" y2="10" />
                                <line x1="18" x2="18" y1="20" y2="4" />
                                <line x1="6" x2="6" y1="20" y2="16" />
                            </svg>
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setChartType('line');
                                setIs3D(false);
                            }}
                            className={`flex items-center justify-center px-2 py-2 rounded-md ${chartType === 'line'
                                ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300'
                                : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                                }`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                                <path d="M3 3v18h18" />
                                <path d="m19 9-5 5-4-4-3 3" />
                            </svg>
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setChartType('pie');
                                setIs3D(false);
                            }}
                            className={`flex items-center justify-center px-2 py-2 rounded-md ${chartType === 'pie'
                                ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300'
                                : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                                }`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                                <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
                                <path d="M22 12A10 10 0 0 0 12 2v10z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Chart Display Area */}
            <div className="w-full mt-4">
                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
                    </div>
                ) : error ? (
                    <div className="flex justify-center items-center h-64 text-red-500">
                        <p>{error}</p>
                    </div>
                ) : chartData ? (
                    <div className="w-full h-64 md:h-96">
                        {is3D && (chartType === 'bar' || chartType === 'line') ? (
                            <div
                                ref={threeContainerRef}
                                className="w-full h-full"
                            />
                        ) : (
                            <>
                                {chartType === 'bar' && (
                                    <Bar
                                        ref={chartRef}
                                        data={chartData}
                                        options={getChartOptions()}
                                    />
                                )}
                                {chartType === 'line' && (
                                    <Line
                                        ref={chartRef}
                                        data={chartData}
                                        options={getChartOptions()}
                                    />
                                )}
                                {chartType === 'pie' && (
                                    <Pie
                                        ref={chartRef}
                                        data={chartData}
                                        options={getChartOptions()}
                                    />
                                )}
                            </>
                        )}
                    </div>
                ) : (
                    <div className="flex justify-center items-center h-64 text-gray-500 dark:text-gray-400">
                        <p>Select a file and configure chart options to visualize data</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChartVisualization