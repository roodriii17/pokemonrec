// Importa la función necesaria para inicializar tu aplicación de Firebase.
import { initializeApp } from 'firebase/app'

// Importa los servicios de autenticación y los proveedores para iniciar sesión con Google y GitHub.
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from 'firebase/auth'

// Objeto de configuración con las credenciales únicas de tu proyecto en Firebase.
const firebaseConfig = {
  apiKey: "AIzaSyC5Uj9Cs8cyuQC1fCGrBomY_I00IcMNdoY",        
  authDomain: "pokerec2026.firebaseapp.com",               
  projectId: "pokerec2026",                                 
  storageBucket: "pokerec2026.firebasestorage.app",         
  messagingSenderId: "837998467731",                        
  appId: "1:837998467731:web:1888602287c7e600c74b66"        
}

// Inicializa Firebase en tu aplicación web pasando el objeto de configuración anterior.
const app = initializeApp(firebaseConfig)

// Inicializa el servicio de autenticación vinculado a tu app y lo exporta para usarlo en otros archivos.
export const auth = getAuth(app)

// Crea y exporta una instancia del proveedor de autenticación de Google (para inicio de sesión con Google).
export const googleProvider = new GoogleAuthProvider()

// Crea y exporta una instancia del proveedor de autenticación de GitHub (para inicio de sesión con GitHub).
export const githubProvider = new GithubAuthProvider()