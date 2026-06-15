import { getTypeColor, getStatColor } from '../utils/typeColors'
import './PokeModal.css'

function PokeModal({ pokemon, onClose }) {
  const mainColor = getTypeColor(pokemon.types[0])
  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal__head" style={{ background: `linear-gradient(135deg,${mainColor}33,${mainColor}11)` }}>
          <button className="modal__close" onClick={onClose}>✕</button>
          <div className="modal__num">#{String(pokemon.id).padStart(3,'0')}</div>
          <img className="modal__img"
            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`}
            alt={pokemon.name}
          />
          <div className="modal__name">{pokemon.name}</div>
          <div className="modal__types">
            {pokemon.types.map((t) => (
              <span key={t} className="type-badge" style={{
                background: getTypeColor(t)+'33', color: getTypeColor(t),
                border: `1px solid ${getTypeColor(t)}55`, padding: '0.25rem 0.7rem',
              }}>{t}</span>
            ))}
          </div>
        </div>
        <div className="modal__body">
          {pokemon.description && (
            <><div className="sec-title">Descripción</div><p className="modal__desc">{pokemon.description}</p></>
          )}
          <div className="info-grid">
            <div className="info-item"><span className="info-item__label">Altura</span><span className="info-item__value">{(pokemon.height/10).toFixed(1)}m</span></div>
            <div className="info-item"><span className="info-item__label">Peso</span><span className="info-item__value">{(pokemon.weight/10).toFixed(1)}kg</span></div>
            {(pokemon.abilities||[]).slice(0,2).map((a) => (
              <div className="info-item" key={a}>
                <span className="info-item__label">Habilidad</span>
                <span className="info-item__value" style={{fontSize:'0.78rem',textTransform:'capitalize'}}>{a.replace('-',' ')}</span>
              </div>
            ))}
          </div>
          <div className="sec-title">Estadísticas base</div>
          {(pokemon.stats||[]).map((s) => (
            <div className="stat-row" key={s.name}>
              <div className="stat-row__name">{s.name.replace('special-','sp.')}</div>
              <div className="stat-row__val" style={{color:getStatColor(s.value)}}>{s.value}</div>
              <div className="stat-row__bar-bg">
                <div className="stat-row__bar-fill" style={{
                  width: `${Math.min(100,(s.value/200)*100)}%`,
                  background: getStatColor(s.value),
                }}/>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default PokeModal