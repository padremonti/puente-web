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

export default function PuenteChat() {
  const [language, setLanguage] = useState(localStorage.getItem("language") || null);
  const [gender, setGender] = useState(localStorage.getItem("gender") || null);
  const [voiceEnabled, setVoiceEnabled] = useState(localStorage.getItem("voiceEnabled") === "true");
  const [voiceOption, setVoiceOption] = useState(localStorage.getItem("voiceOption") || "onyx");
  const [showIntro, setShowIntro] = useState(!language || !gender);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [typingMessage, setTypingMessage] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => localStorage.setItem("language", language || ""), [language]);
  useEffect(() => localStorage.setItem("gender", gender || ""), [gender]);
  useEffect(() => localStorage.setItem("voiceEnabled", voiceEnabled.toString()), [voiceEnabled]);
  useEffect(() => localStorage.setItem("voiceOption", voiceOption), [voiceOption]);

  const speak = async (text) => {
    setIsSpeaking(true);
    try {
      const response = await fetch("https://api.openai.com/v1/audio/speech", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({ model: "tts-1", voice: voiceOption, input: text }),
      });

      if (!response.ok) throw new Error("No se pudo generar el audio");

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);

      audio.onended = () => setIsSpeaking(false);
      audio.onerror = () => setIsSpeaking(false);
      await audio.play();
    } catch (error) {
      console.error("Error al reproducir voz:", error);
      setMessages((prev) => [...prev, { sender: "bot", text: "Lo siento, no pude reproducir el audio." }]);
      setIsSpeaking(false);
    }
  };

  const animateTyping = (text) => {
    let index = 0;
    setTypingMessage("");
    const interval = setInterval(() => {
      index++;
      setTypingMessage(text.slice(0, index));
      if (index >= text.length) {
        clearInterval(interval);
        setMessages((prev) => [...prev, { sender: "bot", text }]);
        setTypingMessage("");
        setLoading(false);
      }
    }, 60);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    setTypingMessage("");

    if (!esMensajeRelacionado(userMessage.text)) {
      const advertencia = "puen está diseñado para acompañarte en temas de espiritualidad, salud emocional y crecimiento interior. Si tienes preguntas sobre otros temas, te invito a enfocarnos en lo que realmente nutre el alma.";
      if (voiceEnabled) speak(advertencia);
      animateTyping(advertencia);
      return;
    }

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: `Eres puen, un acompañante emocional y espiritual. Tu enfoque está en espiritualidad, inteligencia emocional, salud mental, valores, desarrollo humano, crecimiento personal, motivación, fe y relaciones humanas. Si el usuario habla de temas ajenos, agradécele y recuérdale amablemente la función de puen, animándolo a enfocarse en lo que alimenta su interior.`,
            },
            ...messages.map((m) => ({ role: m.sender === "user" ? "user" : "assistant", content: m.text })),
            { role: "user", content: userMessage.text },
          ],
        }),
      });

      const data = await response.json();
      const content = data?.choices?.[0]?.message?.content?.trim();
      if (content) {
        const reply = content + " ¿Quieres que avancemos con eso ahora?";
        if (voiceEnabled) speak(reply);
        animateTyping(reply);
      } else {
        throw new Error("Respuesta vacía");
      }
    } catch (error) {
      console.error(error);
      setMessages((prev) => [...prev, { sender: "bot", text: "Lo siento, algo salió mal 😕" }]);
      setLoading(false);
    }
  };

  if (showIntro) {
    return (
      <div className="min-h-screen bg-[#fdf2e7] flex flex-col items-center justify-center p-4 space-y-4 text-center">
        <img src="/puen-logo.png" className="w-24 h-24 rounded-xl" />
        <h1 className="text-2xl font-bold text-[#c45c2d]">Bienvenido a puen 🌉</h1>
        <p className="text-sm text-gray-700 max-w-md">
          puen es un espacio de acompañamiento centrado en espiritualidad, salud emocional, valores y desarrollo personal. Aquí puedes encontrar claridad, consuelo y motivación.
        </p>
        {!language ? (
          <>
            <p>Selecciona tu idioma / Select your language:</p>
            <div className="flex gap-4">
              <button onClick={() => setLanguage("es")} className="bg-[#c45c2d] text-white px-4 py-2 rounded">Español</button>
              <button onClick={() => setLanguage("en")} className="bg-[#c45c2d] text-white px-4 py-2 rounded">English</button>
            </div>
          </>
        ) : !gender ? (
          <>
            <p>{language === "en" ? "How would you like puen to address you?" : "¿Con qué género deseas que puen te hable?"}</p>
            <div className="flex gap-4">
              <button onClick={() => { setGender("female"); setShowIntro(false); }} className="bg-[#c45c2d] text-white px-4 py-2 rounded">Femenino</button>
              <button onClick={() => { setGender("male"); setShowIntro(false); }} className="bg-[#c45c2d] text-white px-4 py-2 rounded">Masculino</button>
            </div>
          </>
        ) : null}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdf2e7] flex flex-col items-center p-4 space-y-4">
      <div className="w-full max-w-md space-y-2">
        <div className="relative flex justify-center items-center">
          <img src="/puen-logo.png" className="w-20 h-20 rounded-xl" alt="puen-logo.png" />
          <button
            onClick={() => setVoiceEnabled(!voiceEnabled)}
            className="absolute right-0 top-1 bg-[#c45c2d] text-white px-2 py-1 rounded text-sm"
          >
            Voz: {voiceEnabled ? "🔊" : "🔇"}
          </button>
        </div>

        <div className="h-96 overflow-y-auto p-2 space-y-2 bg-white rounded-xl shadow-inner">
          {messages.map((msg, i) => (
            <div key={i} className={`text-sm p-2 rounded-xl max-w-xs whitespace-pre-wrap ${msg.sender === "user" ? "bg-blue-100 ml-auto" : "bg-orange-100"}`}>
              {msg.text}
            </div>
          ))}
          {typingMessage && (
            <div className="text-sm p-2 rounded-xl max-w-xs bg-orange-100 animate-pulse">{typingMessage}</div>
          )}
        </div>

        <div className="flex space-x-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !loading && sendMessage()}
            placeholder="Escribe aquí..."
            className="flex-1 border border-gray-300 p-2 rounded"
            disabled={loading}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="bg-[#c45c2d] text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Enviar
          </button>
        </div>

        {(loading || isSpeaking) && (
          <div className="text-center mt-2">
            {loading && <p className="text-sm text-gray-500 italic">⏳ puen está pensando...</p>}
            {isSpeaking && <p className="text-sm text-gray-500 italic">🔊 puen está hablando...</p>}
          </div>
        )}
      </div>
    </div>
  );
}
