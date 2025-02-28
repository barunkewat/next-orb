"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import React from "react";

const Orb = ({
  totalImages = 30,
  totalItems = 100,
  baseWidth = 1,
  baseHeight = 0.6,
  sphereRadius = 5,
  backgroundColor = "#3b3b3b",
}) => {
  const orbRef = useRef();

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true,
      powerPreference: "high-performance",
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(new THREE.Color(backgroundColor));
    renderer.setPixelRatio(window.devicePixelRatio);

    orbRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 1.2;
    controls.minDistance = 6;
    controls.maxDistance = 10;
    controls.enableZoom = true;
    controls.enablePan = false;

    const textureLoader = new THREE.TextureLoader();
    let loadedCount = 0;

    const getRandomImagePath = () => {
      return `/assets/img${Math.floor(Math.random() * totalImages) + 1}.jpg`;
    };

    const createImagePlane = (texture) => {
      const imageAspect = texture.image.width / texture.image.height;
      let width = baseWidth;
      let height = baseHeight;

      if (imageAspect > 1) {
        height = width / imageAspect;
      } else {
        width = width * imageAspect;
      }

      return new THREE.PlaneGeometry(width, height);
    };

    const loadImageMesh = (phi, theta) => {
      textureLoader.load(
        getRandomImagePath(),
        (texture) => {
          texture.generateMipmaps = false;
          texture.minFilter = THREE.LinearFilter;
          texture.magFilter = THREE.LinearFilter;

          const geometry = createImagePlane(texture);
          const material = new THREE.MeshBasicMaterial({
            map: texture,
            side: THREE.DoubleSide,
            transparent: false,
            depthWrite: true,
            depthTest: true,
          });

          const mesh = new THREE.Mesh(geometry, material);
          mesh.position.set(
            sphereRadius * Math.cos(theta) * Math.sin(phi),
            sphereRadius * Math.sin(theta) * Math.sin(phi),
            sphereRadius * Math.cos(phi)
          );
          mesh.lookAt(0, 0, 0);
          mesh.rotateY(Math.PI);

          scene.add(mesh);
          loadedCount++;
          if (loadedCount === totalItems) {
            animate();
          }
        },
        undefined,
        (error) => console.error("Texture loading error:", error)
      );
    };

    const createSphere = () => {
      for (let i = 0; i < totalItems; i++) {
        const phi = Math.acos(-1 + (2 * i) / totalItems);
        const theta = Math.sqrt(totalItems * Math.PI) * phi;
        loadImageMesh(phi, theta);
      }
    };

    camera.position.z = 10;

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };

    window.addEventListener("resize", () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    });

    createSphere();

    return () => {
      if (orbRef.current) {
        orbRef.current.removeChild(renderer.domElement);
      }
    };
  }, [
    totalImages,
    totalItems,
    baseWidth,
    baseHeight,
    sphereRadius,
    backgroundColor,
  ]);

  return <div className="orb" ref={orbRef}></div>;
};

export default Orb;
