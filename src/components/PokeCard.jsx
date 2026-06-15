import { getTypeColor } from '../utils/typeColors'
import './PokeCard.css'

function PokeCard({ pokemon, onClick }) {
  const mainColor = getTypeColor(pokemon.types[0])
  return (
    <div className="poke-card" onClick={() => onClick(pokemon)}>
      <div className="poke-card__glow" style={{ background: mainColor }} />
      <div className="poke-card__num">#{String(pokemon.id).padStart(3, '0')}</div>
      <img className="poke-card__img" src={pokemon.sprite} alt={pokemon.name} loading="lazy" />
      <div className="poke-card__name">{pokemon.name}</div>
      <div className="poke-card__types">
        {pokemon.types.map((t) => (
          <span key={t} className="type-badge" style={{
            background: getTypeColor(t) + '33',
            color:      getTypeColor(t),
            border:     `1px solid ${getTypeColor(t)}55`,
          }}>
            {t}
          </span>
        ))}
      </div>
    </div>
  )
}

export default PokeCard