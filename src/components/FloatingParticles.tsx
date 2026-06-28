/** Lightweight CSS-animated particles — no canvas, no JS loop */
const PARTICLE_COUNT = 12

export function FloatingParticles() {
  return (
    <div className="particle-field" aria-hidden="true">
      {Array.from({ length: PARTICLE_COUNT }, (_, index) => (
        <span
          key={index}
          className={`particle ${index % 3 === 0 ? 'particle-lg' : index % 2 === 0 ? 'particle-md' : 'particle-sm'}`}
        />
      ))}
    </div>
  )
}
