import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';

const Bar = ({ position, height, color, label }) => {
    return (
        <group position={position}>
            {/* The actual bar */}
            <mesh>
                <boxGeometry args={[0.8, height, 0.8]} />
                <meshStandardMaterial color={color} />
            </mesh>

            {/* Category label below the bar */}
            <Html position={[0, -0.9, 0]} center distanceFactor={10}>
                <div className="px-2 py-1 bg-black bg-opacity-80 rounded text-white text-sm font-bold">
                    {label}
                </div>
            </Html>
        </group>
    );
};

export default function ThreeBarChart({ labels, values }) {
    const [xGap, setXGap] = useState(1.5);
    const [yScale, setYScale] = useState(4);
    const [zOffset, setZOffset] = useState(0);

    const max = Math.max(...values);
    const numBars = values.length;

    // Center the bars horizontally
    const totalWidth = numBars * xGap;
    const startX = -totalWidth / 2 + xGap / 2;

    // Calculate proper camera position based on number of bars
    const defaultCameraX = Math.max(numBars * 0.7, 6);
    const defaultCameraY = 4;
    const defaultCameraZ = Math.max(numBars * 0.9, 8);

    const bars = values.map((v, i) => {
        const height = Math.max((v / max) * yScale, 0.1); // Ensure minimum height for visibility
        return (
            <Bar
                key={i}
                position={[startX + i * xGap, height / 2, zOffset]}
                height={height}
                color={`hsl(${(i * 137.5) % 360}, 70%, 60%)`}
                label={labels[i]}
            />
        );
    });

    return (
        <div className="w-full h-full bg-gray-800 dark:bg-gray-900 rounded-lg">
            <div className="flex gap-3 justify-center py-2 bg-gray-700 dark:bg-gray-800 rounded-t-lg border-b border-gray-600">
                <label className="text-sm text-white flex items-center">
                    X Gap:
                    <input
                        type="number"
                        value={xGap}
                        step="0.1"
                        min="0.5"
                        max="3"
                        onChange={e => setXGap(Number(e.target.value))}
                        className="ml-1 w-14 px-1 py-0.5 rounded border bg-white text-black dark:bg-gray-800 dark:text-white"
                    />
                </label>
                <label className="text-sm text-white flex items-center">
                    Y Scale:
                    <input
                        type="number"
                        value={yScale}
                        step="0.5"
                        min="0.5"
                        onChange={e => setYScale(Number(e.target.value))}
                        className="ml-1 w-14 px-1 py-0.5 rounded border bg-white text-black dark:bg-gray-800 dark:text-white"
                    />
                </label>
                <label className="text-sm text-white flex items-center">
                    Z Offset:
                    <input
                        type="number"
                        value={zOffset}
                        step="0.1"
                        onChange={e => setZOffset(Number(e.target.value))}
                        className="ml-1 w-14 px-1 py-0.5 rounded border bg-white text-black dark:bg-gray-800 dark:text-white"
                    />
                </label>
            </div>

            <div className="h-64">
                <Canvas
                    camera={{
                        position: [defaultCameraX, defaultCameraY, defaultCameraZ],
                        fov: 45
                    }}
                >
                    <color attach="background" args={['#1e293b']} />
                    <ambientLight intensity={0.7} />
                    <directionalLight position={[10, 10, 5]} intensity={1} />
                    <directionalLight position={[-10, 10, 5]} intensity={0.5} />
                    <OrbitControls
                        enablePan={true}
                        enableZoom={true}
                        enableRotate={true}
                        minDistance={2}
                        maxDistance={50}
                    />
                    <gridHelper args={[50, 50, '#666666', '#444444']} position={[0, -0.01, 0]} />
                    <group>
                        {bars}
                    </group>
                </Canvas>
            </div>
        </div>
    );
}