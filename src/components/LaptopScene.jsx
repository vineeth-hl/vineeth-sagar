import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { RoundedBox, ContactShadows, Environment, Lightformer, Instances, Instance, MeshReflectorMaterial } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js';

// required once so <rectAreaLight> actually emits (loads its BRDF LUTs)
RectAreaLightUniformsLib.init();

/*
 * ─────────────────────────────────────────────────────────────────────────────
 * Swapping in a real .glb model
 * ─────────────────────────────────────────────────────────────────────────────
 * Drop a glTF laptop (with PBR metallic/roughness/normal maps) at
 *   public/assets/laptop.glb
 * then replace <Laptop/> below with something like:
 *
 *   import { useGLTF } from '@react-three/drei';
 *   useGLTF.preload('/assets/laptop.glb');
 *   function Laptop({ progress, screenRef }) {
 *     const { nodes } = useGLTF('/assets/laptop.glb');
 *     const lid = useRef();               // <-- the lid / screen node from `nodes`
 *     useFrame(() => {
 *       const p = progress.current;
 *       lid.current.rotation.x = THREE.MathUtils.lerp(0, -Math.PI / 2, easeInOutCubic(remap(p, 0.06, 0.42)));
 *       ...drive an emissive screen material + screenRef anchor the same way...
 *     });
 *     return <primitive object={nodes.Scene} />;  // parent the lid ref to the model's hinge node
 *   }
 *
 * The camera dive, bloom, lighting and DOM hand-off below stay exactly the same.
 * ─────────────────────────────────────────────────────────────────────────────
 */

const { lerp, clamp } = THREE.MathUtils;
const remap = (p, a, b) => clamp((p - a) / (b - a), 0, 1);
const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
// GSAP's expo.inOut — pronounced accel then long glide, for the hinge
const easeInOutExpo = (t) =>
    t <= 0 ? 0 : t >= 1 ? 1 : t < 0.5 ? Math.pow(2, 20 * t - 10) / 2 : (2 - Math.pow(2, -20 * t + 10)) / 2;

/* Procedural "screen" texture — a BRIGHT powered-on monitor: deep blue at the
   top blending to electric cyan, with a hot near-white bloom from the centre.
   Drives both `map` and `emissiveMap`, so with a high emissiveIntensity the
   panel genuinely glows and blooms as the camera dives into it. */
function makeScreenTexture() {
    const c = document.createElement('canvas');
    c.width = 512;
    c.height = 320;
    const g = c.getContext('2d');
    const lin = g.createLinearGradient(0, 0, 0, 320);
    lin.addColorStop(0, '#173a94');
    lin.addColorStop(0.55, '#2f83db');
    lin.addColorStop(1, '#8fdcff');
    g.fillStyle = lin;
    g.fillRect(0, 0, 512, 320);
    const rg = g.createRadialGradient(256, 150, 8, 256, 150, 300);
    rg.addColorStop(0, 'rgba(255,255,255,0.92)');
    rg.addColorStop(0.4, 'rgba(205,238,255,0.34)');
    rg.addColorStop(1, 'rgba(140,200,255,0)');
    g.fillStyle = rg;
    g.fillRect(0, 0, 512, 320);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
}

// anodised-aluminium chassis vs. matte-plastic keycaps
const CHASSIS = { color: '#1b1c20', metalness: 0.85, roughness: 0.3, envMapIntensity: 1.2 };
const KEYCAP = { color: '#0c0c0e', metalness: 0.1, roughness: 0.85, envMapIntensity: 0.6 };

function Keyboard() {
    const keys = useMemo(() => {
        const arr = [];
        const cols = 14;
        const rows = 5;
        const kw = 0.16;
        const gap = 0.038;
        const startX = -((cols - 1) * (kw + gap)) / 2;
        const startZ = -0.42;
        for (let r = 0; r < rows; r += 1) {
            for (let cN = 0; cN < cols; cN += 1) {
                arr.push([startX + cN * (kw + gap), startZ + r * (kw + gap)]);
            }
        }
        return arr;
    }, []);

    return (
        <Instances range={keys.length} position={[0, 0.066, 0.06]} castShadow>
            <boxGeometry args={[0.14, 0.03, 0.14]} />
            <meshStandardMaterial {...KEYCAP} />
            {keys.map((k, i) => (
                <Instance key={i} position={[k[0], 0, k[1]]} />
            ))}
        </Instances>
    );
}

function Laptop({ progress, screenRef, diveTargetRef }) {
    const root = useRef();
    const lidPivot = useRef();
    const screenMat = useRef();
    const screenLight = useRef();
    const rectLight = useRef();
    const tex = useMemo(makeScreenTexture, []);

    useFrame((state) => {
        if (!root.current || !lidPivot.current || !screenMat.current || !rectLight.current || !screenLight.current) {
            return;
        }
        const p = progress.current;
        const t = state.clock.elapsedTime;

        // gentle idle float before the sequence starts
        const calm = 1 - remap(p, 0.02, 0.12);
        root.current.rotation.y = Math.sin(t * 0.5) * 0.04 * calm;
        root.current.position.y = -0.75 + Math.sin(t * 0.9) * 0.013 * calm;

        // hinge: authored SHUT at rotation.x === 0 (panel flat on the deck),
        // eases open with an expo in/out curve to exactly -90deg — screen ends
        // perpendicular to the camera, never past -PI/2. This runs on the same
        // scroll timeline as the camera dive below, so the two overlap.
        const open = easeInOutExpo(remap(p, 0.04, 0.46));
        lidPivot.current.rotation.x = lerp(0, -Math.PI / 2, open);

        // screen powers on BRIGHT as the lid opens, then a second surge as the
        // camera dives in so it fills the viewport as a glowing monitor. It
        // never dims here — the identity panel boots straight onto the lit
        // screen; LaptopDive settles it to #0D0D0D only over the last sliver.
        const powerOn = easeOutCubic(remap(p, 0.1, 0.4));
        const surge = easeInOutCubic(remap(p, 0.42, 0.8));
        screenMat.current.emissiveIntensity = powerOn * 1.5 + surge * 1.9;
        rectLight.current.intensity = powerOn * 3.2 + surge * 1.6;
        screenLight.current.intensity = powerOn * 3 + surge * 2.2;
    });

    return (
        <group ref={root} position={[0, -0.75, 0]} scale={0.82}>
            {/* base */}
            <RoundedBox args={[3.1, 0.12, 2.12]} radius={0.05} smoothness={3} castShadow receiveShadow>
                <meshStandardMaterial {...CHASSIS} />
            </RoundedBox>
            {/* deck inset */}
            <mesh position={[0, 0.062, 0.02]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                <planeGeometry args={[2.84, 1.86]} />
                <meshStandardMaterial color="#0d0e10" metalness={0.55} roughness={0.6} envMapIntensity={0.5} />
            </mesh>
            <Keyboard />
            {/* trackpad */}
            <mesh position={[0, 0.066, 0.66]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[0.98, 0.66]} />
                <meshStandardMaterial color="#202227" metalness={0.4} roughness={0.35} envMapIntensity={0.7} />
            </mesh>
            {/* feet */}
            {[[-1.3, -0.85], [1.3, -0.85], [-1.3, 0.85], [1.3, 0.85]].map((f, i) => (
                <mesh key={i} position={[f[0], -0.07, f[1]]}>
                    <cylinderGeometry args={[0.06, 0.06, 0.03, 16]} />
                    <meshStandardMaterial color="#08090a" roughness={0.8} />
                </mesh>
            ))}

            {/* lid, hinged at the back edge of the deck.
                Authored SHUT: the inner group tips the vertically-modelled panel
                forward (+Y -> +Z) so that at lidPivot.rotation.x === 0 it lies
                flat over the keyboard, screen face down. Hinging lidPivot to
                -Math.PI/2 stands it up 90deg with the screen facing the camera. */}
            <group ref={lidPivot} position={[0, 0.13, -1.03]}>
                <group rotation={[Math.PI / 2, 0, 0]}>
                    {/* lid shell */}
                    <RoundedBox args={[3.1, 2.0, 0.09]} radius={0.05} smoothness={3} position={[0, 1.0, -0.02]} castShadow>
                        <meshStandardMaterial {...CHASSIS} />
                    </RoundedBox>
                    {/* black bezel */}
                    <mesh position={[0, 1.0, 0.028]}>
                        <planeGeometry args={[2.96, 1.86]} />
                        <meshStandardMaterial color="#050506" metalness={0.2} roughness={0.5} />
                    </mesh>
                    {/* the screen — MeshStandardMaterial lit by a bright
                        blue/cyan emissiveMap; toneMapped off so it stays vivid
                        and blows toward white as the camera closes in. */}
                    <mesh position={[0, 1.0, 0.03]}>
                        <planeGeometry args={[2.82, 1.72]} />
                        <meshStandardMaterial
                            ref={screenMat}
                            map={tex}
                            color="#0a1530"
                            emissive="#cfe8ff"
                            emissiveMap={tex}
                            emissiveIntensity={0}
                            metalness={0}
                            roughness={0.4}
                            toneMapped={false}
                        />
                    </mesh>
                    {/* rectangular backlight pool — sized to the panel, tilted so
                        its beam sweeps the keyboard as the lid hinges up. Grouped
                        with the lid, so it moves with the screen. */}
                    <rectAreaLight
                        ref={rectLight}
                        position={[0, 1.0, 0.09]}
                        rotation={[-Math.PI / 2 - 0.35, 0, 0]}
                        width={2.82}
                        height={1.72}
                        color="#bcd2ff"
                        intensity={0}
                    />
                    {/* camera notch */}
                    <mesh position={[0, 1.9, 0.031]}>
                        <circleGeometry args={[0.014, 16]} />
                        <meshStandardMaterial color="#0b1220" roughness={0.3} />
                    </mesh>
                    {/* live aim anchor (rides the lid) + spill light */}
                    <group ref={screenRef} position={[0, 1.0, 0.06]} />
                    <pointLight ref={screenLight} position={[0, 1.0, 0.8]} distance={8} decay={1.6} color="#cfe0ff" intensity={0} />
                </group>
            </group>

            {/* FIXED dive target — the exact world spot the screen centre occupies
                once the lid is fully open. Parented to `root`, NOT the lid, so it
                never moves: the camera dive aims here and therefore travels level
                with the screen centre instead of dipping toward the keyboard. */}
            <group ref={diveTargetRef} position={[0, 1.13, -1.0]} />
        </group>
    );
}

function CameraRig({ progress, screenRef, diveTargetRef }) {
    const { camera, size } = useThree();
    const live = useRef(new THREE.Vector3()); // screen anchor as it rides the lid
    const tgt = useRef(new THREE.Vector3()); // FIXED screen centre (lid fully open)
    const framePos = useRef(new THREE.Vector3());
    const frameLook = useRef(new THREE.Vector3());
    const divePos = useRef(new THREE.Vector3());
    const diveLook = useRef(new THREE.Vector3());
    const outPos = useRef(new THREE.Vector3());
    const outLook = useRef(new THREE.Vector3());

    useFrame(() => {
        if (!screenRef.current || !diveTargetRef.current) return;
        const aspect = size.width / Math.max(1, size.height);

        // wider fov on narrow / short viewports so the laptop always fits
        const targetFov = aspect < 1.15 ? 58 : aspect < 1.7 ? 50 : 45;
        if (Math.abs(camera.fov - targetFov) > 0.2) {
            camera.fov = targetFov;
            camera.updateProjectionMatrix();
        }

        screenRef.current.getWorldPosition(live.current);
        diveTargetRef.current.getWorldPosition(tgt.current);

        const p = progress.current;
        // dive shares the hinge's timeline (starts while the lid is still
        // arcing back) and lands just before the panel boots (DIVE_END 0.8).
        const dive = easeInOutCubic(remap(p, 0.16, 0.78));

        // BOTH poses take their Y from the fixed screen centre (`tgt`), never
        // from the live anchor — so the camera path stays level with the screen
        // and cannot dip into the keyboard/base geometry.
        const back = aspect < 1.1 ? 5.2 : aspect < 1.7 ? 4.6 : 4.9;
        framePos.current.set(tgt.current.x, tgt.current.y + 0.6, tgt.current.z + back);
        frameLook.current.copy(live.current); // tilt to follow the lid as it rises

        // dive pose — dead level with the screen centre, nose right against the
        // glass, aimed straight through it.
        divePos.current.set(tgt.current.x, tgt.current.y, tgt.current.z + 0.12);
        diveLook.current.set(tgt.current.x, tgt.current.y, tgt.current.z - 0.6);

        camera.position.copy(outPos.current.copy(framePos.current).lerp(divePos.current, dive));
        camera.lookAt(outLook.current.copy(frameLook.current).lerp(diveLook.current, dive));
    });

    return null;
}

function DiveBloom({ progress }) {
    const bloom = useRef();
    useFrame(() => {
        if (!bloom.current) return;
        // bloom climbs with the screen: a lit-monitor glow that swells as the
        // camera dives in, so the panel fills the viewport actually glowing.
        const p = progress.current;
        const on = easeOutCubic(remap(p, 0.1, 0.4));
        const surge = easeInOutCubic(remap(p, 0.42, 0.82));
        bloom.current.intensity = 0.05 + on * 0.5 + surge * 0.55;
    });
    return (
        <EffectComposer disableNormalPass>
            <Bloom ref={bloom} mipmapBlur luminanceThreshold={0.72} luminanceSmoothing={0.25} intensity={0.05} />
        </EffectComposer>
    );
}

const LaptopScene = ({ progress, active = true, onContextLost }) => {
    const screenRef = useRef();
    const diveTargetRef = useRef();
    return (
        <Canvas
            shadows
            // keep the loop running while the section is anywhere near the
            // viewport; pause it (not unmount it) once it's well off-screen
            frameloop={active ? 'always' : 'never'}
            dpr={[1, 1.7]}
            gl={{ antialias: true, powerPreference: 'high-performance' }}
            camera={{ position: [0, 0.7, 8], fov: 50, near: 0.01, far: 100 }}
            style={{ position: 'absolute', inset: 0 }}
            onCreated={({ gl }) => {
                gl.domElement.addEventListener(
                    'webglcontextlost',
                    (e) => {
                        e.preventDefault();
                        onContextLost?.();
                    },
                    { once: true }
                );
            }}
        >
            <color attach="background" args={['#0D0D0D']} />
            <fog attach="fog" args={['#0D0D0D', 7, 18]} />

            {/* studio soft-box rig baked once into an env map — gives the
                aluminium bevels realistic glints and gradients without lifting
                the pitch-black background. Swap for a real HDR any time with
                <Environment preset="studio" environmentIntensity={0.25} />. */}
            <Environment resolution={256} frames={1}>
                <Lightformer form="rect" intensity={3.2} position={[0, 5, 1]} scale={[10, 4, 1]} rotation-x={Math.PI / 2} color="#ffffff" />
                <Lightformer form="rect" intensity={2.1} position={[-5, 1, 3]} scale={[4, 7, 1]} rotation-y={Math.PI / 3} color="#c7d8ff" />
                <Lightformer form="rect" intensity={1.5} position={[5, 1.5, 2]} scale={[4, 7, 1]} rotation-y={-Math.PI / 3} color="#ffffff" />
                <Lightformer form="rect" intensity={1.3} position={[0, 1, -6]} scale={[9, 5, 1]} color="#7186c6" />
                <Lightformer form="ring" intensity={0.5} position={[0, -3, 3]} scale={7} color="#181b22" />
            </Environment>

            <ambientLight intensity={0.1} />
            {/* cinematic spotlight directly overhead — soft feathered edge for
                the isolating vignette, and it casts a real shadow onto the floor */}
            <spotLight
                position={[0, 8, 0.6]}
                angle={0.55}
                penumbra={0.85}
                intensity={145}
                distance={32}
                decay={1.5}
                color="#eef2ff"
                castShadow
                shadow-mapSize={[1024, 1024]}
                shadow-bias={-0.0002}
            />
            <pointLight position={[-4, 1.5, 3]} intensity={5} distance={16} color="#4b6cff" />
            <pointLight position={[3.5, 0.5, 4]} intensity={3} distance={14} color="#ffffff" />

            <Laptop progress={progress} screenRef={screenRef} diveTargetRef={diveTargetRef} />
            <CameraRig progress={progress} screenRef={screenRef} diveTargetRef={diveTargetRef} />

            {/* polished near-black floor, a hair below the feet (which bottom out
                near y = -0.82). Low mixStrength + heavy blur => a soft glossy
                smear of the chassis, not a mirror. */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.821, 0]} receiveShadow>
                <planeGeometry args={[60, 60]} />
                <MeshReflectorMaterial
                    resolution={256}
                    mixBlur={1}
                    mixStrength={0.18}
                    blur={[420, 140]}
                    roughness={0.92}
                    depthScale={1.1}
                    minDepthThreshold={0.4}
                    maxDepthThreshold={1.3}
                    color="#070708"
                    metalness={0.5}
                />
            </mesh>
            <ContactShadows position={[0, -0.815, 0]} opacity={0.55} scale={14} blur={2.8} far={4.5} color="#000000" />

            <DiveBloom progress={progress} />
        </Canvas>
    );
};

export default LaptopScene;
