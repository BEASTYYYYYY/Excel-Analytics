import React, { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Html, Line } from '@react-three/drei';
import * as THREE from 'three';

const DataLine = ({ points, labels, values }) => {
    // Generate line points
    const linePoints = useMemo(() => {
        return points.map(p => new THREE.Vector3(p.x, p.y, p.z));
    }, [points]);

    return (
        <group>
            {/* Draw the line */}
            <Line
                points={linePoints}
                color="hsl(210, 70%, 60%)"
                lineWidth={5}
            />

            {/* Draw points and labels */}
            {points.map((point, index) => (
                <group key={index} position={[point.x, point.y, point.z]}>
                    <mesh>
                        <sphereGeometry args={[0.2, 16, 16]} />
                        <meshStandardMaterial color="hsl(210, 70%, 60%)" />
                    </mesh>

                    <Html position={[0, 0.5, 0]} center>
                        <div className="px-2 py-1 bg-black bg-opacity-80 rounded text-white text-xs font-bold">
                            {values[index]}
                        </div>
                    </Html>

                    <Html position={[0, -1.5, 0]} center>
                        <div className="px-2 py-1 bg-black bg-opacity-80 rounded text-white text-xs">
                            {labels[index]}
                        </div>
                    </Html>
                </group>
            ))}
        </group>
    );
};

const GridPlane = () => {
    return (
        <group position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <mesh>
                <planeGeometry args={[20, 20]} />
                <meshBasicMaterial color="#333" wireframe={true} />
            </mesh>
        </group>
    );
};

export default function ThreeLineChart({ labels, values }) {
    // Calculate normalized points
    const points = useMemo(() => {
        const maxValue = Math.max(...values);
        const numPoints = values.length;

        return values.map((value, index) => {
            // Calculate x position to spread points evenly
            const x = (index - (numPoints - 1) / 2) * 2;

            // Normalize y position based on value
            const y = (value / maxValue) * 5;

            return { x, y, z: 0 };
        });
    }, [values]);

    return (
        <div className="w-full h-80 bg-gray-800 dark:bg-gray-900 rounded-lg">
            <Canvas camera={{ position: [0, 5, 10], fov: 45 }}>
                <color attach="background" args={['#1e293b']} />
                <ambientLight intensity={0.7} />
                <directionalLight position={[10, 10, 5]} intensity={1} />

                <GridPlane />
                <DataLine points={points} labels={labels} values={values} />

                <OrbitControls
                    enablePan={true}
                    enableZoom={true}
                    enableRotate={true}
                    minDistance={5}
                    maxDistance={20}
                />
            </Canvas>
        </div>
    );
}