import React, { useState, useRef, useEffect } from 'react';
import { Upload, X, RotateCcw, ZoomIn, ZoomOut} from 'lucide-react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const Playground = () => {
    const [file, setFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [viewerOptions, setViewerOptions] = useState({
        autoRotate: false,
        wireframe: false,
        zoomLevel: 1,
    });
    const containerRef = useRef(null);
    const fileInputRef = useRef(null);
    const rendererRef = useRef(null);
    const sceneRef = useRef(null);
    const cameraRef = useRef(null);
    const controlsRef = useRef(null);
    const animationRef = useRef(null);
    const modelRef = useRef(null);

    const processFile = (selectedFile) => {
        if (!selectedFile) return;
        const ext = selectedFile.name.split('.').pop().toLowerCase();
        if (ext !== 'glb') {
            setErrorMessage('Only GLB files are supported.');
            return;
        }
        setErrorMessage('');
        setFile(selectedFile);
        setIsLoading(true);
        setViewerOptions({ autoRotate: false, wireframe: false, zoomLevel: 1 });
    };

    const resetView = () => {
        if (controlsRef.current && cameraRef.current) {
            controlsRef.current.reset();
            cameraRef.current.position.set(0, 1.5, 3);
            cameraRef.current.lookAt(0, 0, 0);
            controlsRef.current.update();
        }
    };
    const toggleAutoRotate = () => {
        setViewerOptions((prev) => {
            const newVal = !prev.autoRotate;
            if (controlsRef.current) controlsRef.current.autoRotate = newVal;
            return { ...prev, autoRotate: newVal };
        });
    };
    const toggleWireframe = () => {
        setViewerOptions((prev) => {
            const newVal = !prev.wireframe;
            if (modelRef.current) {
                modelRef.current.traverse((child) => {
                    if (child.isMesh && child.material) {
                        child.material.wireframe = newVal;
                    }
                });
            }
            return { ...prev, wireframe: newVal };
        });
    };
    const handleZoom = (dir) => {
        const newZoom = Math.max(0.5, Math.min(viewerOptions.zoomLevel + dir * 0.1, 2));
        setViewerOptions((prev) => ({ ...prev, zoomLevel: newZoom }));
        if (cameraRef.current) {
            cameraRef.current.zoom = newZoom;
            cameraRef.current.updateProjectionMatrix();
        }
    };
    const clearModel = () => {
        setFile(null);
        setIsLoading(false);
        if (rendererRef.current) {
            rendererRef.current.dispose();
            rendererRef.current.forceContextLoss();
            rendererRef.current.domElement = null;
            rendererRef.current = null;
        }
        if (sceneRef.current && modelRef.current) {
            modelRef.current.traverse((child) => {
                if (child.isMesh) {
                    child.geometry?.dispose();
                    if (Array.isArray(child.material)) {
                        child.material.forEach(m => m.dispose());
                    } else {
                        child.material?.dispose();
                    }
                }
            });
            sceneRef.current.remove(modelRef.current);
            modelRef.current = null;
        }
        if (containerRef.current) {
            containerRef.current.innerHTML = '';
        }
    };
    useEffect(() => {
        if (!file || !containerRef.current) return;

        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;

        const scene = new THREE.Scene();
        scene.background = new THREE.Color('#1e1e1e'); // always dark

        sceneRef.current = scene;

        const ambientLight = new THREE.AmbientLight(0xffffff, 1);
        scene.add(ambientLight);

        const camera = new THREE.PerspectiveCamera(60, width / height, 0.01, 500);
        camera.position.set(0, 1.5, 3);
        cameraRef.current = camera;

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(window.devicePixelRatio);
        containerRef.current.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.autoRotate = viewerOptions.autoRotate;
        controlsRef.current = controls;

        const animate = () => {
            animationRef.current = requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        };
        animate();

        const onResize = () => {
            const w = containerRef.current.clientWidth;
            const h = containerRef.current.clientHeight;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
        };
        window.addEventListener('resize', onResize);

        return () => {
            cancelAnimationFrame(animationRef.current);
            window.removeEventListener('resize', onResize);
            renderer.dispose();
            controls.dispose();
        };
    }, [file]);

    useEffect(() => {
        if (!file || !sceneRef.current) return;
        const loader = new GLTFLoader();
        const url = URL.createObjectURL(file);

        if (modelRef.current) {
            sceneRef.current.remove(modelRef.current);
            modelRef.current = null;
        }

        setIsLoading(true);

        loader.load(
            url,
            (gltf) => {
                const model = gltf.scene;
                const box = new THREE.Box3().setFromObject(model);
                const center = box.getCenter(new THREE.Vector3());
                model.position.sub(center);

                const boundingSphere = box.getBoundingSphere(new THREE.Sphere());
                const distance = boundingSphere.radius * 2;
                cameraRef.current.position.set(0, boundingSphere.radius, distance);
                controlsRef.current.target.set(0, 0, 0);
                controlsRef.current.update();

                model.traverse((child) => {
                    if (child.isMesh) {
                        child.castShadow = true;
                        child.receiveShadow = true;
                        if (viewerOptions.wireframe && child.material) {
                            child.material.wireframe = true;
                        }
                    }
                });

                sceneRef.current.add(model);
                modelRef.current = model;
                setIsLoading(false);
                URL.revokeObjectURL(url);
            },
            undefined,
            (err) => {
                console.error('Failed to load GLB:', err);
                setErrorMessage('Failed to load 3D model.');
                setIsLoading(false);
                URL.revokeObjectURL(url);
            }
        );
    }, [file]);

    return (
        <div className="w-full h-screen bg-white dark:bg-[#121212] text-black dark:text-white relative">
            {!file ? (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg bg-gray-100 dark:bg-[#1e1e1e]">
                    <Upload size={48} className="text-gray-500 dark:text-gray-400 mb-4" />
                    <p className="mb-2">Drop a .glb file or click to upload</p>
                    <button onClick={() => fileInputRef.current.click()} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white">Browse Files</button>
                    <input ref={fileInputRef} type="file" accept=".glb" className="hidden" onChange={(e) => processFile(e.target.files[0])} />
                    {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
                </div>
            ) : (
                <>
                    <div ref={containerRef} className="w-full h-full absolute top-0 left-0" />
                    {isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center z-20">
                            <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin" />
                        </div>
                    )}

                    <div className="absolute top-4 right-4 flex flex-col gap-2 z-20">
                        <button onClick={resetView} title="Reset View" className="bg-white dark:bg-gray-800 text-black dark:text-white p-2 rounded-full shadow"><RotateCcw size={20} /></button>
                        <button onClick={toggleAutoRotate} title="Toggle Auto-Rotate" className={`p-2 rounded-full shadow ${viewerOptions.autoRotate ? 'bg-blue-500 text-white' : 'bg-white dark:bg-gray-800 text-black dark:text-white'}`}>⟳</button>
                        <button onClick={toggleWireframe} title="Toggle Wireframe" className={`p-2 rounded-full shadow ${viewerOptions.wireframe ? 'bg-blue-500 text-white' : 'bg-white dark:bg-gray-800 text-black dark:text-white'}`}>🧱</button>
                        <button onClick={() => handleZoom(1)} title="Zoom In" className="bg-white dark:bg-gray-800 text-black dark:text-white p-2 rounded-full shadow"><ZoomIn size={20} /></button>
                        <button onClick={() => handleZoom(-1)} title="Zoom Out" className="bg-white dark:bg-gray-800 text-black dark:text-white p-2 rounded-full shadow"><ZoomOut size={20} /></button>
                        <button onClick={clearModel} title="Clear Model" className="bg-white dark:bg-gray-800 text-black dark:text-white p-2 rounded-full shadow"><X size={20} /></button>
                    </div>

                    <div className="absolute bottom-4 left-4 bg-white dark:bg-gray-800 text-black dark:text-white px-4 py-2 rounded shadow z-20">
                        {file.name}
                    </div>
                </>
            )}
        </div>
    );
};

export default Playground;
