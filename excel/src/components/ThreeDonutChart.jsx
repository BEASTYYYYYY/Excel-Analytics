import React, { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';

const PieSegment = ({ startAngle, endAngle, radius, height, color, label, value, thickness = 1 }) => {
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
    const labelPosition = [(radius * 0.75) * Math.cos(midAngle), (radius * 0.75) * Math.sin(midAngle), height / 2 + 0.1];

    const extrudeSettings = {
        steps: 2,
        depth: height,
        bevelEnabled: true,
        bevelThickness: 0.2,
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
                <div className="px-2 py-1 bg-black bg-opacity-80 rounded text-white text-xs whitespace-nowrap transform -translate-x-1/2">
                    <strong>{label}</strong>: {value}
                </div>
            </Html>
        </group>
    );
};

export default function ThreeDonutChart({ chartType, labels, values }) {
    // Calculate total for percentages
    const total = useMemo(() => values.reduce((sum, val) => sum + val, 0), [values]);

    // Calculate segments
    const segments = useMemo(() => {
        let currentAngle = 0;
        const segmentData = [];

        values.forEach((value, index) => {
            const proportion = value / total;
            const angle = proportion * Math.PI * 2;

            // Generate color based on index
            const hue = (index * 137) % 360; // Golden angle distribution for colors
            const color = `hsl(${hue}, 70%, 60%)`;

            segmentData.push({
                startAngle: currentAngle,
                endAngle: currentAngle + angle,
                value,
                label: labels[index],
                color
            });

            currentAngle += angle;
        });

        return segmentData;
    }, [labels, values, total]);

    // Determine if it's a donut chart
    const thickness = chartType === 'doughnut' ? 0.6 : 1;

    return (
        <div className="w-full h-full bg-gray-800 dark:bg-gray-900 rounded-lg">
            <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
                <color attach="background" args={['#1e293b']} />
                <ambientLight intensity={0.5} />
                <directionalLight position={[5, 5, 5]} intensity={1} />
                <pointLight position={[-5, -5, 5]} intensity={0.5} />

                <group rotation={[Math.PI / 4, 0, 0]}>
                    {segments.map((segment, idx) => (
                        <PieSegment
                            key={idx}
                            startAngle={segment.startAngle}
                            endAngle={segment.endAngle}
                            radius={4}
                            height={1}
                            thickness={thickness}
                            color={segment.color}
                            label={segment.label}
                            value={segment.value}
                        />
                    ))}
                </group>

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