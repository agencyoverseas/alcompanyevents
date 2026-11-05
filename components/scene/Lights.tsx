"use client";

/** Key chaude + rim dorée + ambiante faible (brief §5). */
export function Lights() {
  return (
    <>
      <ambientLight intensity={0.55} color="#FFF4E6" />
      <directionalLight position={[2.5, 3, 4]} intensity={2.1} color="#FFE3BF" />
      <directionalLight position={[-3, 2.5, -3]} intensity={2.8} color="#C9A25B" />
      <pointLight position={[-2.5, -1, 2.5]} intensity={3} distance={9} color="#B45A3C" />
    </>
  );
}
