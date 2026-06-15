// Importa los hooks necesarios para controlar estados y efectos secundarios.
import { useState, useEffect } from 'react'

// Importa una función externa que descarga la lista de Pokémon que usará el juego.
import { fetchGamePool } from '../hooks/usePokemon'

// Importa el hook para redirigir al usuario (por ejemplo, al login si no tiene sesión activa).
import { useNavigate } from 'react-router-dom'

// Importa la instancia de autenticación de Firebase de tu proyecto.
import { auth } from '../firebase'

// Importa los estilos visuales específicos de la página del juego.
import './GamePage.css'

function GamePage() {
  const navigate = useNavigate()

  // undefined = cargando verificación; null = no logueado; objeto user = logueado.
  const [usuario, setUsuario] = useState(undefined)
  // Guarda el grupo completo de Pokémon descargados de la API (la base de datos local del juego).
  const [pool, setPool] = useState([])
  
  // Guarda el objeto del Pokémon que el usuario debe adivinar.
  const [pokemonActual, setPokemonActual] = useState(null)
  // Array de 4 Pokémon (el correcto y 3 falsos) que se usarán para pintar los botones.
  const [opciones, setOpciones] = useState([])
  // Contador numérico de respuestas correctas.
  const [puntos, setPuntos] = useState(0)
  // Booleano para saber si el usuario ya hizo clic en una opción en el turno actual.
  const [respondido, setRespondido] = useState(false)
  // Texto en pantalla que dice "¡Correcto!" o "¡Incorrecto!" junto con el nombre.
  const [mensaje, setMensaje] = useState('')
  // Controla si la aplicación está descargando los Pokémon de la API.
  const [cargando, setCargando] = useState(true)

  // 1. CONTROL DE SESIÓN (PROTECCIÓN CON FIREBASE)
  // Se ejecuta al cargar la página para verificar si el usuario tiene permiso de jugar.
  useEffect(() => {
    const unsub = auth.onAuthStateChanged(user => {
      setUsuario(user || null) // Si no hay usuario, setea 'null'.
    })
    return unsub // Se desuscribe del escuchador de Firebase al desmontar el componente.
  }, [])

  // 2. CARGA DE POKÉMONS
  // Reacciona cuando el estado 'usuario' cambia (tras la verificación de Firebase).
  useEffect(() => {
    if (usuario) {
      // Descarga una lista (por ejemplo, los primeros 150 Pokémon).
      fetchGamePool(150, 20)
        .then(data => {
          setPool(data)          // Guarda el grupo completo en el estado 'pool'.
          generarPregunta(data)  // Crea la primera pregunta usando esos datos.
        })
        .finally(() => setCargando(false)) // Apaga el texto de carga.
    }
  }, [usuario])

  // 3. LÓGICA DEL JUEGO: CREAR UNA PREGUNTA NUEVA
  function generarPregunta(lista) {
    if (!lista || lista.length === 0) return

    // Selecciona un Pokémon aleatorio de la lista para que sea el correcto.
    const correcto = lista[Math.floor(Math.random() * lista.length)]
    
    // Filtra la lista para quitar al correcto, mezcla el resto al azar y toma los primeros 3.
    const incorrectos = lista
      .filter(p => p.id !== correcto.id)   // Evita que el correcto aparezca repetido en los botones.
      .sort(() => 0.5 - Math.random())     // Truco matemático rápido para desordenar el array.
      .slice(0, 3)                         // Se queda con 3 elementos.

    // Une los 3 incorrectos con el correcto en un nuevo array y lo vuelve a mezclar 
    // para que el correcto no quede siempre en la última posición.
    const mezclados = [...incorrectos, correcto].sort(() => 0.5 - Math.random())

    // Actualiza los estados para actualizar la interfaz del juego.
    setPokemonActual(correcto) // Define el nuevo objetivo.
    setOpciones(mezclados)     // Define los textos de los 4 botones.
    setRespondido(false)       // Habilita los botones de nuevo.
    setMensaje('')             // Limpia el mensaje de acierto/error anterior.
  }

  // 4. VERIFICAR SI ACERTÓ
  // Se ejecuta cuando el usuario hace clic en cualquiera de los 4 botones.
  function verificarRespuesta(idElegido) {
    if (respondido) return // Si ya había respondido en este turno, ignora más clics.

    setRespondido(true) // Bloquea futuros clics para este turno.
    
    // Compara el ID del botón presionado con el ID del Pokémon correcto.
    if (idElegido === pokemonActual.id) {
      setPuntos(puntos + 1) // Suma un punto al marcador.
      setMensaje(`✅ ¡Correcto! Es ${pokemonActual.name}`)
    } else {
      setMensaje(`❌ ¡Incorrecto! Era ${pokemonActual.name}`)
    }
  }

  // --- COMPROBACIONES DE SEGURIDAD ANTES DE RENDERIZAR ---
  
  // Si Firebase aún está cargando la sesión, muestra la pantalla vacía para evitar parpadeos.
  if (usuario === undefined) return null

  // Si no hay sesión iniciada, redirige inmediatamente al login y detiene el render.
  if (usuario === null) {
    navigate('/login')
    return null
  }

  // Estados de carga de datos de la API.
  if (cargando) return <div className="loader">Cargando juego...</div>
  if (!pokemonActual) return <h2>Error al cargar datos.</h2>

  // --- INTERFAZ GRÁFICA DEL JUEGO (JSX) ---
  return (
    <div className="page" style={{ textAlign: 'center', padding: '20px', fontFamily: 'sans-serif' }}>
      <div className="game-box" style={{ border: '2px solid #ccc', borderRadius: '15px', padding: '20px', display: 'inline-block', minWidth: '320px', backgroundColor: '#fff' }}>
        
        <h2>¿Quién es este Pokémon?</h2>
        {/* Marcador de puntos en tiempo real */}
        <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Puntos: {puntos}</p>

        {/* Imagen del Pokémon actual (puedes aplicarle un filtro CSS "brightness(0)" en tu CSS para que se vea solo la silueta negra) */}
        <img 
          src={pokemonActual.sprite} 
          alt="pokemon" 
          style={{ width: '160px', height: '160px', display: 'block', margin: '20px auto' }} 
        />

        {/* Muestra el banner de éxito o error si el usuario ya contestó */}
        {mensaje && <p style={{ fontWeight: 'bold', fontSize: '1.1rem', margin: '15px 0' }}>{mensaje}</p>}

        {/* Cuadrícula de 2x2 para las respuestas */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          {opciones.map(op => (
            <button
              key={op.id}
              // Deshabilita el botón una vez que se ha respondido la pregunta.
              disabled={respondido}
              onClick={() => verificarRespuesta(op.id)}
              style={{
                padding: '12px',
                fontSize: '1rem',
                textTransform: 'capitalize', // Convierte la primera letra del Pokémon en mayúscula.
                cursor: respondido ? 'not-allowed' : 'pointer',
                border: '1px solid #aaa',
                borderRadius: '8px',
                /* CAMBIO DINÁMICO DE ESTILO: 
                   Si ya se respondió y este botón en particular es el correcto, se pinta de verde automáticamente, 
                   ayudando al usuario a ver cuál era la respuesta correcta si falló.
                */
                backgroundColor: respondido && op.id === pokemonActual.id ? '#4caf50' : '#f5f5f5',
                color: respondido && op.id === pokemonActual.id ? 'white' : 'black'
              }}
            >
              {op.name}
            </button>
          ))}
        </div>

        {/* BOTÓN SIGUIENTE TURNO: Solo aparece después de que el usuario ha hecho una elección */}
        {respondido && (
          <button 
            // Vuelve a llamar a generarPregunta pasándole el 'pool' original para no repetir descargas de internet.
            onClick={() => generarPregunta(pool)}
            style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#008cba', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '1rem' }}
          >
            Siguiente Pokémon →
          </button>
        )}

      </div>
    </div>
  )
}

export default GamePage