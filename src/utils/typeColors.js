// Exporta un objeto constante que mapea cada tipo de Pokémon con un código de color hexadecimal (estilo Tailwind CSS).
export const TYPE_COLORS = {
  fire:     '#f97316', // Naranja para tipo Fuego
  water:    '#3b82f6', // Azul para tipo Agua
  grass:    '#22c55e', // Verde para tipo Planta (Grass)
  electric: '#eab308', // Amarillo para tipo Eléctrico
  psychic:  '#ec4899', // Rosa para tipo Psíquico
  ice:      '#67e8f9', // Celeste para tipo Hielo
  dragon:   '#7c3aed', // Morado oscuro para tipo Dragón
  dark:     '#374151', // Gris oscuro para tipo Siniestro (Dark)
  fairy:    '#f9a8d4', // Rosa claro para tipo Hada (Fairy)
  normal:   '#9ca3af', // Gris medio para tipo Normal
  fighting: '#b45309', // Marrón oscuro para tipo Lucha (Fighting)
  flying:   '#93c5fd', // Azul claro para tipo Volador (Flying)
  poison:   '#a855f7', // Púrpura para tipo Veneno (Poison)
  ground:   '#d97706', // Ocre/Tierra para tipo Tierra (Ground)
  rock:     '#78716c', // Gris piedra para tipo Roca
  bug:      '#84cc16', // Verde lima para tipo Bicho (Bug)
  ghost:    '#6d28d9', // Violeta para tipo Fantasma (Ghost)
  steel:    '#94a3b8', // Gris azulado para tipo Acero (Steel)
}

// Extrae todas las propiedades (las llaves) del objeto TYPE_COLORS y las guarda en un array.
// Resultado: ['fire', 'water', 'grass', ..., 'steel']
export const TYPES = Object.keys(TYPE_COLORS)

/* Exporta una función que recibe el nombre de un tipo (ej: 'fire') y devuelve su color.
  Usa el operador lógico || (OR) para devolver un color gris por defecto ('#9ca3af') si el tipo no existe en el objeto.
*/
export const getTypeColor = (type) => TYPE_COLORS[type] || '#9ca3af'

/* Exporta una función que recibe el valor numérico de una estadística (v) y devuelve un color usando operadores ternarios encadenados:
  - Si el valor es mayor o igual a 100 (Estadística excelente): Devuelve verde ('#4ade80').
  - Si no, pero es mayor o igual a 60 (Estadística media): Devuelve amarillo ('#facc15').
  - Si es menor a 60 (Estadística baja): Devuelve rojo/coral ('#f87171').
*/
export const getStatColor = (v) => v >= 100 ? '#4ade80' : v >= 60 ? '#facc15' : '#f87171'