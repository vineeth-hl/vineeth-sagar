/* eslint-disable react/no-unknown-property */
'use client';
/*
 * Lanyard badge — rebuilt on React Bits (reactbits.dev/components/lanyard,
 * DavidHDev/react-bits, MIT) + @react-three/rapier physics.
 *
 * What this rebuild locks down:
 *  - card.glb loads from the jsDelivr CDN mirror (no binary committed here)
 *  - the card face (dark body + gradient "tag" header + uncropped photo) is drawn
 *    procedurally at the GLB's REAL face aspect (0.7164:1) into the exact UV slab
 *    the mesh samples (u:[0,1], v:[0,0.7572]) — so it maps on with zero distortion
 *  - <CameraFit> sizes the camera from the container's aspect ratio, so the whole
 *    badge always sits inside the frame (never clips) on desktop or mobile
 *  - the rope is pre-hung vertically + the card is heavily damped and self-rights
 *    on all spin axes -> it settles centred and face-on, no drift, no wobble
 *  - the strap uses a plain built-in white texture tinted by `lanyardColor`
 *    (React Bits' branded lanyard.png is never loaded)
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, extend, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, useTexture, Environment, Lightformer } from '@react-three/drei';
import { BallCollider, CuboidCollider, Physics, RigidBody, useRopeJoint, useSphericalJoint } from '@react-three/rapier';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';
import * as THREE from 'three';
import './Lanyard.css';

extend({ MeshLineGeometry, MeshLineMaterial });

const CARD_GLB = 'https://cdn.jsdelivr.net/gh/DavidHDev/react-bits@main/src/assets/lanyard/card.glb';
useGLTF.preload(CARD_GLB);

// plain white strap (tinted by lanyardColor) + a neutral photo fallback
const STRAP_TEX =
  'data:image/svg+xml,' +
  encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' width='4' height='4'><rect width='4' height='4' fill='white'/></svg>");
const PHOTO_FALLBACK =
  'data:image/svg+xml,' +
  encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' width='300' height='380'><rect width='300' height='380' fill='#1b1b20'/></svg>");

// measured from card.glb: the face mesh is FACE_AR wide x 1.0 tall, and its
// FRONT face UV-maps to this rect of the texture (the left ~half — the back
// face uses the rest). Drawing the card art into exactly this rect makes it
// map onto the mesh centred and undistorted.
const FACE_AR = 0.7164;
const FRONT_U = [0.0008, 0.4989];
const FRONT_V = [0.0042, 0.7548];

function roundRect(ctx, x, y, w, h, r) {
  if (typeof ctx.roundRect === 'function') {
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
    return;
  }
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/* draws the card face onto a W x H canvas (W:H must equal FACE_AR : 1) */
function drawCardFace(ctx, W, H, { photoImg, org }) {
  ctx.fillStyle = '#0d0d0d';
  ctx.fillRect(0, 0, W, H);

  // gradient "tag" header bar
  const headH = H * 0.1;
  const g = ctx.createLinearGradient(0, 0, W, 0);
  g.addColorStop(0, '#1e90ff');
  g.addColorStop(1, '#6d5ef6');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, headH);

  if (org) {
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const setLS = (v) => {
      if ('letterSpacing' in ctx) ctx.letterSpacing = v;
    };
    setLS(`${headH * 0.12}px`);
    let s = headH * 0.4;
    ctx.font = `700 ${s}px "JetBrains Mono", ui-monospace, monospace`;
    while (s > headH * 0.2 && ctx.measureText(org).width > W * 0.82) {
      s -= 1;
      ctx.font = `700 ${s}px "JetBrains Mono", ui-monospace, monospace`;
    }
    ctx.fillText(org, W / 2, headH * 0.54);
    setLS('0px');
  }

  // photo — box sized to the image's own aspect ratio (NO crop), centred
  const ar = photoImg && photoImg.width && photoImg.height ? photoImg.width / photoImg.height : 0.8;
  const availW = W * 0.86;
  const availH = (H - headH) * 0.8;
  let pw = availW;
  let ph = pw / ar;
  if (ph > availH) {
    ph = availH;
    pw = ph * ar;
  }
  const x = (W - pw) / 2;
  const y = headH + (H - headH - ph) / 2;
  const rad = W * 0.05;

  roundRect(ctx, x, y, pw, ph, rad);
  ctx.save();
  ctx.clip();
  if (photoImg) ctx.drawImage(photoImg, x, y, pw, ph);
  else {
    ctx.fillStyle = '#1b1b20';
    ctx.fillRect(x, y, pw, ph);
  }
  ctx.restore();

  roundRect(ctx, x, y, pw, ph, rad);
  const ring = ctx.createLinearGradient(x, y, x + pw, y + ph);
  ring.addColorStop(0, 'rgba(30,144,255,0.92)');
  ring.addColorStop(1, 'rgba(109,94,246,0.92)');
  ctx.strokeStyle = ring;
  ctx.lineWidth = W * 0.007;
  ctx.stroke();
}

export default function Lanyard({
  photo,
  org = null,
  lanyardColor = '#7c3aed',
  fov = 20,
  transparent = true,
  active = true,
  onContextLost
}) {
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);
  useEffect(() => {
    const on = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', on);
    return () => window.removeEventListener('resize', on);
  }, []);

  return (
    <div className="lanyard-wrapper">
      <Canvas
        frameloop={active ? 'always' : 'never'}
        dpr={[1, isMobile ? 1.5 : 2]}
        camera={{ position: [0, -0.5, 12], fov }}
        gl={{ alpha: transparent, antialias: true }}
        onCreated={({ gl }) => {
          gl.setClearColor(new THREE.Color(0x000000), transparent ? 0 : 1);
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
        <CameraFit fov={fov} lookY={-0.5} />
        <ambientLight intensity={Math.PI} />
        <Physics gravity={[0, -22, 0]} timeStep={isMobile ? 1 / 30 : 1 / 60}>
          <Band isMobile={isMobile} photo={photo} org={org} lanyardColor={lanyardColor} />
        </Physics>
        <Environment blur={0.75}>
          <Lightformer intensity={2} color="white" position={[0, -1, 5]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={3} color="white" position={[-1, -1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={3} color="white" position={[1, 1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={10} color="white" position={[-10, 0, 14]} rotation={[0, Math.PI / 2, Math.PI / 3]} scale={[100, 10, 1]} />
        </Environment>
      </Canvas>
    </div>
  );
}

/* fits the whole badge inside the frame for any container aspect ratio */
function CameraFit({ fov, lookY }) {
  const { camera, size } = useThree();
  useEffect(() => {
    const aspect = size.width / Math.max(1, size.height);
    const tanHalf = Math.tan((fov * Math.PI) / 180 / 2);
    const forWidth = 1.4 / (aspect * tanHalf); // half-extent to keep horizontally
    const forHeight = 1.5 / tanHalf; // half-extent to keep vertically
    const z = Math.max(forWidth, forHeight, 8.5);
    camera.position.set(0, lookY, z);
    camera.lookAt(0, lookY, 0);
    camera.near = 0.1;
    camera.far = 100;
    camera.updateProjectionMatrix();
  }, [camera, size.width, size.height, fov, lookY]);
  return null;
}

function Band({ isMobile, photo, org, lanyardColor, maxSpeed = 50, minSpeed = 0 }) {
  const band = useRef();
  const fixed = useRef();
  const j1 = useRef();
  const j2 = useRef();
  const j3 = useRef();
  const card = useRef();
  const vec = new THREE.Vector3();
  const ang = new THREE.Vector3();
  const rot = new THREE.Vector3();
  const dir = new THREE.Vector3();

  const seg = { type: 'dynamic', canSleep: true, colliders: false, angularDamping: 5, linearDamping: 5 };
  const cardSeg = { type: 'dynamic', canSleep: true, colliders: false, angularDamping: 10, linearDamping: 6 };

  const { nodes, materials } = useGLTF(CARD_GLB);
  const strapTex = useTexture(STRAP_TEX);
  const photoTex = useTexture(photo || PHOTO_FALLBACK);

  const [fontsReady, setFontsReady] = useState(false);
  useEffect(() => {
    let alive = true;
    const faces = ['700 28px "JetBrains Mono"', '600 20px "JetBrains Mono"'];
    Promise.all(faces.map((f) => (document.fonts?.load ? document.fonts.load(f).catch(() => {}) : null)))
      .then(() => document.fonts?.ready)
      .then(() => {
        if (alive) setFontsReady(true);
      })
      .catch(() => {
        if (alive) setFontsReady(true);
      });
    return () => {
      alive = false;
    };
  }, []);

  const cardMap = useMemo(() => {
    const baseFlipY = materials.base?.map?.flipY ?? false;
    const A = 2048;
    const canvas = document.createElement('canvas');
    canvas.width = A;
    canvas.height = A;
    const ctx = canvas.getContext('2d');
    if (!ctx) return materials.base?.map ?? null;
    ctx.imageSmoothingQuality = 'high';
    ctx.fillStyle = '#0d0d0d';
    ctx.fillRect(0, 0, A, A);

    // draw on a FACE_AR:1 canvas, then stretch it into the FRONT-face UV rect.
    // authoring at FACE_AR and squishing into the (narrower) rect cancels the
    // rect->face stretch the GLB applies -> no distortion.
    const FW = 1400;
    const FH = Math.round(FW / FACE_AR);
    const face = document.createElement('canvas');
    face.width = FW;
    face.height = FH;
    drawCardFace(face.getContext('2d'), FW, FH, { photoImg: photoTex.image, org });
    ctx.drawImage(
      face,
      FRONT_U[0] * A,
      FRONT_V[0] * A,
      (FRONT_U[1] - FRONT_U[0]) * A,
      (FRONT_V[1] - FRONT_V[0]) * A
    );

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.flipY = baseFlipY;
    tex.anisotropy = 16;
    tex.needsUpdate = true;
    return tex;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [photoTex, org, fontsReady, materials.base]);

  const [curve] = useState(
    () => new THREE.CatmullRomCurve3([new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()])
  );
  const [dragged, drag] = useState(false);
  const [hovered, hover] = useState(false);

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1]);
  useSphericalJoint(j3, card, [
    [0, 0, 0],
    [0, 1.5, 0]
  ]);

  useEffect(() => {
    if (!hovered) return undefined;
    document.body.style.cursor = dragged ? 'grabbing' : 'grab';
    return () => void (document.body.style.cursor = 'auto');
  }, [hovered, dragged]);

  useFrame((state, delta) => {
    if (dragged) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, fixed].forEach((r) => r.current?.wakeUp());
      card.current?.setNextKinematicTranslation({ x: vec.x - dragged.x, y: vec.y - dragged.y, z: vec.z - dragged.z });
    }
    if (fixed.current && card.current) {
      [j1, j2].forEach((r) => {
        if (!r.current.lerped) r.current.lerped = new THREE.Vector3().copy(r.current.translation());
        const d = Math.max(0.1, Math.min(1, r.current.lerped.distanceTo(r.current.translation())));
        r.current.lerped.lerp(r.current.translation(), delta * (minSpeed + d * (maxSpeed - minSpeed)));
      });
      curve.points[0].copy(j3.current.translation());
      curve.points[1].copy(j2.current.lerped);
      curve.points[2].copy(j1.current.lerped);
      curve.points[3].copy(fixed.current.translation());
      band.current.geometry.setPoints(curve.getPoints(isMobile ? 16 : 32));

      // strong self-righting on every spin axis so the card settles face-on
      // and still (converges fast even at a low frame rate)
      ang.copy(card.current.angvel());
      rot.copy(card.current.rotation());
      card.current.setAngvel({
        x: ang.x - rot.x * 0.6,
        y: ang.y - rot.y * 0.7,
        z: ang.z - rot.z * 0.6
      });
    }
  });

  curve.curveType = 'chordal';
  strapTex.wrapS = strapTex.wrapT = THREE.RepeatWrapping;

  return (
    <>
      <group position={[0, 4, 0]}>
        {/* rope pre-hung vertically -> zero spawn swing */}
        <RigidBody ref={fixed} {...seg} type="fixed" />
        <RigidBody position={[0, -1, 0]} ref={j1} {...seg}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[0, -2, 0]} ref={j2} {...seg}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[0, -3, 0]} ref={j3} {...seg}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[0, -4, 0]} ref={card} {...cardSeg} type={dragged ? 'kinematicPosition' : 'dynamic'}>
          <CuboidCollider args={[0.8, 1.125, 0.01]} />
          <group
            scale={2.25}
            position={[0, -1.2, -0.05]}
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={(e) => (e.target.releasePointerCapture(e.pointerId), drag(false))}
            onPointerDown={(e) => (
              e.target.setPointerCapture(e.pointerId),
              drag(new THREE.Vector3().copy(e.point).sub(vec.copy(card.current.translation())))
            )}
          >
            <mesh geometry={nodes.card.geometry}>
              <meshPhysicalMaterial
                map={cardMap}
                map-anisotropy={16}
                clearcoat={0.35}
                clearcoatRoughness={0.4}
                roughness={0.78}
                metalness={0.15}
              />
            </mesh>
            <mesh geometry={nodes.clip.geometry} material={materials.metal} material-roughness={0.28} />
            <mesh geometry={nodes.clamp.geometry} material={materials.metal} />
          </group>
        </RigidBody>
      </group>

      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial
          color={lanyardColor}
          depthTest={false}
          resolution={isMobile ? [1000, 2000] : [1000, 1000]}
          useMap
          map={strapTex}
          repeat={[-4, 1]}
          lineWidth={1}
        />
      </mesh>
    </>
  );
}
