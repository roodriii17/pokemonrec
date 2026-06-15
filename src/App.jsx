// Importa los hooks esenciales de React: useState (para guardar el estado) y useEffect (para efectos secundarios).
import { useState, useEffect } from 'react'

// Importa los componentes de 'react-router-dom' necesarios para definir las rutas y la navegación de la app.
import { Routes, Route } from 'react-router-dom'

// Importa la función de Firebase que escucha en tiempo real si el estado de autenticación del usuario cambia.
import { onAuthStateChanged } from 'firebase/auth'

// Importa el servicio de autenticación configurado previamente en tu archivo local de firebase.
import { auth } from './firebase'

// Importación de componentes de la interfaz (en este caso, la barra de navegación superior).
import Header from './components/Header'

// Importación de las distintas páginas (vistas) que tendrá tu aplicación.
import LandingPage from './pages/LandingPage'
import PokedexPage from './pages/PokedexPage'
import DetallePage from './pages/DetallePage'
import GamePage from './pages/GamePage'
import LoginPage from './pages/LoginPage'
import NotFoundPage from './pages/NotFoundPage'

// Definición del componente principal de la aplicación.
function App() {
  /* Declara el estado 'usuario'. 
    - Inicia en 'undefined' (significa que Firebase aún está comprobando si hay sesión activa).
    - Pasará a ser el 'objeto usuario' si está logueado, o 'null' si no lo está.
  */
  const [usuario, setUsuario] = useState(undefined)

  // useEffect se ejecuta una sola vez cuando el componente se monta en el navegador (debido al array vacío [] al final).
  useEffect(() => {
    /*
      onAuthStateChanged se conecta a Firebase y reacciona cada vez que el usuario inicia o cierra sesión.
      Devuelve una función de desuscripción que guardamos en la constante 'unsub'.
    */
    const unsub = onAuthStateChanged(auth, (user) => {
      // Si existe 'user' lo guarda; si es falso/null, guarda 'null'. Esto elimina el 'undefined' inicial.
      setUsuario(user || null)
    })
    
    // Al retornar 'unsub', React limpiará este "escuchador" si el componente App llegara a desmontarse, evitando fugas de memoria.
    return unsub
  }, [])

  /*
    Si el estado es 'undefined', significa que Firebase todavía está validando la sesión.
    Se retorna 'null' para mostrar una pantalla en blanco (o podrías poner un spinner de carga) y evitar parpadeos visuales.
  */
  if (usuario === undefined) return null 

  // Una vez que Firebase responde (usuario es un objeto o null), se renderiza la interfaz.
  return (
    <>
      {/* Renderiza el Header de la aplicación y le pasa los datos del usuario como una prop. */}
      <Header usuario={usuario} />
      
      {/* Contenedor que agrupa todas las rutas posibles de la aplicación. */}
      <Routes>
        <Route path="/"                   element={<LandingPage />} />
        <Route path="/pokemons"           element={<PokedexPage />} />
        <Route path="/detalle/:idPokemon" element={<DetallePage />} />
        <Route path="/jugar"              element={<GamePage usuario={usuario} />} />     
        <Route path="/login"              element={<LoginPage />} />
        <Route path="*"                   element={<NotFoundPage />} />
      </Routes>
    </>
  )
}

// Exporta el componente App para que pueda ser importado y renderizado en el archivo index.js / main.jsx.
export default App