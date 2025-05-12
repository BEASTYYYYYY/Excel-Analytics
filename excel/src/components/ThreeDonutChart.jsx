/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';

const PieSegment = ({ startAngle, endAngle, radius, height, color, label, value, percentage, thickness = 1 }) => {
    const shape = useMemo(() => {
        const shape = new THREE.Shape();
        if (thickness < 1) {
            // For donut chart, create a ring
            const innerRadius = radius * thickness;
            // Draw outer arc
            shape.moveTo(radius * Math.cos(startAngle), radius * Math.sin(startAngle));
            for (let angle = startAngle; angle <= endAngle; angle += 0.1) {
                shape.lineTo(radius * Math.cos(angle), radius * Math.sin(angle));
            }
            shape.lineTo(radius * Math.cos(endAngle), radius * Math.sin(endAngle));
            // Draw inner arc (counter-clockwise)
            shape.lineTo(innerRadius * Math.cos(endAngle), innerRadius * Math.sin(endAngle));
            for (let angle = endAngle; angle >= startAngle; angle -= 0.1) {
                shape.lineTo(innerRadius * Math.cos(angle), innerRadius * Math.sin(angle));
            }
            shape.lineTo(innerRadius * Math.cos(startAngle), innerRadius * Math.sin(startAngle));
            shape.closePath();
        } else {
            // For pie chart, create a pie slice
            shape.moveTo(0, 0);
            shape.lineTo(radius * Math.cos(startAngle), radius * Math.sin(startAngle));
            for (let angle = startAngle; angle <= endAngle; angle += 0.1) {
                shape.lineTo(radius * Math.cos(angle), radius * Math.sin(angle));
            }
            shape.lineTo(radius * Math.cos(endAngle), radius * Math.sin(endAngle));
            shape.lineTo(0, 0);
        }
        return shape;
    }, [startAngle, endAngle, radius, thickness]);

    const midAngle = (startAngle + endAngle) / 2;
    const labelDistance = radius * 1.3;
    const labelPosition = [
        labelDistance * Math.cos(midAngle),
        labelDistance * Math.sin(midAngle),
        height / 2
    ];

    const extrudeSettings = {
        steps: 2,
        depth: height,
        bevelEnabled: true,
        bevelThickness: 0.1,
        bevelSize: 0.1,
        bevelOffset: 0,
        bevelSegments: 3
    };

    return (
        <group>
            <mesh>
                <extrudeGeometry args={[shape, extrudeSettings]} />
                <meshStandardMaterial color={color} metalness={0.3} roughness={0.4} />
            </mesh>
            {/* Label */}
            <Html position={labelPosition}>
                <div className="px-2 py-1 bg-black bg-opacity-80 rounded text-white text-xs whitespace-nowrap">
                    <strong>{label}</strong>: {value} ({percentage}%)
                </div>
            </Html>
        </group>
    );
};

export default function ThreeDonutChart({ chartType, labels, values, xAxisField, yAxisField }) {
    const [thickness, setThickness] = useState(chartType === 'doughnut' ? 0.5 : 1);
    const [height, setHeight] = useState(0.5);
    const [radius, setRadius] = useState(3);
    const [autoRotate, setAutoRotate] = useState(false);
    const [hoveredSegment, setHoveredSegment] = useState(null);

    // Calculate total for percentages
    const total = useMemo(() => values.reduce((sum, value) => sum + value, 0), [values]);

    // Create segments based on values
    const segments = useMemo(() => {
        let currentAngle = 0;
        return values.map((value, i) => {
            const percentage = ((value / total) * 100).toFixed(1);
            const angleSize = (value / total) * Math.PI * 2;
            const startAngle = currentAngle;
            const endAngle = currentAngle + angleSize;
            currentAngle = endAngle;

            return {
                key: i,
                label: labels[i] || `Item ${i + 1}`,
                value,
                percentage,
                startAngle,
                endAngle,
                color: `hsl(${(i * 137.5) % 360}, 70%, 60%)`,
            };
        });
    }, [labels, values, total]);

    useEffect(() => {
        // Update thickness when chart type changes
        setThickness(chartType === 'doughnut' ? 0.5 : 1);
    }, [chartType]);

    return (
        <div className="w-full h-full bg-gray-800 dark:bg-gray-900 rounded-lg">
            <div className="flex flex-wrap gap-3 justify-center py-2 bg-gray-700 dark:bg-gray-800 rounded-t-lg border-b border-gray-600">
                <div className="flex items-center text-white px-3">
                    <span className="text-sm font-medium mr-2">Category: {xAxisField || 'Label'}</span>
                    <span className="text-sm font-medium mx-2">Value: {yAxisField || 'Value'}</span>
                </div>

                <label className="text-sm text-white flex items-center">
                    Thickness:
                    <input
                        type="range"
                        value={thickness}
                        step="0.1"
                        min={chartType === 'doughnut' ? 0.2 : 1}
                        max={chartType === 'doughnut' ? 0.8 : 1}
                        onChange={e => setThickness(Number(e.target.value))}
                        className="ml-1 w-20 px-1 py-0.5 rounded"
                        disabled={chartType === 'pie'}
                    />
                </label>
                <label className="text-sm text-white flex items-center">
                    Height:
                    <input
                        type="range"
                        value={height}
                        step="0.1"
                        min="0.1"
                        max="2"
                        onChange={e => setHeight(Number(e.target.value))}
                        className="ml-1 w-20 px-1 py-0.5 rounded"
                    />
                </label>
                <label className="text-sm text-white flex items-center ml-2">
                    <input
                        type="checkbox"
                        checked={autoRotate}
                        onChange={e => setAutoRotate(e.target.checked)}
                        className="mr-1"
                    />
                    Auto-rotate
                </label>
            </div>

            <div className="h-64">
                <Canvas
                    camera={{
                        position: [0, 0, 10],
                        fov: 45
                    }}
                >
                    <color attach="background" args={['#1e293b']} />
                    <ambientLight intensity={0.7} />
                    <pointLight position={[10, 10, 10]} intensity={1} />
                    <spotLight position={[-10, -10, 10]} angle={0.15} penumbra={1} intensity={0.5} />

                    <OrbitControls
                        enablePan={true}
                        enableZoom={true}
                        enableRotate={true}
                        autoRotate={autoRotate}
                        autoRotateSpeed={1.5}
                        minDistance={2}
                        maxDistance={20}
                    />

                    {/* Title */}
                    <Html position={[0, -4.5, 0]} center>
                        <div className="px-3 py-1 bg-black bg-opacity-80 rounded text-white text-sm font-bold">
                            {chartType === 'doughnut' ? 'Donut' : 'Pie'} Chart: {xAxisField} vs {yAxisField}
                        </div>
                    </Html>

                    {/* Legend */}
                    <Html position={[-6, 0, 0]}>
                        <div className="px-3 py-2 bg-black bg-opacity-80 rounded text-white">
                            <div className="text-sm font-bold mb-1">Legend</div>
                            {segments.map((segment, i) => (
                                <div key={i} className="flex items-center text-xs mb-1">
                                    <div
                                        className="w-3 h-3 mr-1 rounded-sm"
                                        style={{ backgroundColor: segment.color }}
                                    />
                                    {segment.label} ({segment.percentage}%)
                                </div>
                            ))}
                            <div className="text-xs mt-2">
                                <strong>Total:</strong> {total}
                            </div>
                        </div>
                    </Html>

                    <group rotation={[Math.PI / 2, 0, 0]}>
                        {segments.map((segment) => (
                            <PieSegment
                                key={segment.key}
                                startAngle={segment.startAngle}
                                endAngle={segment.endAngle}
                                radius={radius}
                                height={height}
                                color={segment.color}
                                label={segment.label}
                                value={segment.value}
                                percentage={segment.percentage}
                                thickness={thickness}
                            />
                        ))}
                    </group>
                </Canvas>
            </div>
        </div>
    );
}