/* eslint-disable react/no-unknown-property */
'use client';
import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, extend, useFrame, type ThreeElement, type ThreeEvent } from '@react-three/fiber';
import { useGLTF, useTexture, Environment, Lightformer } from '@react-three/drei';
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  useRopeJoint,
  useSphericalJoint,
  type RapierRigidBody,
  type RigidBodyProps
} from '@react-three/rapier';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';
import * as THREE from 'three';

import cardGLB from './card.glb';

import './Lanyard.css';

extend({ MeshLineGeometry, MeshLineMaterial });

declare module '@react-three/fiber' {
  interface ThreeElements {
    meshLineGeometry: ThreeElement<typeof MeshLineGeometry>;
    meshLineMaterial: ThreeElement<typeof MeshLineMaterial>;
  }
}

const BLANK_PIXEL =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

const FRONT_UV_RECT = { x: 0, y: 0, w: 0.5, h: 0.755 };
const BACK_UV_RECT = { x: 0.5, y: 0, w: 0.5, h: 0.757 };

interface LanyardProps {
  position?: [number, number, number];
  gravity?: [number, number, number];
  fov?: number;
  transparent?: boolean;
  frontImage?: string | null;
  backImage?: string | null;
  imageFit?: 'cover' | 'contain';
  lanyardImage?: string | null;
  lanyardWidth?: number;
  headerText?: string;
  nameLine1?: string;
  nameLine2?: string;
  roleText?: string;
  githubText?: string;
  emailText?: string;
}

export default function Lanyard(props: LanyardProps) {
  return (
    <Suspense fallback={null}>
      <LanyardInner {...props} />
    </Suspense>
  );
}

function LanyardInner({
  position = [0, 0, 30],
  gravity = [0, -40, 0],
  fov = 20,
  transparent = true,
  frontImage = null,
  backImage = null,
  imageFit = 'cover',
  lanyardImage = null,
  lanyardWidth = 1,
  headerText,
  nameLine1,
  nameLine2,
  roleText,
  githubText,
  emailText
}: LanyardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [isMobile, setIsMobile] = useState<boolean>(() => typeof window !== 'undefined' && window.innerWidth < 768);

  useEffect(() => {
    const handleResize = (): void => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="lanyard-wrapper">
      <Canvas
        camera={{ position, fov }}
        dpr={[1, isMobile ? 1.5 : 2]}
        gl={{ alpha: transparent }}
        onCreated={({ gl }) => gl.setClearColor(new THREE.Color(0x000000), transparent ? 0 : 1)}
      >
        <ambientLight intensity={Math.PI} />
        <Suspense fallback={null}>
          <Physics gravity={gravity} timeStep={isMobile ? 1 / 30 : 1 / 60}>
            <Band
              isMobile={isMobile}
              inView={inView}
              frontImage={frontImage}
              backImage={backImage}
              imageFit={imageFit}
              lanyardImage={lanyardImage}
              lanyardWidth={lanyardWidth}
              headerText={headerText}
              nameLine1={nameLine1}
              nameLine2={nameLine2}
              roleText={roleText}
              githubText={githubText}
              emailText={emailText}
            />
          </Physics>
          <Environment blur={0.75}>
            <Lightformer
              intensity={2}
              color="white"
              position={[0, -1, 5]}
              rotation={[0, 0, Math.PI / 3]}
              scale={[100, 0.1, 1]}
            />
            <Lightformer
              intensity={3}
              color="white"
              position={[-1, -1, 1]}
              rotation={[0, 0, Math.PI / 3]}
              scale={[100, 0.1, 1]}
            />
            <Lightformer
              intensity={3}
              color="white"
              position={[1, 1, 1]}
              rotation={[0, 0, Math.PI / 3]}
              scale={[100, 0.1, 1]}
            />
            <Lightformer
              intensity={10}
              color="white"
              position={[-10, 0, 14]}
              rotation={[0, Math.PI / 2, Math.PI / 3]}
              scale={[100, 10, 1]}
            />
          </Environment>
        </Suspense>
      </Canvas>
    </div>
  );
}

interface BandProps {
  maxSpeed?: number;
  minSpeed?: number;
  isMobile?: boolean;
  inView?: boolean;
  frontImage?: string | null;
  backImage?: string | null;
  imageFit?: 'cover' | 'contain';
  lanyardImage?: string | null;
  lanyardWidth?: number;
  headerText?: string;
  nameLine1?: string;
  nameLine2?: string;
  roleText?: string;
  githubText?: string;
  emailText?: string;
}

type LanyardRigidBody = RapierRigidBody & {
  lerped?: THREE.Vector3;
};

const drawIDCardStyle = (
  ctx: CanvasRenderingContext2D,
  img: any,
  rect: typeof FRONT_UV_RECT,
  W: number,
  H: number,
  options?: {
    headerText?: string;
    nameLine1?: string;
    nameLine2?: string;
    roleText?: string;
    githubText?: string;
    emailText?: string;
    imageFit?: 'cover' | 'contain';
  }
) => {
  const rx = rect.x * W;
  const ry = rect.y * H;
  const rw = rect.w * W;
  const rh = rect.h * H;

  const nameLine1 = options?.nameLine1 || 'Pradnya Putra';
  const nameLine2 = options?.nameLine2 || '';
  const roleText = options?.roleText || 'Fullstack Web Developer';
  const githubText = options?.githubText || 'github.com/Pradnyaaa0';
  const emailText = options?.emailText || 'arthapradnya05@gmail.com';
  const imageFit = options?.imageFit || 'cover';

  ctx.save();
  ctx.beginPath();
  ctx.rect(rx, ry, rw, rh);
  ctx.clip();

  // Dark background for card
  ctx.fillStyle = '#0a0b10';
  ctx.fillRect(rx, ry, rw, rh);

  // Left ambient glow (cyan)
  const leftGlow = ctx.createRadialGradient(rx, ry + rh * 0.35, 10, rx, ry + rh * 0.35, rw * 0.85);
  leftGlow.addColorStop(0, 'rgba(14, 165, 233, 0.22)');
  leftGlow.addColorStop(1, 'rgba(14, 165, 233, 0)');
  ctx.fillStyle = leftGlow;
  ctx.fillRect(rx, ry, rw, rh);

  // Right ambient glow (indigo/purple)
  const rightGlow = ctx.createRadialGradient(rx + rw, ry + rh * 0.55, 10, rx + rw, ry + rh * 0.55, rw * 0.85);
  rightGlow.addColorStop(0, 'rgba(99, 102, 241, 0.22)');
  rightGlow.addColorStop(1, 'rgba(99, 102, 241, 0)');
  ctx.fillStyle = rightGlow;
  ctx.fillRect(rx, ry, rw, rh);

  // Photo Frame Container (Enlarged to fit card width & height)
  const pw = Math.round(rw * 0.86);
  const ph = Math.round(rh * 0.65);
  const px = rx + (rw - pw) / 2;
  const py = ry + Math.round(rh * 0.038);
  const cornerRadius = Math.round(pw * 0.055);

  // Dark photo box backdrop
  ctx.fillStyle = '#12141d';
  ctx.beginPath();
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(px, py, pw, ph, cornerRadius);
  } else {
    ctx.rect(px, py, pw, ph);
  }
  ctx.fill();

  // Draw user photo inside frame (Full Display)
  if (img && (img.width || img.naturalWidth)) {
    const iw = img.naturalWidth || img.width;
    const ih = img.naturalHeight || img.height;

    const scale = imageFit === 'contain' ? Math.min(pw / iw, ph / ih) : Math.max(pw / iw, ph / ih);
    const dw = iw * scale;
    const dh = ih * scale;
    const dx = px + (pw - dw) / 2;
    const dy = py + (ph - dh) / 2;

    ctx.save();
    ctx.beginPath();
    if (typeof ctx.roundRect === 'function') {
      ctx.roundRect(px, py, pw, ph, cornerRadius);
    } else {
      ctx.rect(px, py, pw, ph);
    }
    ctx.clip();
    ctx.drawImage(img, dx, dy, dw, dh);

    // Vignette gradient at bottom of photo
    const photoGrad = ctx.createLinearGradient(px, py + ph * 0.75, px, py + ph);
    photoGrad.addColorStop(0, 'rgba(10, 11, 16, 0)');
    photoGrad.addColorStop(1, 'rgba(10, 11, 16, 0.45)');
    ctx.fillStyle = photoGrad;
    ctx.fillRect(px, py, pw, ph);

    ctx.restore();
  }

  // Border around photo container
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
  ctx.lineWidth = Math.max(2.5, Math.round(pw * 0.007));
  ctx.beginPath();
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(px, py, pw, ph, cornerRadius);
  } else {
    ctx.rect(px, py, pw, ph);
  }
  ctx.stroke();


  // Name Typography (Pradnya Putra - BOLD & CLEAR FONT)
  const nameY = py + ph + Math.round(rh * 0.018);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';

  ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
  ctx.shadowBlur = 12;
  ctx.shadowOffsetY = 3;

  ctx.fillStyle = '#ffffff';
  const nameFontSize = Math.round(rw * 0.098);
  ctx.font = `900 ${nameFontSize}px "Inter", "Arial Black", sans-serif`;
  const displayName = nameLine2 ? `${nameLine1} ${nameLine2}` : nameLine1;
  ctx.fillText(displayName, rx + rw / 2, nameY);

  // Role Subtitle (Fullstack Web Developer)
  const roleY = nameY + Math.round(rh * 0.068);
  ctx.fillStyle = '#cbd5e1';
  const roleFontSize = Math.round(rw * 0.041);
  ctx.font = `bold ${roleFontSize}px "Inter", sans-serif`;
  ctx.fillText(roleText, rx + rw / 2, roleY);

  ctx.shadowColor = 'transparent';

  // Details (GitHub and Email - shifted lower on the card)
  const detailsY = roleY + Math.round(rh * 0.125);
  const detailsFontSize = Math.round(rw * 0.035);
  const iconSize = Math.round(detailsFontSize * 1.1);
  const iconGap = Math.round(detailsFontSize * 0.45);
  const lineSpacing = Math.round(rh * 0.04);

  ctx.font = `600 ${detailsFontSize}px "Inter", sans-serif`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';

  const GITHUB_SVG =
    'M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z';
  const MAIL_SVG =
    'M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z';

  // 1. GitHub Row
  const ghTextWidth = ctx.measureText(githubText).width;
  const ghTotalWidth = iconSize + iconGap + ghTextWidth;
  const ghStartX = rx + (rw - ghTotalWidth) / 2;
  const ghCenterY = detailsY;

  ctx.save();
  ctx.translate(ghStartX, ghCenterY - iconSize / 2);
  ctx.scale(iconSize / 24, iconSize / 24);
  ctx.fillStyle = '#ffffff';
  ctx.fill(new Path2D(GITHUB_SVG));
  ctx.restore();

  ctx.fillStyle = '#f8fafc';
  ctx.fillText(githubText, ghStartX + iconSize + iconGap, ghCenterY);

  // 2. Email Row
  const emTextWidth = ctx.measureText(emailText).width;
  const emTotalWidth = iconSize + iconGap + emTextWidth;
  const emStartX = rx + (rw - emTotalWidth) / 2;
  const emCenterY = detailsY + lineSpacing;

  ctx.save();
  ctx.translate(emStartX, emCenterY - iconSize / 2);
  ctx.scale(iconSize / 24, iconSize / 24);
  ctx.fillStyle = '#ffffff';
  ctx.fill(new Path2D(MAIL_SVG));
  ctx.restore();

  ctx.fillStyle = '#f8fafc';
  ctx.fillText(emailText, emStartX + iconSize + iconGap, emCenterY);

  ctx.restore();
};

function Band({
  maxSpeed = 50,
  minSpeed = 0,
  isMobile = false,
  inView = false,
  frontImage = null,
  backImage = null,
  imageFit = 'cover',
  lanyardImage = null,
  lanyardWidth = 1,
  headerText,
  nameLine1,
  nameLine2,
  roleText,
  githubText,
  emailText
}: BandProps) {
  const band = useRef<THREE.Mesh<InstanceType<typeof MeshLineGeometry>, InstanceType<typeof MeshLineMaterial>>>(null!);
  const fixed = useRef<RapierRigidBody>(null!);
  const j1 = useRef<LanyardRigidBody>(null!);
  const j2 = useRef<LanyardRigidBody>(null!);
  const j3 = useRef<RapierRigidBody>(null!);
  const card = useRef<RapierRigidBody>(null!);

  const [hasDropped, setHasDropped] = useState(false);

  useEffect(() => {
    if (inView && !hasDropped) {
      setHasDropped(true);
      if (card.current && fixed.current) {
        card.current.setTranslation({ x: 0, y: 14, z: 0 }, true);
        j1.current?.setTranslation({ x: 0, y: 17, z: 0 }, true);
        j2.current?.setTranslation({ x: 0, y: 15, z: 0 }, true);
        j3.current?.setTranslation({ x: 0, y: 13, z: 0 }, true);
        [card, j1, j2, j3, fixed].forEach(ref => ref.current?.wakeUp());
      }
    }
  }, [inView, hasDropped]);

  const vec = new THREE.Vector3();
  const ang = new THREE.Vector3();
  const rot = new THREE.Vector3();
  const dir = new THREE.Vector3();

  const segmentProps: RigidBodyProps = {
    type: 'dynamic',
    canSleep: true,
    colliders: false,
    angularDamping: 4,
    linearDamping: 4
  };

  const getLerped = (body: LanyardRigidBody): THREE.Vector3 => {
    if (!body.lerped) {
      body.lerped = new THREE.Vector3().copy(body.translation());
    }

    return body.lerped;
  };

  const { nodes, materials } = useGLTF(cardGLB) as any;
  const texture = useTexture(lanyardImage || frontImage);

  const [frontImgEl, setFrontImgEl] = useState<HTMLImageElement | null>(null);
  const [backImgEl, setBackImgEl] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    if (!frontImage) {
      setFrontImgEl(null);
      return;
    }
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = frontImage;
    img.onload = () => {
      setFrontImgEl(img);
    };
  }, [frontImage]);

  useEffect(() => {
    if (!backImage) {
      setBackImgEl(null);
      return;
    }
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = backImage;
    img.onload = () => {
      setBackImgEl(img);
    };
  }, [backImage]);

  const cardMap = useMemo(() => {
    const baseMap = materials?.base?.map as THREE.Texture | undefined;
    const baseImg = baseMap?.image as any;
    const W = baseImg?.width || 1024;
    const H = baseImg?.height || 1024;
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');
    if (!ctx) return baseMap || null;

    if (baseImg) {
      ctx.drawImage(baseImg, 0, 0, W, H);
    }

    const cardOpts = {
      headerText,
      nameLine1,
      nameLine2,
      roleText,
      githubText,
      emailText,
      imageFit
    };

    drawIDCardStyle(ctx, frontImgEl, FRONT_UV_RECT, W, H, cardOpts);
    drawIDCardStyle(ctx, backImgEl || frontImgEl, BACK_UV_RECT, W, H, cardOpts);

    const composite = new THREE.CanvasTexture(canvas);
    composite.colorSpace = THREE.SRGBColorSpace;
    if (baseMap) composite.flipY = baseMap.flipY;
    composite.anisotropy = 16;
    composite.needsUpdate = true;
    return composite;
  }, [frontImage, backImage, frontImgEl, backImgEl, imageFit, materials?.base?.map, headerText, nameLine1, nameLine2, roleText, githubText, emailText]);

  const [curve] = useState(
    () =>
      new THREE.CatmullRomCurve3([new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()])
  );
  const [dragged, drag] = useState<false | THREE.Vector3>(false);
  const [hovered, hover] = useState(false);

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1]);
  useSphericalJoint(j3, card, [
    [0, 0, 0],
    [0, 1.25, 0]
  ]);

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? 'grabbing' : 'grab';
      return () => {
        document.body.style.cursor = 'auto';
      };
    }
  }, [hovered, dragged]);

  useFrame((state, delta) => {
    if (dragged && typeof dragged !== 'boolean') {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, fixed].forEach(ref => ref.current?.wakeUp());
      card.current?.setNextKinematicTranslation({
        x: vec.x - dragged.x,
        y: vec.y - dragged.y,
        z: vec.z - dragged.z
      });
    }
    if (fixed.current) {
      [j1, j2].forEach(ref => {
        const lerped = getLerped(ref.current);
        const clampedDistance = Math.max(0.1, Math.min(1, lerped.distanceTo(ref.current.translation())));
        lerped.lerp(ref.current.translation(), delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed)));
      });
      curve.points[0].copy(j3.current.translation()).sub(new THREE.Vector3(0, 0.04, 0));
      curve.points[1].copy(getLerped(j2.current));
      curve.points[2].copy(getLerped(j1.current));
      curve.points[3].copy(fixed.current.translation());
      band.current.geometry.setPoints(curve.getPoints(isMobile ? 16 : 32));
      ang.copy(card.current.angvel());
      rot.copy(card.current.rotation());
      card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z }, true);
    }
  });

  const strapTexture = useMemo(() => {
    if (lanyardImage) return texture;

    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    if (!ctx) return texture;

    // Dark sleek matte strap background
    ctx.fillStyle = '#0a0b10';
    ctx.fillRect(0, 0, 2048, 128);

    // Subtle edge borders / stitching lines along top and bottom edges
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, 12);
    ctx.lineTo(2048, 12);
    ctx.moveTo(0, 116);
    ctx.lineTo(2048, 116);
    ctx.stroke();

    // Repeating white text "PRADNYA PUTRA"
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = 'rgba(255, 255, 255, 0.4)';
    ctx.shadowBlur = 5;

    const strapText = (nameLine1 || 'PRADNYA PUTRA').toUpperCase();
    const textUnit = `   ${strapText}    ✦   `;
    ctx.font = '900 42px "Inter", "Arial Black", sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';

    const unitWidth = ctx.measureText(textUnit).width;

    let x = 0;
    while (x < 2048 + unitWidth) {
      ctx.fillText(textUnit, x, 64);
      x += unitWidth;
    }

    const canvasTexture = new THREE.CanvasTexture(canvas);
    canvasTexture.wrapS = THREE.RepeatWrapping;
    canvasTexture.wrapT = THREE.RepeatWrapping;
    canvasTexture.repeat.set(3, 1);
    canvasTexture.needsUpdate = true;
    return canvasTexture;
  }, [lanyardImage, texture, nameLine1]);

  curve.curveType = 'chordal';
  if (strapTexture) {
    strapTexture.wrapS = strapTexture.wrapT = THREE.RepeatWrapping;
  }

  return (
    <>
      <group position={[0, 4, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />
        <RigidBody position={[0.5, 0, 0]} ref={j1} {...segmentProps} type="dynamic">
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1, 0, 0]} ref={j2} {...segmentProps} type="dynamic">
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1.5, 0, 0]} ref={j3} {...segmentProps} type="dynamic">
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody
          position={[2, 0, 0]}
          ref={card}
          {...segmentProps}
          type={dragged ? 'kinematicPosition' : 'dynamic'}
        >
          <CuboidCollider args={[0.8, 1.125, 0.01]} />
          <group
            scale={2.0}
            position={[0, -1.2, -0.05]}
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={(e: ThreeEvent<PointerEvent>) => {
              (e.target as Element).releasePointerCapture(e.pointerId);
              drag(false);
            }}
            onPointerDown={(e: ThreeEvent<PointerEvent>) => {
              (e.target as Element).setPointerCapture(e.pointerId);
              drag(new THREE.Vector3().copy(e.point).sub(vec.copy(card.current.translation())));
            }}
          >
            {nodes?.card && (
              <mesh geometry={nodes.card.geometry}>
                <meshPhysicalMaterial
                  map={cardMap}
                  map-anisotropy={16}
                  clearcoat={isMobile ? 0 : 1}
                  clearcoatRoughness={0.15}
                  roughness={0.9}
                  metalness={0.8}
                />
              </mesh>
            )}
            {nodes?.clip && <mesh geometry={nodes.clip.geometry} material={materials?.metal} material-roughness={0.3} />}
            {nodes?.clamp && <mesh geometry={nodes.clamp.geometry} material={materials?.metal} />}
          </group>
        </RigidBody>
      </group>
      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial
          color="#ffffff"
          useMap={1}
          map={strapTexture}
          depthTest={false}
          resolution={isMobile ? [1000, 2000] : [1000, 1000]}
          lineWidth={lanyardWidth}
        />
      </mesh>
    </>
  );
}
