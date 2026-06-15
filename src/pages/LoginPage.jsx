// Importa el hook useState de React para manejar los estados del formulario y de la interfaz.
import { useState } from 'react'

import { useNavigate } from 'react-router-dom'

// Importa los métodos oficiales de Firebase Auth para loguear, registrar, usar popups y actualizar el perfil.
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  updateProfile
} from 'firebase/auth'


import { auth, googleProvider, githubProvider } from '../firebase'
import './LoginPage.css'


function LoginPage() {
  const navigate        = useNavigate()
  
  // Estado para controlar si el formulario está en modo 'login' o en modo 'registro'.
  const [modo, setModo] = useState('login')
  
  // Estados para capturar los valores de cada uno de los inputs del formulario.
  const [nombre, setNombre] = useState('')
  const [email, setEmail]   = useState('')
  const [pass, setPass]     = useState('')
  
  // Estado para almacenar y mostrar los mensajes de error legibles si la autenticación falla.
  const [error, setError]   = useState('')

  // Función asíncrona para manejar el envío del formulario tradicional (Email/Contraseña).
  async function handleEmail(e) {
    e.preventDefault() // Evita que la página se recargue al enviar el formulario.
    setError('')       
    
    try {
      if (modo === 'login') {
        // Si está en modo login, intenta iniciar sesión con las credenciales ingresadas.
        await signInWithEmailAndPassword(auth, email, pass)
      } else {
        // Si está en modo registro, crea el nuevo usuario en Firebase.
        const cred = await createUserWithEmailAndPassword(auth, email, pass)
        // Firebase no guarda el nombre de usuario al crearlo con email; lo añadimos al perfil inmediatamente aquí.
        await updateProfile(cred.user, { displayName: nombre })
      }
      // Si todo sale bien, redirige al usuario a la página de inicio.
      navigate('/')
    } catch (err) {
      // Si Firebase lanza un error, lo captura, lo traduce usando nuestra función utilitaria y lo guarda en el estado.
      setError(traducirError(err.code))
    }
  }

  // Función asíncrona para manejar el inicio de sesión rápido con Google.
  async function handleGoogle() {
    try {
      // Abre una ventana emergente (popup) configurada con el proveedor de Google.
      await signInWithPopup(auth, googleProvider)
      // Redirige al inicio tras un login exitoso.
      navigate('/')
    } catch (err) {
      // Captura y traduce el error si el usuario cierra el popup o cancela el proceso.
      setError(traducirError(err.code))
    }
  }

  // Función asíncrona para manejar el inicio de sesión rápido con GitHub.
  async function handleGithub() {
    try {
      // Abre la ventana emergente configurada con el proveedor de GitHub.
      await signInWithPopup(auth, githubProvider)
      // Redirige al inicio tras un login exitoso.
      navigate('/')
    } catch (err) {
      setError(traducirError(err.code))
    }
  }

  // Comienza el renderizado de la interfaz gráfica.
  return (
    <div className="page">
      <div className="auth-box">
        {/* Cambia dinámicamente el título principal dependiendo del estado del 'modo' */}
        <h2>{modo === 'login' ? 'Iniciar Sesión' : 'Registro'}</h2>

        {/* Renderizado condicional: Muestra el párrafo de error solo si el estado 'error' contiene texto */}
        {error && <p className="auth-error">{error}</p>}

        {/* Formulario que dispara la función handleEmail al enviarse */}
        <form onSubmit={handleEmail}>
          {/* El campo "Nombre" solo se renderiza si el usuario está en la vista de 'registro' */}
          {modo === 'registro' && (
            <input
              type="text"
              placeholder="Nombre"
              value={nombre}
              // Guarda el texto y limpia el error en pantalla para que el usuario intente de nuevo sin avisos molestos.
              onChange={e => { setNombre(e.target.value); setError('') }}
              required
            />
          )}
          
          {/* Input para el Correo Electrónico */}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => { setEmail(e.target.value); setError('') }}
            required
          />
          
          {/* Input para la Contraseña */}
          <input
            type="password"
            placeholder="Contraseña (mínimo 6 caracteres)"
            value={pass}
            onChange={e => { setPass(e.target.value); setError('') }}
            required
          />
          
          {/* Botón de envío que adapta su texto según el modo actual */}
          <button type="submit">
            {modo === 'login' ? 'Entrar' : 'Registrarse'}
          </button>
        </form>

        {/* Separador estético para la sección de redes sociales */}
        <div className="auth-divider">— o continúa con —</div>

        {/* Botones para desencadenar el flujo OAuth con ventanas emergentes */}
        <button className="btn-social btn-google" onClick={handleGoogle}>
          Iniciar con Google
        </button>
        <button className="btn-social btn-github" onClick={handleGithub}>
          Iniciar con GitHub
        </button>

        {/* Sección inferior para alternar entre el formulario de Login y el de Registro */}
        <p className="auth-switch">
          {modo === 'login' ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
          <button onClick={() => { setModo(modo === 'login' ? 'registro' : 'login'); setError('') }}>
            {modo === 'login' ? 'Regístrate aquí' : 'Inicia sesión'}
          </button>
        </p>
      </div>
    </div>
  )
}

/**
 * Función utilitaria (Helper) fuera del componente que toma el código de error técnico de Firebase 
 * y devuelve un mensaje en español amigable para el usuario final.
 */
function traducirError(code) {
  const errores = {
    'auth/user-not-found':       'Usuario no encontrado.',
    'auth/wrong-password':       'Contraseña incorrecta.',
    'auth/email-already-in-use': 'El email ya está en uso.',
    'auth/weak-password':        'La contraseña debe tener al menos 6 caracteres.',
    'auth/invalid-email':        'Email no válido.',
    'auth/popup-closed-by-user': 'Ventana cerrada antes de completar.',
    'auth/invalid-credential':   'Email o contraseña incorrectos.',
  }
  // Si el código de error no está en el diccionario, devuelve un mensaje genérico.
  return errores[code] || 'Ha ocurrido un error. Inténtalo de nuevo.'
}

// Exporta el componente para que pueda ser utilizado en las rutas de App.jsx.
export default LoginPage