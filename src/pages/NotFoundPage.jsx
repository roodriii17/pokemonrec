import { useNavigate } from 'react-router-dom'

// Importa los estilos CSS específicos para darle diseño visual y centrar la página de error 404.
import './NotFoundPage.css'

// Define la función del componente NotFoundPage.
function NotFoundPage() {
  // Inicializa la función de navegación y la guarda en la constante 'navigate'.
  const navigate = useNavigate()

  return (
   
    <div className="page not-found">
      <h1>404</h1>
      <p>Esta página no existe.</p>
      <button className="btn" onClick={() => navigate('/')}>Volver al inicio</button>
      
    </div>
  )
}

export default NotFoundPage