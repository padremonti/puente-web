import React, { useState, useEffect } from "react";

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

const temasPermitidos = [
  "espiritualidad",
  "inteligencia emocional",
  "salud mental",
  "valores",
  "desarrollo humano",
  "crecimiento personal",
  "motivación",
  "fe",
  "relaciones humanas"
];

function esMensajeRelacionado(texto) {
  const textoMin = texto.toLowerCase();
  return temasPermitidos.some((tema) => textoMin.includes(tema));
}

// ... (resto del componente completo insertado previamente)

export default function PuenteChat() {
  // ... lógica del componente (omito para simplificar aquí en pantalla)
}
