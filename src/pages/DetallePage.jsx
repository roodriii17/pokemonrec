// Importa useParams para leer los parámetros de la URL y useNavigate para redirigir al usuario.
import { useParams, useNavigate } from 'react-router-dom'

// Importa los hooks useState y useEffect de React para el estado local y los efectos secundarios.
import { useState, useEffect } from 'react'

// Importa los estilos CSS de diseño específicos para la tarjeta de detalles.
import './DetallePage.css'

// Objeto local de constantes que mapea los tipos de Pokémon con sus colores en código 
const TYPE_COLORS = {
  fire:'#f97316', water:'#3b82f6', grass:'#22c55e', electric:'#eab308',
  psychic:'#ec4899', ice:'#67e8f9', dragon:'#7c3aed', dark:'#4b5563',
  fairy:'#f472b6', normal:'#9ca3af', fighting:'#b45309', flying:'#93c5fd',
  poison:'#a855f7', ground:'#d97706', rock:'#78716c', bug:'#84cc16',
  ghost:'#6d28d9', steel:'#94a3b8',
}

function DetallePage() {
  // Extrae el parámetro dinámico ':idPokemon' definido en el componente Routes de tu App.jsx.
  const { idPokemon } = useParams()
  
  // Inicializa la función para cambiar de ruta.
  const navigate      = useNavigate()
  
  // Estado para guardar el objeto limpio con la información estructurada del Pokémon.
  const [pokemon, setPokemon] = useState(null)
  
  // Estado de carga que inicia en true mientras se realizan las consultas a la API.
  const [loading, setLoading] = useState(true)

  // useEffect que se dispara cada vez que el 'idPokemon' de la URL cambia.
  useEffect(() => {
    // Función interna asíncrona dedicada a consumir las APIs.
    const fetchPokemon = async () => {
      try {
        // Primera petición: Obtiene los datos generales del Pokémon usando su ID o nombre.
        const res  = await fetch(`https://pokeapi.co/api/v2/pokemon/${idPokemon}`)
        const data = await res.json()

        // Segunda petición: Obtiene los datos de la especie para acceder a la descripción en inglés.
        const speciesRes  = await fetch(data.species.url)
        const speciesData = await speciesRes.json()
        
        // Busca entre todas las entradas de texto disponibles la primera que esté en idioma inglés ('en').
        const entry = speciesData.flavor_text_entries.find(e => e.language.name === 'en')

        // Mapea y guarda solo las propiedades necesarias en un nuevo objeto dentro del estado 'pokemon'.
        setPokemon({
          id:          data.id,
          name:        data.name,
          // Intenta usar el arte oficial de alta calidad. Si no existe, usa el sprite frontal básico por defecto.
          sprite:      data.sprites.other['official-artwork'].front_default || data.sprites.front_default,
          // Transforma el array de objetos original en un array simple de strings con los tipos (ej: ['grass', 'poison']).
          types:       data.types.map(t => t.type.name),
          height:      data.height,
          weight:      data.weight,
          // Extrae los nombres de las habilidades.
          abilities:   data.abilities.map(a => a.ability.name),
          // Estructura un nuevo array con objetos { name, value } para las estadísticas base.
          stats:       data.stats.map(s => ({ name: s.stat.name, value: s.base_stat })),
          /* Guarda la descripción si fue encontrada. 
            El `.replace(/\f|\n/g, ' ')` limpia saltos de línea extraños provenientes de los textos originales de GameBoy.
          */
          description: entry ? entry.flavor_text.replace(/\f|\n/g, ' ') : '',
        })
      } catch (e) {
        // Captura y muestra cualquier error en la consola si alguna de las peticiones falla (ej: ID inexistente).
        console.error(e)
      } finally {
        // Apaga el estado de carga tanto si la petición tuvo éxito como si falló.
        setLoading(false)
      }
    }

    // Ejecuta la función interna recién definida.
    fetchPokemon()
  }, [idPokemon]) // si la URL cambia a otro ID, el efecto se vuelve a ejecutar.

  // Renderizado condicional: si está cargando, muestra este bloque y detiene el flujo del render.
  if (loading) return <div className="detalle-loader">Cargando...</div>

  // Renderizado condicional: si terminó de cargar pero el estado 'pokemon' está vacío (null por error), muestra un mensaje de fallo.
  if (!pokemon) return (
    <div className="detalle-error">
      <p>No se encontró el Pokémon.</p>
      <button onClick={() => navigate('/pokemons')}>Volver</button>
    </div>
  )

  // Interfaz final una vez los datos se cargaron correctamente.
  return (
    <div className="page detalle-page">
      {/* Botón superior para regresar manualmente a la vista de la Pokédex */}
      <button className="detalle-back" onClick={() => navigate('/pokemons')}>
        ← Volver a la Pokédex
      </button>

      <div className="detalle-card">

        {/* COLUMNA IZQUIERDA — Enfocada en el aspecto visual */}
        <div className="detalle-left">
          {/* Muestra el número con formato de tres dígitos (ej: 004 en lugar de 4) */}
          <p className="detalle-num">#{String(pokemon.id).padStart(3, '0')}</p>
          {/* Ilustración del Pokémon */}
          <img src={pokemon.sprite} alt={pokemon.name} />
          {/* Contenedor de etiquetas para los tipos */}
          <div className="detalle-types">
            {pokemon.types.map(t => (
              <span
                key={t}
                className="type-badge"
                // Aplica el color correspondiente desde el objeto TYPE_COLORS usando el nombre del tipo como llave.
                style={{ backgroundColor: TYPE_COLORS[t] || '#999' }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* COLUMNA DERECHA — Enfocada en la información textual y numérica */}
        <div className="detalle-right">
          {/* Nombre del Pokémon */}
          <h1>{pokemon.name}</h1>

          {/* Renderiza el párrafo de descripción solo si existe texto en la propiedad */}
          {pokemon.description && (
            <p className="detalle-desc">{pokemon.description}</p>
          )}

          {/* Grid de especificaciones físicas y habilidades */}
          <div className="detalle-info">
            <div className="detalle-info-item">
              <span>Altura</span>
              {/* La PokeAPI entrega la altura en decímetros. Se divide entre 10 para mostrarla en metros con un decimal. */}
              <strong>{(pokemon.height / 10).toFixed(1)} m</strong>
            </div>
            <div className="detalle-info-item">
              <span>Peso</span>
              {/* La PokeAPI entrega el peso en hectogramos. Se divide entre 10 para mostrarlo en kilogramos con un decimal. */}
              <strong>{(pokemon.weight / 10).toFixed(1)} kg</strong>
            </div>
            {/* Muestra un máximo de 2 habilidades del Pokémon usando slice(0, 2) */}
            {pokemon.abilities.slice(0, 2).map(a => (
              <div className="detalle-info-item" key={a}>
                <span>Habilidad</span>
                {/* Reemplaza los guiones de la API por espacios y capitaliza la primera letra mediante CSS */}
                <strong style={{ textTransform: 'capitalize' }}>
                  {a.replace('-', ' ')}
                </strong>
              </div>
            ))}
          </div>

          <h3>Estadísticas</h3>
          {/* Sección de barras de estadísticas (HP, Ataque, Defensa, etc.) */}
          <div className="detalle-stats">
            {pokemon.stats.map(s => (
              <div className="stat-row" key={s.name}>
                {/* Renombra estéticamente los textos largos como "special-attack" por "sp.attack" */}
                <div className="stat-name">{s.name.replace('special-', 'sp.')}</div>
                {/* Valor numérico bruto de la estadística */}
                <div className="stat-val">{s.value}</div>
                {/* Contenedor contenedor de la barra gris grisácea */}
                <div className="stat-bar">
                  {/* Llenado dinámico de la barra en base al porcentaje. 
                      Usa Math.min(100, ...) para asegurar que si un Pokémon supera los 200 puntos base, la barra no se desborde del 100%. 
                  */}
                  <div
                    className="stat-fill"
                    style={{ width: `${Math.min(100, (s.value / 200) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}

export default DetallePage