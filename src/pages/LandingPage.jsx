// Importa el hook para redirigir al usuario a las secciones de la Pokédex o del Juego por medio de botones.
import { useNavigate } from 'react-router-dom'

// Importa los estilos CSS específicos para estructurar el diseño de la página de bienvenida.
import './LandingPage.css'

// Define la función del componente LandingPage.
function LandingPage() {
  // Inicializa la función de enrutamiento y la guarda en la constante 'navigate'.
  const navigate = useNavigate()

  // Comienza el retorno del HTML/JSX de la página.
  return (
    // Contenedor principal que envuelve todo el contenido de la landing page.
    <div className="landing">

      {/* SECCIÓN HERO: La zona de presentación con impacto visual que ve el usuario nada más entrar */}
      <div className="landing-hero">
        {/* Imagen del arte oficial de Pikachu obtenida directamente del repositorio de la PokeAPI */}
        <img
          src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png"
          alt="Pikachu"
          className="landing-pikachu" // Clase para aplicarle animaciones o tamaños específicos en el CSS
        />
        {/* Título principal del proyecto */}
        <h1>Poke Api</h1>
        {/* Texto de introducción o eslogan descriptivo */}
        <p>Explora más de 1000 Pokémon y pon a prueba tus conocimientos.</p>
        
        {/* Contenedor para alinear los dos botones principales de llamada a la acción (CTA) */}
        <div className="landing-btns">
          {/* Botón tradicional que redirige a la lista completa de Pokémon (/pokemons) */}
          <button onClick={() => navigate('/pokemons')}>Ver Pokédex</button>
          
          {/* Botón con estilo secundario o delineado (outline) que redirige a la sección del mini-juego (/jugar) */}
          <button className="outline" onClick={() => navigate('/jugar')}>Jugar</button>
        </div>
      </div>

      {/* SECCIÓN CARDS: Bloque de tres columnas que explica las características clave de la aplicación */}
      <div className="landing-cards">
        
        {/* Tarjeta 1: Información sobre la funcionalidad de la Pokédex */}
        <div className="lcard">
          <span>📋</span> {/* Emoji descriptivo a modo de icono */}
          <h3>Pokédex</h3>
          <p>Busca y filtra todos los Pokémon con sus estadísticas completas.</p>
        </div>
        
        {/* Tarjeta 2: Información sobre el mini-juego de adivinanzas */}
        <div className="lcard">
          <span>🎮</span> {/* Emoji descriptivo a modo de icono */}
          <h3>Juego</h3>
          <p>Adivina el Pokémon aver cuantos aciertas.</p> {/* Nota: hay un pequeño typo aquí ("aver" en lugar de "a ver") */}
        </div>
        
        {/* Tarjeta 3: Información técnica acerca del origen de los datos */}
        <div className="lcard">
          <span>⚡</span> {/* Emoji descriptivo a modo de icono */}
          <h3>PokéAPI</h3>
          <p>Datos en tiempo real obtenidos directamente de pokeapi.co.</p>
        </div>
        
      </div>

    </div>
  )
}

// Exporta el componente para que pueda ser enlazado a la ruta raíz ("/") en el archivo App.jsx.
export default LandingPage