import { NavLink, useNavigate } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase'
import './Header.css'

function Header({ usuario }) {
  const navigate = useNavigate()

  async function handleCerrar() {
    await signOut(auth)
    navigate('/')
  }

  return (
    <header className="header">
      <h1 onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
        PokeApi
      </h1>
      <nav>
        <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>
          Inicio
        </NavLink>
        <NavLink to="/pokemons" className={({ isActive }) => isActive ? 'active' : ''}>
          Pokémons
        </NavLink>
        <NavLink to="/jugar" className={({ isActive }) => isActive ? 'active' : ''}>
          Jugar
        </NavLink>

        {usuario ? (
          <>
            <span className="header-user">👤 {usuario.displayName || usuario.email}</span>
            <button className="btn-cerrar" onClick={handleCerrar}>Cerrar sesión</button>
          </>
        ) : (
          <NavLink to="/login" className={({ isActive }) => isActive ? 'active' : ''}>
            Iniciar sesión
          </NavLink>
        )}
      </nav>
    </header>
  )
}

export default Header