/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';

const DataPoint = ({ position, color, label, value, onHover, onLeave }) => {
    return (
        <group position={position}>
            {/* The point */}
            <mesh onPointerOver={onHover} onPointerOut={onLeave}>
                <sphereGeometry args={[0.2, 16, 16]} />
                <meshStandardMaterial color={color} metalness={0.3} roughness={0.4} />
            </mesh>

            {/* Label */}
            <Html position={[0, 0.5, 0]} center distanceFactor={10}>
                <div className="px-2 py-1 bg-black bg-opacity-80 rounded text-white text-xs whitespace-nowrap">
                    {label}: {value}
                </div>
            </Html>
        </group>
    );
};

const Line = ({ points, color }) => {
    const lineGeometry = useMemo(() => {
        const geometry = new THREE.BufferGeometry().setFromPoints(
            points.map(point => new THREE.Vector3(...point))
        );
        return geometry;
    }, [points]);

    return (
        <line geometry={lineGeometry}>
            <lineBasicMaterial attach="material" color={color} linewidth={2} />
        </line>
    );
};

export default function ThreeLineChart({ labels, values, xAxisField, yAxisField }) {
    const [showLabels, setShowLabels] = useState(true);
    const [lineThickness, setLineThickness] = useState(2);
    const [autoRotate, setAutoRotate] = useState(false);
    const [hoveredPoint, setHoveredPoint] = useState(null);
    const [smoothCurve, setSmoothCurve] = useState(false);

    const color = '#4c7eff';
    const maxValue = Math.max(...values);
    const minValue = Math.min(...values);
    const valueRange = maxValue - minValue;

    // Scale factor for better visualization
    const yScale = valueRange > 0 ? 5 / valueRange : 1;

    // Create points for line
    const points = useMemo(() => {
        const numPoints = values.length;
        if (numPoints < 2) return [];

        // Calculate the width of the chart based on number of points
        const totalWidth = Math.max(numPoints - 1, 1) * 2;
        const startX = -totalWidth / 2;

        return values.map((value, i) => {
            // Normalize values to start from 0 (shifts the whole graph up)
            const normalizedValue = (value - minValue) * yScale;
            return [startX + i * 2, normalizedValue, 0];
        });
    }, [values, minValue, yScale]);

    // Create smooth curve points if enabled
    const curvePoints = useMemo(() => {
        if (!smoothCurve || points.length < 2) return points;

        const curve = new THREE.CatmullRomCurve3(
            points.map(p => new THREE.Vector3(p[0], p[1], p[2]))
        );

        // Generate more points for a smoother curve
        const numPoints = points.length * 5;
        return Array.from({ length: numPoints }, (_, i) => {
            const t = i / (numPoints - 1);
            const point = curve.getPoint(t);
            return [point.x, point.y, point.z];
        });
    }, [points, smoothCurve]);

    return (
        <div className="w-full h-full bg-gray-800 dark:bg-gray-900 rounded-lg">
            <div className="flex flex-wrap gap-3 justify-center py-2 bg-gray-700 dark:bg-gray-800 rounded-t-lg border-b border-gray-600">
                <div className="flex items-center text-white px-3">
                    <span className="text-sm font-medium mr-2">X: {xAxisField || 'Category'}</span>
                    <span className="text-sm font-medium mx-2">Y: {yAxisField || 'Value'}</span>
                </div>

                <label className="text-sm text-white flex items-center">
                    <input
                        type="checkbox"
                        checked={showLabels}
                        onChange={e => setShowLabels(e.target.checked)}
                        className="mr-1"
                    />
                    Show Labels
                </label>
                <label className="text-sm text-white flex items-center">
                    <input
                        type="checkbox"
                        checked={smoothCurve}
                        onChange={e => setSmoothCurve(e.target.checked)}
                        className="mr-1"
                    />
                    Smooth Curve
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
                        position: [0, 3, 10],
                        fov: 45
                    }}
                >
                    <color attach="background" args={['#1e293b']} />
                    <ambientLight intensity={0.7} />
                    <pointLight position={[10, 10, 10]} intensity={1} />
                    <directionalLight position={[-10, 10, 5]} intensity={0.5} />

                    <OrbitControls
                        enablePan={true}
                        enableZoom={true}
                        enableRotate={true}
                        autoRotate={autoRotate}
                        autoRotateSpeed={1}
                        minDistance={2}
                        maxDistance={50}
                    />

                    {/* Draw grid */}
                    <gridHelper args={[40, 40, '#666666', '#444444']} position={[0, -0.1, 0]} rotation={[0, 0, 0]} />

                    {/* Draw connecting line */}
                    <Line points={smoothCurve ? curvePoints : points} color={color} />

                    {/* Draw data points */}
                    {points.map((point, i) => (
                        showLabels &&
                        <DataPoint
                            key={i}
                            position={point}
                            color={color}
                            label={labels[i]}
                            value={values[i]}
                            onHover={() => setHoveredPoint(i)}
                            onLeave={() => setHoveredPoint(null)}
                        />
                    ))}

                    {/* Axis labels */}
                    <Html position={[-points.length, -0.5, 0]} center>
                        <div className="px-2 py-1 bg-black bg-opacity-80 rounded text-white text-sm">
                            {xAxisField || 'Category'}
                        </div>
                    </Html>
                    <Html position={[-points.length, (maxValue - minValue) * yScale / 2, 0]} center>
                        <div className="px-2 py-1 bg-black bg-opacity-80 rounded text-white text-sm">
                            {yAxisField || 'Value'}
                        </div>
                    </Html>

                    {/* Min and max values */}
                    <Html position={[-points.length, 0, 0]} center>
                        <div className="px-2 py-1 bg-black bg-opacity-80 rounded text-white text-xs">
                            Min: {minValue}
                        </div>
                    </Html>
                    <Html position={[-points.length, (maxValue - minValue) * yScale, 0]} center>
                        <div className="px-2 py-1 bg-black bg-opacity-80 rounded text-white text-xs">
                            Max: {maxValue}
                        </div>
                    </Html>
                </Canvas>
            </div>
        </div>
    );
}