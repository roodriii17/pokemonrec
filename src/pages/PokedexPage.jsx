// Importa los hooks esenciales de React para controlar estados y ciclos de vida.
import { useState, useEffect } from 'react'

// Importa el hook que permite redirigir al usuario programáticamente a otras rutas.
import { useNavigate } from 'react-router-dom'

// Importa un hook personalizado que se encarga de descargar y proveer la lista de Pokémon.
import { usePokemonList } from '../hooks/usePokemon'

// Importa la lista de tipos y la función para pintar los colores de fondo de las etiquetas.
import { TYPES, getTypeColor } from '../utils/typeColors'

// Importa la hoja de estilos CSS específica de este componente.
import './PokedexPage.css'

// Define una constante para controlar cuántos Pokémon se muestran en pantalla por cada "página".
const PER_PAGE = 40

function PokedexPage() {
  // Llama al hook personalizado para traer los primeros 1025 Pokémon y el estado de carga (loading).
  const { pokemons, loading } = usePokemonList(1025)

  // Estado para capturar el texto que el usuario escribe en el buscador de texto.
  const [search, setSearch]         = useState('')

  // Estado para almacenar el tipo de Pokémon seleccionado en los filtros (ej: 'fire', 'water').
  const [tipoActivo, setTipoActivo] = useState('')

  // Estado que guarda la lista final de Pokémon que pasaron los filtros de búsqueda y tipo.
  const [visibles, setVisibles]     = useState([])

  // Estado numérico que controla el número de página actual para la paginación dinámica.
  const [pagina, setPagina]         = useState(1)

  // Inicializa la función de navegación de React Router.
  const navigate = useNavigate()

  // Este useEffect se ejecuta cada vez que cambia el texto de búsqueda, el tipo seleccionado o la lista base.
  useEffect(() => {
    let lista = pokemons // Hacemos una copia de la lista original de Pokémon.

    // Si hay algo escrito en el buscador, filtramos ignorando mayúsculas y minúsculas.
    if (search)     lista = lista.filter(p => p.name.includes(search.toLowerCase()))

    // Si hay un filtro por tipo activo, nos quedamos solo con los Pokémon que tengan ese tipo en su array de 'types'.
    if (tipoActivo) lista = lista.filter(p => p.types.includes(tipoActivo))

    // Guardamos el resultado final en el estado de Pokémon visibles.
    setVisibles(lista)

    // Reiniciamos la paginación a la página 1 para evitar errores si estábamos en una página avanzada.
    setPagina(1)
  }, [search, tipoActivo, pokemons])

  // Corta la lista de elementos visibles para mostrar solo desde el índice 0 hasta el límite actual (ej: 40, 80, 120...).
  const mostrados = visibles.slice(0, pagina * PER_PAGE)

  return (
    <div className="page">
    
      <h2 style={{ marginBottom: '20px' }}>Pokédex</h2>

    
      <div className="search-bar">
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={search}
          // Sincroniza lo que escribe el usuario directamente con el estado 'search'.
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      
      <div className="type-filter">
        {/* Botón especial para limpiar los filtros de tipo y mostrar todos */}
        <button
          className={tipoActivo === '' ? 'active' : ''} // Añade clase 'active' si no hay tipo seleccionado.
          onClick={() => setTipoActivo('')}
        >
          Todos
        </button>
        {/* Mapea el array global de tipos para pintar un botón por cada uno de ellos */}
        {TYPES.map(t => (
          <button
            key={t}
            // Agrega la clase CSS 'active' si este botón coincide con el tipo activo.
            className={tipoActivo === t ? 'active' : ''}
            // Al hacer clic, si ya estaba activo lo limpia (''), de lo contrario activa este tipo (t).
            onClick={() => setTipoActivo(tipoActivo === t ? '' : t)}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Renderizado Condicional: Si está cargando por primera vez y no hay datos, muestra el loader */}
      {loading && pokemons.length === 0 ? (
        <div className="loader">Cargando Pokémon...</div>
      ) : (
        <>
          {/* Rejilla/Grid donde se muestran las tarjetas de los Pokémon */}
          <div className="pokemon-grid">
            {/* Solo recorre y dibuja los Pokémon recortados para la página actual */}
            {mostrados.map(p => (
              <div
                key={p.id}
                className="pokemon-card"
                // Al hacer clic en la tarjeta, redirige a la página de detalles usando el ID del Pokémon.
                onClick={() => navigate(`/detalle/${p.id}`)}
              >
                {/* Muestra el número formateado con ceros a la izquierda (ej: #007 en lugar de #7) */}
                <div className="num">#{String(p.id).padStart(3, '0')}</div>
                {/* Imagen/Sprite oficial del Pokémon */}
                <img src={p.sprite} alt={p.name} />
                {/* Nombre del Pokémon */}
                <h3>{p.name}</h3>
                {/* Contenedor de las etiquetas de tipo de la tarjeta */}
                <div>
                  {p.types.map(t => (
                    <span
                      key={t}
                      className="type-badge"
                      // Aplica dinámicamente el color de fondo correspondiente usando tu función utilitaria
                      style={{ backgroundColor: getTypeColor(t) }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Botón "Cargar más": Solo aparece si la cantidad de mostrados es menor que el total filtrado */}
          {mostrados.length < visibles.length && (
            <div className="load-more">
              {/* Al hacer clic, incrementa el número de página en 1, ampliando el límite de 'slice' */}
              <button onClick={() => setPagina(p => p + 1)}>
                Cargar más ({visibles.length - mostrados.length} restantes)
              </button>
            </div>
          )}

          {/* Mensaje de aviso: Se muestra solo si los filtros vaciaron por completo la lista */}
          {visibles.length === 0 && (
            <p style={{ textAlign: 'center', marginTop: '30px', color: '#999' }}>
              No se encontraron Pokémon.
            </p>
          )}
        </>
      )}
    </div>
  )
}

export default PokedexPage