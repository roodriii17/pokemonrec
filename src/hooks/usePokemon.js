// Importa las herramientas básicas de React para guardar datos y controlar cuándo se ejecuta el código.
import { useState, useEffect } from 'react'

// La dirección de internet donde se piden los datos de los Pokémon.
const BASE = 'https://pokeapi.co/api/v2'

/**
 * Esta función toma el montón de datos desordenados que envía internet
 * y los limpia para quedarse solo con lo importante (id, nombre, foto, etc.).
 */
function normalizePokemon(d) {
  return {
    id:          d.id,                                   
    name:        d.name,                                
    types:       d.types.map(t => t.type.name),          
    sprite:      d.sprites.other['official-artwork'].front_default || d.sprites.front_default,
    height:      d.height,                               
    weight:      d.weight,                              
    abilities:   d.abilities.map(a => a.ability.name),   
    stats:       d.stats.map(s => ({ name: s.stat.name, value: s.base_stat })), 
    description: '',                                     
  }
}

/**
 * Una función especial (Hook) para descargar de golpe todos los Pokémon de la Pokédex.
 */
export function usePokemonList(limit = 1025) {
  // Aquí se irá guardando la lista de Pokémon que vayamos descargando.
  const [pokemons, setPokemons] = useState([])
  // Un aviso para saber si la aplicación sigue descargando cosas de internet.
  const [loading, setLoading]   = useState(true)

  // Este bloque se ejecuta automáticamente al abrir la pantalla de la Pokédex.
  useEffect(() => {
    // Una bombilla de control: si es 'true', significa que el usuario cerró la pantalla y hay que detener todo.
    let cancelled = false

    // La función que viaja a internet a por los datos.
    const fetchAll = async () => {
      try {
        // 1. Pide una lista rápida con los nombres y los enlaces de todos los Pokémon.
        const res  = await fetch(`${BASE}/pokemon?limit=${limit}`)
        const data = await res.json()

        // Vamos a descargar los detalles de los Pokémon en paquetes de 40 en 40 para no saturar internet.
        const BATCH = 40
        // Una caja temporal para ir juntando los Pokémon.
        const results = []

        // Un bucle que va saltando de 40 en 40 por la lista.
        for (let i = 0; i < data.results.length; i += BATCH) {
          // Corta un trozo de 40 Pokémon de la lista.
          const batch = data.results.slice(i, i + BATCH)
          
          // Descarga los detalles de esos 40 Pokémon al mismo tiempo.
          const batchData = await Promise.all(
            batch.map(async p => {
              const r = await fetch(p.url)          // Va al enlace de ese Pokémon.
              const d = await r.json()              // Lee sus datos.
              return normalizePokemon(d)            // Los limpia con la función de arriba.
            })
          )
          
          // Mete esos 40 Pokémon limpios en nuestra caja temporal.
          results.push(...batchData)
          
          // Si el usuario sigue dentro de la pantalla, actualiza la Pokédex con lo que llevamos.
          // Así el usuario ve cómo se va llenando la lista poco a poco.
          if (!cancelled) setPokemons([...results])
        }
      } catch (e) {
        // Si internet falla o hay un error, lo muestra en la consola del navegador.
        console.error(e)
      } finally {
        // Cuando termina de descargar todo, avisa que ya no está cargando.
        if (!cancelled) setLoading(false)
      }
    }

    // Activa la descarga de datos.
    fetchAll()
    
    // Si el usuario cambia de pantalla antes de que termine el bucle, apaga la bombilla ('cancelled = true')
    // para que el código se detenga inmediatamente y no cause errores por detrás.
    return () => { cancelled = true }
  }, [limit]) // Si el límite cambia, se vuelve a ejecutar todo.

  // Le devuelve la lista de Pokémon y el aviso de carga a la pantalla que lo necesite.
  return { pokemons, loading }
}

/**
 * Función para buscar la descripción (el texto de historia) de un Pokémon usando su número.
 */
export async function fetchDescription(id) {
  try {
    // Pide los datos de la "especie" del Pokémon.
    const res  = await fetch(`${BASE}/pokemon-species/${id}`)
    const data = await res.json()
    // Busca entre todos los textos disponibles el primero que esté en inglés ('en').
    const entry = data.flavor_text_entries.find(e => e.language.name === 'en')
    // Si lo encuentra, quita los saltos de línea feos del texto. Si no, devuelve un texto vacío.
    return entry ? entry.flavor_text.replace(/\f|\n/g, ' ') : ''
  } catch {
    // Si algo falla, devuelve un texto vacío para que la aplicación no se rompa.
    return ''
  }
}

/**
 * Función para preparar los Pokémon que saldrán en el juego de trivia.
 */
export async function fetchGamePool(total = 1000, sample = 40) {
  // Pide una lista con los primeros 1000 Pokémon.
  const res  = await fetch(`${BASE}/pokemon?limit=${total}`)
  const data = await res.json()
  
  // Mezcla toda la lista al azar (como si barajaras cartas) y se queda solo con 40.
  const picked = data.results.sort(() => Math.random() - 0.5).slice(0, sample)

  // Descarga los detalles y las descripciones de esos 40 Pokémon elegidos al azar y los devuelve listos para jugar.
  return Promise.all(picked.map(async p => {
    const r = await fetch(p.url)
    const d = await r.json()
    const pk = normalizePokemon(d)
    pk.description = await fetchDescription(d.id) // Le pega también su texto de descripción.
    return pk
  }))
}