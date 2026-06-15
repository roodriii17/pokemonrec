// Importa la biblioteca principal de React para poder usar JSX y componentes.
import React from 'react'

// Importa el paquete encargado de conectar React con el DOM (el navegador) usando el nuevo método de React 18.
import ReactDOM from 'react-dom/client'

// Importa el componente que envuelve la app para activar el enrutamiento (navegación entre páginas sin recargar).
import { BrowserRouter } from 'react-router-dom'

// Importa el componente principal "App", que actúa como el contenedor raíz de toda tu aplicación.
import App from './App.jsx'

// Importa los estilos CSS globales que se aplicarán a toda la aplicación.
import './index.css'

// Busca el elemento HTML con el id 'root' en tu index.html y crea el "nodo raíz" donde se montará React.
ReactDOM.createRoot(document.getElementById('root')).render(
  // Activa el modo estricto de React para ayudar a encontrar problemas potenciales durante el desarrollo.
  <React.StrictMode>
    
    
    <BrowserRouter>
      
      
      <App />
      
    </BrowserRouter>
    
  </React.StrictMode>
)