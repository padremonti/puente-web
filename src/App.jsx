import React, { useState, useEffect } from "react";

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;


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
  const [showDonateModal, setShowDonateModal] = useState(false);
  const [agradecimientoActivo, setAgradecimientoActivo] = useState(false);
  const [showVideoIntro, setShowVideoIntro] = useState(false);
  const [showReturningMessage, setShowReturningMessage] = useState(false);

  useEffect(() => {
    const lastVisit = localStorage.getItem("lastVisit");
    const now = Date.now();
  
    // Si ha pasado más de 24 horas desde la última visita
    if (lastVisit && now - parseInt(lastVisit) > 24 * 60 * 60 * 1000) {
      setShowReturningMessage(true);
    }
  
    // Guardar hora de la visita actual
    localStorage.setItem("lastVisit", now.toString());
  }, []);
  
  
  const textos = {
    es: {
      eslogan: "donde las almas se encuentran",
      donar: "Donar",
      verIntro: "▶️ Ver intro",
      bienvenida: "Bienvenido a puen 🌉",
      seleccionaIdioma: "Selecciona tu idioma:",
      seleccionaGenero: "¿Con qué género deseas que puen te hable?",
      cerrar: "Cerrar",
      gracias: "¡Gracias por tu apoyo!",
      mensajeGracias: "Tu donativo ayuda a que puen siga acompañando a más personas con calidez, espiritualidad y humanidad.",
      regresar: "Regresar al chat",
      pensando: "⏳ puen está pensando...",
      hablando: "🔊 puen está hablando...",
      advertencia: "Nota: Estás usando la versión Lite de puen. Si cierras o actualizas tu navegador, esta conversación se perderá."
    },
    en: {
      eslogan: "where souls meet",
      donar: "Donate",
      verIntro: "▶️ Watch intro",
      bienvenida: "Welcome to puen 🌉",
      seleccionaIdioma: "Select your language:",
      seleccionaGenero: "How would you like puen to address you?",
      cerrar: "Close",
      gracias: "Thank you for your support!",
      mensajeGracias: "Your donation helps puen continue supporting more people with warmth, spirituality, and humanity.",
      regresar: "Return to chat",
      pensando: "⏳ puen is thinking...",
      hablando: "🔊 puen is speaking...",
      advertencia: "Note: You are using the Lite version of puen. If you close or refresh your browser, this conversation will be lost."
    },
    pt: {
      eslogan: "onde as almas se encontram",
      donar: "Doar",
      verIntro: "▶️ Ver introdução",
      bienvenida: "Bem-vindo ao puen 🌉",
      seleccionaIdioma: "Selecione seu idioma:",
      seleccionaGenero: "Com qual gênero você gostaria que o puen fale com você?",
      cerrar: "Fechar",
      gracias: "Obrigado pelo seu apoio!",
      mensajeGracias: "Sua doação ajuda o puen a continuar acompanhando mais pessoas com calor humano, espiritualidade e humanidade.",
      regresar: "Voltar ao chat",
      pensando: "⏳ puen está pensando...",
      hablando: "🔊 puen está falando...",
      advertencia: "Nota: Você está usando a versão Lite do puen. Se fechar ou atualizar o navegador, a conversa será perdida."
    },
    fr: {
      eslogan: "là où les âmes se rencontrent",
      donar: "Faire un don",
      verIntro: "▶️ Voir l’intro",
      bienvenida: "Bienvenue sur puen 🌉",
      seleccionaIdioma: "Choisissez votre langue :",
      seleccionaGenero: "Comment souhaitez-vous que puen s'adresse à vous ?",
      cerrar: "Fermer",
      gracias: "Merci pour votre soutien !",
      mensajeGracias: "Votre don aide puen à continuer d’accompagner plus de personnes avec chaleur, spiritualité et humanité.",
      regresar: "Retourner au chat",
      pensando: "⏳ puen réfléchit...",
      hablando: "🔊 puen parle...",
      advertencia: "Remarque : vous utilisez la version Lite de puen. Si vous fermez ou actualisez votre navigateur, la conversation sera perdue."
    }
  };
  
  const t = textos[language] || textos["es"];
  
  [language];
  

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
              content: `Eres puen, un acompañante emocional y espiritual. 
            Estás aquí para ayudar con temas como espiritualidad, inteligencia emocional, salud mental, valores, desarrollo humano, crecimiento personal, motivación, fe y relaciones humanas.
            Si el usuario plantea algo fuera de ese enfoque (por ejemplo temas técnicos, políticos, o ajenos al crecimiento interior), responde con amabilidad agradeciendo su mensaje y explicándole que puen está centrado en el bienestar emocional, la fe y la profundidad humana.
            Si el usuario plantea algo relacionado con suicidio, tendencias suicidas, o autolesiones, debes orientarlo para que busque atención profesional en las áreas correspondientes, lo más pronto posible.
            Si el usuario plantea algo relacionado con prostitucíon, pornografía infantil en cualquier vertiente y otras formas de pornografía, trata de personas, decir con firmeza que puen no es el espacio para hablar de eso.
            Si el usuario plantea algo relacionado con maltrato físico a personas o animales, debes orientarlo para que busque atención profesional en las instancias correspondientes, lo más pronto posible. 
            Tu tono es cercano, respetuoso, cálido y claro. Siempre priorizas lo humano y lo interior por encima de lo informativo o externo.`,
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

  if (showReturningMessage) {
    return (
      <div className="min-h-screen bg-[#fdf2e7] flex flex-col items-center justify-center text-center p-6 space-y-4">
        <img src="/puen-logo.png" className="w-24 h-24 rounded-xl" />
        <h1 className="text-xl font-bold text-[#c45c2d]">{t.gracias}</h1>
        <p className="text-sm text-gray-700 max-w-md">{t.mensajeGracias}</p>
        <button
          onClick={() => setShowReturningMessage(false)}
          className="bg-[#c45c2d] text-white px-4 py-2 rounded"
        >
          {t.regresar}
        </button>
      </div>
    );
  }
  

  if (showIntro) {
    return (
      <div className="min-h-screen bg-[#fdf2e7] flex flex-col items-center justify-center p-4 space-y-4 text-center">
        <img src="/puen-logo.png" className="w-24 h-24 rounded-xl" />
        <h1 className="text-2xl font-bold text-[#c45c2d]">{t.bienvenida} 🌉</h1>
        <p className="text-sm italic text-[#c45c2d] font-medium">{t.eslogan}</p>
        <p className="text-sm text-gray-700 max-w-md">
          puen es un espacio de acompañamiento centrado en espiritualidad, salud emocional, valores y desarrollo personal. Aquí puedes encontrar claridad, consuelo y motivación.
        </p>
        {!language ? (
          <>
            <p>Selecciona tu idioma / Select your language:</p>
              <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setLanguage("es")} className="bg-[#c45c2d] text-white px-4 py-2 rounded">Español</button>
            <button  onClick={() => setLanguage("en")} className="bg-[#c45c2d] text-white px-4 py-2 rounded">English</button>
            <button onClick={() => setLanguage("pt")} className="bg-[#c45c2d] text-white px-4 py-2 rounded">Português</button>
            <button onClick={() => setLanguage("fr")} className="bg-[#c45c2d] text-white px-4 py-2 rounded">Français</button>
</div>

          </>
          
        ) : !gender ? (
          <>
            <p>{t.seleccionaGenero}</p>
            <div className="flex gap-4">
              <button onClick={() => { setGender("female"); setShowIntro(false); }} className="bg-[#c45c2d] text-white px-4 py-2 rounded">Femenino</button>
              <button onClick={() => { setGender("male"); setShowIntro(false); }} className="bg-[#c45c2d] text-white px-4 py-2 rounded">Masculino</button>
            </div>
          </>
        ) : null}


        {language && (
  <div className="w-full max-w-md aspect-video">
    <iframe
      className="rounded-xl w-full h-full"
      src={
        language === "en"
          ? "https://www.youtube.com/embed/WqOfshj28GM"
          : language === "fr"
          ? "https://www.youtube.com/embed/ii2uTNtQ3kA"
          : language === "pt"
          ? "https://www.youtube.com/embed/pX_CN2E7JYc"  
          : "https://www.youtube.com/embed/a8JuHY6B4QE"
      }
      title="Intro"
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    ></iframe>
  </div>
)}

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
        <div className="text-center mt-4">
<button
  onClick={() => setShowDonateModal(true)}
  className="text-[#c45c2d] underline text-sm font-medium"
>
 💛 {t.donar}

</button>

</div>
{agradecimientoActivo && (
  <div className="fixed inset-0 bg-[#fdf2e7] flex flex-col items-center justify-center text-center p-6 z-50">
    <div className="max-w-sm bg-white rounded-xl shadow-xl p-6 space-y-4">
      <h2 className="text-xl font-semibold text-[#c45c2d]">{t.gracias}</h2>
      <p className="text-gray-700 text-sm">
        Tu donativo ayuda a que puen siga acompañando a más personas con calidez, espiritualidad y humanidad.
      </p>
      <button
        onClick={() => setAgradecimientoActivo(false)}
        className="mt-4 bg-[#c45c2d] text-white px-4 py-2 rounded text-sm"
      >
        Regresar al chat
      </button>
    </div>
  </div>
)}
{showDonateModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-xl text-center space-y-4">
      <h2 className="text-lg font-semibold text-[#c45c2d]">Apoya a puen</h2>
      <p className="text-sm text-gray-600">Tu donativo ayuda a mantener este espacio gratuito y disponible para más personas.</p>

      <div className="space-y-2">
      <a
  href="https://donate.stripe.com/14k6p29k82gSdfG28a"
  target="_blank"
  title="Donar con Stripe"
  className="block bg-[#6772e5] text-white py-2 rounded font-medium"
>
  Donar con Stripe
</a>

<a
  href="https://www.paypal.com/paypalme/puenapp"
  target="_blank"
  title="Donar con PayPal"
  className="block bg-[#ffc439] text-black py-2 rounded font-medium"
>
  Donar con PayPal
</a>

<a
  href="https://buymeacoffee.com/puenapp"
  target="_blank"
  title="Apoyar en BuyMeACoffee"
  className="block bg-[#ff813f] text-white py-2 rounded font-medium"
>
  BuyMeACoffee
</a>

<a
  href="https://link.mercadopago.com.mx/puenapp"
  target="_blank"
  title="Donar con MercadoPago"
  className="block bg-[#009ee3] text-white py-2 rounded font-medium"
>
  MercadoPago
</a>

</div> 
      <button
        onClick={() => setShowDonateModal(false)}
        className="mt-4 text-sm text-gray-500 underline"
      >
        {t.cerrar}
      </button>
    </div>
  </div>
)}

<div className="text-center">
  <button
    onClick={() => setShowVideoIntro(true)}
    className="text-[#c45c2d] underline text-sm font-medium"
  >
    ▶️ {t.verIntro}
  </button>
</div>

{showVideoIntro && (
  <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl p-4 max-w-lg w-full space-y-2">
      <iframe
        className="w-full aspect-video rounded"
        src={
          language === "en"
            ? "https://www.youtube.com/embed/_6NC-SKGuFA"
            : language === "fr"
            ? "https://www.youtube.com/embed/VIDEO_ID_FR"
            : language === "pt"
            ? "https://www.youtube.com/embed/VIDEO_ID_PT"
            : "https://www.youtube.com/embed/8hdcyqRdL-s"
        }
        
        title="Video introductorio de puen"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
      <button
        onClick={() => setShowVideoIntro(false)}
        className="text-sm text-gray-500 underline w-full mt-2"
      >
        Cerrar
      </button>
    </div>
  </div>
)}

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
        <p className="text-xs text-gray-500 text-center italic mt-2">
        {t.advertencia}
        </p>

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
            {loading && <p className="text-sm text-gray-500 italic">⏳{t.pensando} </p>}
            {isSpeaking && <p className="text-sm text-gray-500 italic">🔊 {t.hablando} </p>}
          </div>
        )}
      </div>
    </div>
  );
}
