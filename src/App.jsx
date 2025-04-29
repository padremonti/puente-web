// C4r10 4qt!s 3t PhR4nC35cV5 pp 0R4t3xN0b!5 
import React, { useState, useEffect } from "react";

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;


export default function PuenteChat() {
  const [language, setLanguage] = useState(localStorage.getItem("language") || null);
  const [voiceEnabled, setVoiceEnabled] = useState(localStorage.getItem("voiceEnabled") === "true");
  const [voiceOption, setVoiceOption] = useState(localStorage.getItem("voiceOption") || "onyx");
  const [showIntro, setShowIntro] = useState(!language);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [typingMessage, setTypingMessage] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showDonateModal, setShowDonateModal] = useState(false);
  const [agradecimientoActivo, setAgradecimientoActivo] = useState(false);
  const [showVideoIntro, setShowVideoIntro] = useState(false);
  const [showReturningMessage, setShowReturningMessage] = useState(false);
  const [fadeOutVideo, setFadeOutVideo] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showWelcomeToast, setShowWelcomeToast] = useState(true);
  const [fadeOutPrivacy, setFadeOutPrivacy] = useState(false);
  const [fadeInPrivacy, setFadeInPrivacy] = useState(false);
  const [showStartButton, setShowStartButton] = useState(false);



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
  

  useEffect(() => {
    const accepted = localStorage.getItem("privacyAccepted");
    if (!accepted) {
      setTimeout(() => {
        setShowPrivacyModal(true);  // <-- ✅ Lo correcto
      }, 2000);
    }
  }, []);
  
  useEffect(() => {
    if (showWelcomeToast) {
      const timer = setTimeout(() => {
        setShowWelcomeToast(false);
      }, 15000); // 15 segundos
      return () => clearTimeout(timer);
    }
  }, [showWelcomeToast]);
  
  useEffect(() => {
    const geoInfoSaved = localStorage.getItem("geoInfoSaved");
  
    if (!geoInfoSaved) {
      fetch("https://ipapi.co/json/")
        .then(response => response.json())
        .then(data => {
          const country = data.country_name || "";
          const region = data.region || "";
  
          const now = new Date();
          const fecha = now.toLocaleDateString("es-MX", { timeZone: "America/Mexico_City" });
          const hora = now.toLocaleTimeString("es-MX", {
            timeZone: "America/Mexico_City",
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          });
  
          console.log("%cEnviando a Google Sheets:", "color: blue; font-weight: bold", { fecha, hora, country, region });
  
          fetch("https://script.google.com/macros/s/AKfycbymV1MY2XLWuyj-2lRcCyXHlSmp1KwMtvImrgurlbySqlwb7vX6ENDcVX3Nu3v9R1hD/exec", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ fecha, hora, country, region }),
          })
            .then(response => response.json())
            .then(result => {
              if (result.result === "success") {
                console.log("%c✔️ Registro guardado exitosamente en Google Sheets", "color: green; font-weight: bold");
                localStorage.setItem("geoInfoSaved", "true");
              } else {
                console.error("Error en el guardado:", result);
              }
            })
            .catch(error => {
              console.error("Error al guardar en Google Sheets:", error);
            });
        })
        .catch(error => {
          console.error("Error obteniendo la información geográfica:", error);
        });
    } else {
      console.log("%cRegistro ya guardado anteriormente. No se duplica.", "color: orange; font-weight: bold");
    }
  }, []);
  
  
  
    
  const textos = {
    es: {
      iniciar: "iniciar",
      bienvenidaToast: "Bienvenido a puen. Este es tu espacio para conversar, reflexionar y reconectar contigo.",
      eslogan: "donde las almas se encuentran",
      descripcion: "puen es un espacio de acompañamiento centrado en espiritualidad, salud emocional, valores y desarrollo personal. Aquí puedes encontrar claridad, consuelo y motivación.",
      generoF: "Femenino",
      generoM: "Masculino",
      voz: "Voz",
      idioma: "Español",
      donar: "Donar",
      tituloAvisoPrivacidad: "Aviso de privacidad",
      avisoPrivacidad: "En puen respetamos tu privacidad. No recolectamos datos personales sensibles ni almacenamos información que permita identificarte de manera individual. De manera anónima, registramos el país y la región (estado o provincia) desde donde te conectas, así como los temas generales de interés sobre los que conversas en la app. Estos datos se utilizan únicamente para mejorar nuestros servicios, comprender mejor a nuestra comunidad y ofrecer una experiencia más enriquecedora. No almacenamos direcciones IP completas, nombres, correos electrónicos ni información privada. Al utilizar puen, aceptas esta forma de recopilación anónima de datos con fines de mejora continua.", 
      verIntro: "▶️ Ver intro",
      bienvenida: "Bienvenido a puen",
      seleccionaIdioma: "Selecciona tu idioma:",
      seleccionaGenero: "¿Con qué género deseas que puen te hable?",
      escribirAqui: "Escribe aquí...",
      enviar: "Enviar",
      cerrar: "Cerrar",
      gracias: "¡Gracias por tu apoyo!",
      mensajeGracias: "Tu donativo ayuda a que puen siga acompañando a más personas con calidez, espiritualidad y humanidad.",
      regresar: "Regresar al chat",
      pensando: "puen está pensando...",
      hablando: "puen está hablando...",
      advertencia: "Nota: Estás usando la versión Lite de puen. Si cierras o actualizas tu navegador, esta conversación se perderá.",
      apoya: "Apoya a puen",
      mensajeApoyoCorto: "Tu donativo ayuda a mantener este espacio gratuito y disponible para más personas.",
      mensajeApoyo: "Tu donativo ayuda a mantener este espacio gratuito y disponible para más personas.",
    },
    en: {
      iniciar: "start",
      bienvenidaToast: "Welcome to puen. This is your space to talk, reflect, and reconnect with yourself.",
      eslogan: "where souls meet",
      descripcion: "puen is a space for support centered on spirituality, emotional health, values, and personal growth. Here you can find clarity, comfort, and motivation.",
      generoF: "Female",
      generoM: "Male",
      voz: "Voice",
      idioma: "English",
      donar: "Donate",
      tituloAvisoPrivacidad: "Privacy Notice",
      avisoPrivacidad: "At puen, we respect your privacy. We do not collect sensitive personal data or store information that could individually identify you. We anonymously record the country and region (state or province) from which you connect, as well as the general topics of interest you discuss within the app. This data is used solely to improve our services, better understand our community, and offer a richer experience. We do not store full IP addresses, names, emails, or any private information. By using puen, you agree to this anonymous data collection for continuous improvement purposes.",
      verIntro: "▶️ Watch intro",
      bienvenida: "Welcome to puen",
      seleccionaIdioma: "Select your language:",
      seleccionaGenero: "How would you like puen to address you?",
      escribirAqui: "Write here...",
      enviar: "Send",
      cerrar: "Close",
      gracias: "Thank you for your support!",
      mensajeGracias: "Your donation helps puen continue supporting more people with warmth, spirituality, and humanity.",
      regresar: "Return to chat",
      pensando: "puen is thinking...",
      hablando: "puen is speaking...",
      advertencia: "Note: You are using the Lite version of puen. If you close or refresh your browser, this conversation will be lost.",
      apoya: "Support puen", 
      mensajeApoyoCorto: "Your donation helps keep this space free and accessible to more people.",
      mensajeApoyo: "Your donation helps keep this space free and accessible to more people.",

    },
    pt: {
      iniciar: "iniciar",
      bienvenidaToast: "Bem-vindo ao puen. Este é o seu espaço para conversar, refletir e se reconectar consigo mesmo.",
      eslogan: "onde as almas se encontram",
      descripcion: "puen é um espaço de acompanhamento centrado na espiritualidade, saúde emocional, valores e desenvolvimento pessoal. Aqui você pode encontrar clareza, consolo e motivação.",
      generoF: "Feminino",
      generoM: "Masculino",
      voz: "Voz",
      idioma: "Português",
      donar: "Doar",
      tituloAvisoPrivacidad: "Aviso de Privacidade",
      avisoPrivacidad: "Na puen, respeitamos a sua privacidade. Não coletamos dados pessoais sensíveis nem armazenamos informações que possam identificá-lo individualmente. Registramos de forma anônima o país e a região (estado ou província) de onde você se conecta, bem como os temas gerais de interesse que você aborda no app. Esses dados são usados apenas para melhorar nossos serviços, compreender melhor nossa comunidade e oferecer uma experiência mais rica. Não armazenamos endereços IP completos, nomes, e-mails nem informações privadas. Ao usar a puen, você concorda com esta coleta anônima de dados para fins de melhoria contínua.",
      verIntro: "▶️ Ver introdução",
      bienvenida: "Bem-vindo ao puen",
      seleccionaIdioma: "Selecione seu idioma:",
      seleccionaGenero: "Com qual gênero você gostaria que o puen fale com você?",
      escribirAqui: "Escreva aqui...",
      enviar: "Enviar",
      cerrar: "Fechar",
      gracias: "Obrigado pelo seu apoio!",
      mensajeGracias: "Sua doação ajuda o puen a continuar acompanhando mais pessoas com calor humano, espiritualidade e humanidade.",
      regresar: "Voltar ao chat",
      pensando: "puen está pensando...",
      hablando: "puen está falando...",
      advertencia: "Nota: Você está usando a versão Lite do puen. Se fechar ou atualizar o navegador, a conversa será perdida.",
      apoya: "Apoie o puen",
      mensajeApoyoCorto: "Sua doação ajuda a manter este espaço gratuito e acessível para mais pessoas.",
      mensajeApoyo: "Sua doação ajuda a manter este espaço gratuito e acessível para mais pessoas.",
    },
    fr: {
      iniciar: "commencer", 
      eslogan: "là où les âmes se rencontrent",
      bienvenidaToast: "Bienvenue sur puen. Cet espace est pour converser, réfléchir et vous reconnecter à vous-même.",
      descripcion: "puen est un espace d'accompagnement centré sur la spiritualité, la santé émotionnelle, les valeurs et le développement personnel. Vous pouvez y trouver clarté, réconfort et motivation.",
      generoF: "Féminin",
      generoM: "Masculin",
      voz: "Voix",
      idioma: "Français",
      donar: "Faire un don",
      tituloAvisoPrivacidad: "Avis de confidentialité",
      avisoPrivacidad: "Chez puen, nous respectons votre vie privée. Nous ne collectons pas de données personnelles sensibles ni ne stockons d’informations pouvant vous identifier individuellement. Nous enregistrons de manière anonyme le pays et la région (état ou province) depuis lesquels vous vous connectez, ainsi que les sujets d’intérêt général abordés dans l’application. Ces données sont utilisées uniquement pour améliorer nos services, mieux comprendre notre communauté et offrir une expérience enrichissante. Nous ne stockons pas les adresses IP complètes, les noms, les e-mails ni aucune information privée. En utilisant puen, vous acceptez cette collecte anonyme de données à des fins d’amélioration continue.",
      verIntro: "▶️ Voir l’intro",
      bienvenida: "Bienvenue sur puen",
      seleccionaIdioma: "Choisissez votre langue :",
      seleccionaGenero: "Comment souhaitez-vous que puen s'adresse à vous ?",
      escribirAqui: "Écrivez ici...",
      enviar: "Envoyer",
      cerrar: "Fermer",
      gracias: "Merci pour votre soutien !",
      mensajeGracias: "Votre don aide puen à continuer d’accompagner plus de personnes avec chaleur, spiritualité et humanité.",
      regresar: "Retourner au chat",
      pensando: "puen réfléchit...",
      hablando: "puen parle...",
      advertencia: "Remarque : vous utilisez la version Lite de puen. Si vous fermez ou actualisez votre navigateur, la conversation sera perdue.",
      apoya: "Soutenir puen",
      mensajeApoyoCorto: "Votre don aide à maintenir cet espace gratuit et accessible à davantage de personnes.",
      mensajeApoyo: "Votre don aide à maintenir cet espace gratuit et accessible à davantage de personnes.",
    }
  };
  
  const t = textos[language] || textos["es"];
  
  [language];
  

  useEffect(() => localStorage.setItem("language", language || ""), [language]);
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
    setShowWelcomeToast(false);
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
            Estás aquí para ayudar con temas como: espiritualidad, inteligencia emocional, salud mental, valores, desarrollo humano, crecimiento personal, motivación, fe y relaciones humanas.
            Si el usuario plantea algo fuera de ese enfoque (por ejemplo, temas técnicos, políticos o ajenos al crecimiento interior), responde con amabilidad, agradeciendo su mensaje y explicándole que puen está centrado en el bienestar emocional, la fe y la profundidad humana.
            Si el usuario plantea algo relacionado con suicidio, pensamientos suicidas o autolesiones, oriéntalo a buscar atención profesional especializada lo antes posible.
            Si el usuario plantea algo relacionado con prostitución, pornografía infantil o adulta, trata de personas u otras formas de explotación, responde con firmeza que puen no es el espacio para hablar de eso.
            Si el usuario menciona maltrato físico a personas o animales, oriéntalo a buscar atención profesional en las instancias correspondientes lo antes posible.
            Tu tono debe ser siempre cercano, respetuoso, cálido y claro. Prioriza lo humano y lo interior por encima de lo informativo o externo.
            Todas tus respuestas deben ser concretas, para fomentar la participación del usuario. Al final de cada respuesta, incluye una invitación natural y variada para continuar la conversación.
`,
            },
            
            ...messages.map((m) => ({ role: m.sender === "user" ? "user" : "assistant", content: m.text })),
            { role: "user", content: userMessage.text },
          ],
        }),
      });

      const data = await response.json();
      const content = data?.choices?.[0]?.message?.content?.trim();
      if (content) {
        const reply = content;
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
       {showWelcomeToast && (
  <div
  className={`fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-[#c45c2d] text-white py-3 px-6 rounded-full shadow-lg transition-all duration-500 ease-in-out ${
    showWelcomeToast ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'
  }`}
>
  {t.bienvenidaToast}
    </div>
  )}
  <img src="/puen-logo.png" className="w-24 h-24 rounded-xl" loading="lazy" />
        <h1 className="text-xl font-bold text-[#c45c2d]">{t.gracias}</h1>
        <p className="text-sm text-gray-700 max-w-md">{t.mensajeGracias}</p>
        <button
          onClick={() => setShowReturningMessage(false)}
          className="bg-[#c45c2d] hover:bg-[#a64a24] text-white px-4 py-2 rounded"
        >
          {t.regresar}
        </button>
      </div>
    );
  }
  

  if (showIntro) {
    return (
        <div className="min-h-screen bg-[#fdf2e7] flex flex-col items-center justify-center p-4 space-y-4 text-center transform transition-all duration-300 ease-out scale-100 opacity-100">
        <img src="/puen-logo.png" className="w-28 h-28 rounded-2xl mb-6" loading="lazy" />
        {!language ? (
          <>
        
        {!language ? (
          <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => {
              setLanguage("es");
              setShowVideoIntro(true);
              setTimeout(() => {
                setShowStartButton(true);
              }, 3000); // aparece el botón después de 3 segundos
            }}
            className="bg-[#c45c2d] hover:bg-[#a64a24] text-white px-4 py-2 rounded"
          >
            Español
          </button>
          <button
            onClick={() => {
              setLanguage("en");
              setShowVideoIntro(true);
              setTimeout(() => {
                setShowStartButton(true);
              }, 3000);
            }}
            className="bg-[#c45c2d] hover:bg-[#a64a24] text-white px-4 py-2 rounded"
          >
            English
          </button>
          <button
            onClick={() => {
              setLanguage("pt");
              setShowVideoIntro(true);
              setTimeout(() => {
                setShowStartButton(true);
              }, 3000);
            }}
            className="bg-[#c45c2d] hover:bg-[#a64a24] text-white px-4 py-2 rounded"
          >
            Português
          </button>
          <button
            onClick={() => {
              setLanguage("fr");
              setShowVideoIntro(true);
              setTimeout(() => {
                setShowStartButton(true);
              }, 3000);
            }}
            className="bg-[#c45c2d] hover:bg-[#a64a24] text-white px-4 py-2 rounded"
          >
            Français
          </button>
        </div>
        

) : null}


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
      <div className="relative flex flex-col items-center justify-center">
  <img src="/puen-logo.png" className="w-20 h-20 rounded-xl" alt="puen-logo.png" loading="lazy"/>

  <div className="flex flex-col space-y-2 absolute right-0 top-1">
    {/* Botón de voz */}
    <button
      onClick={() => setVoiceEnabled(!voiceEnabled)}
      className="bg-[#c45c2d] hover:bg-[#a64a24] text-white px-2 py-1 rounded text-sm transition-colors duration-300 ease-out"
      >
      {t.voz}: {voiceEnabled ? "🔊" : "🔇"}
    </button>

    {/* Nuevo botón de idioma */}
    <button
  onClick={() => {
    localStorage.removeItem("language");
    setLanguage(null);
    setShowIntro(true);
  }}
  className="bg-[#c45c2d] hover:bg-[#a64a24] text-white px-2 py-1 rounded text-sm transition-colors duration-300 ease-out"
>
  🌎 {t.idioma}
</button>

  </div>
</div>

{agradecimientoActivo && (
  <div className="fixed inset-0 bg-[#fdf2e7] flex flex-col items-center justify-center text-center p-6 z-50">
    <div className="max-w-sm bg-white rounded-xl shadow-xl p-6 space-y-4">
      <h2 className="text-xl font-semibold text-[#c45c2d]">{t.gracias}</h2>
      <p className="text-sm text-gray-600">{t.mensajeApoyoCorto}</p>
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
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 modal-fade-in">
    <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-xl text-center space-y-4 transform transition-all duration-300 ease-out scale-100 opacity-100">
      <h2 className="text-lg font-semibold text-[#c45c2d]">{t.apoya}</h2>
      <p className="text-sm text-gray-600">{t.mensajeApoyoCorto}</p>

      <div className="space-y-2">
        {/* Botones de donación */}
        <a href="https://buy.stripe.com/bIYeVy8g43kW1wY9AB" target="_blank" title="Stripe USD" className="block bg-[#6772e5] hover:bg-[#5469d4] text-white py-2 rounded font-medium">💵 Stripe USD</a>
        <a href="https://buy.stripe.com/7sIbJm53SbRsfnOdQT" target="_blank" title="Stripe EUR" className="block bg-[#5469d4] hover:bg-[#4355b4] text-white py-2 rounded font-medium">💶 Stripe EUR</a>
        <a href="https://www.paypal.com/paypalme/puenapp" target="_blank" title="PayPal" className="block bg-[#ffc439] hover:bg-[#e0b02f] text-black py-2 rounded font-medium">PayPal 🅿️</a>
        <a href="https://buymeacoffee.com/puenapp" target="_blank" title="BuyMeACoffee" className="block bg-[#ff813f] hover:bg-[#e46d30] text-white py-2 rounded font-medium">BuyMeACoffee ☕</a>
        <a href="https://link.mercadopago.com.mx/puenapp" target="_blank" title="MercadoPago" className="block bg-[#009ee3] hover:bg-[#0080b3] text-white py-2 rounded font-medium">MercadoPago 💳</a>
      </div>

      <button onClick={() => setShowDonateModal(false)} className="mt-4 text-sm text-gray-500 underline">
        {t.cerrar}
      </button>
    </div>
  </div>

)}
{showPrivacyModal && (
  <div className={`fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 ${fadeInPrivacy ? 'modal-fade-in' : ''}`}>
    <div className={`bg-white rounded-xl p-6 max-w-lg w-full text-center space-y-4 transform transition-all duration-300 ease-out ${
      fadeOutPrivacy ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
    }`}>
      <h2 className="text-xl font-semibold text-[#c45c2d]">📜 {t.tituloAvisoPrivacidad}</h2>
      <p className="text-sm text-gray-700 text-justify">
        {t.avisoPrivacidad}
      </p>
      <button
        onClick={() => {
          setFadeOutPrivacy(true);
          setTimeout(() => {
            setShowPrivacyModal(false);
            setFadeOutPrivacy(false);
          }, 300);
        }}
        className="mt-4 text-sm text-gray-500 underline w-full"
      >
        {t.cerrar}
      </button>
    </div>
  </div>
)}




<button
  onClick={() => setShowDonateModal(true)}
  className="text-[#c45c2d] hover:text-[#a64a24] underline text-sm font-medium animate-fadeInDelay1"
>
  💛 {t.donar}
</button>

<button
  onClick={() => setShowVideoIntro(true)}
  className="text-[#c45c2d] hover:text-[#a64a24] underline text-sm font-medium animate-fadeInDelay2"
>
  ▶️ {t.verIntro}
</button>

<button
  onClick={() => setShowPrivacyModal(true)}
  className="text-[#c45c2d] hover:text-[#a64a24] underline text-sm font-medium animate-fadeInDelay3"
>
  📜 {t.tituloAvisoPrivacidad}
</button>






{showVideoIntro && (
  <div className={`fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 ${fadeOutVideo ? 'modal-fade-out' : 'modal-fade-in'}`}>
    <div className="bg-white rounded-2xl p-6 max-w-lg w-full space-y-4 transform transition-all duration-300 ease-out">
      
      <iframe
        className="w-full aspect-video rounded-xl"
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
        loading="lazy"
      ></iframe>

      <p className="text-sm text-gray-700 text-center">{t.descripcion}</p>

      {showStartButton && (
  <button
    onClick={() => {
      localStorage.setItem("videoSeen", "true");
      setFadeOutVideo(true);
      setTimeout(() => {
        setShowVideoIntro(false);
        setFadeOutVideo(false);
        setShowIntro(false);
      }, 500);
    }}
    className="bg-[#c45c2d] hover:bg-[#a64a24] text-white px-4 py-2 rounded w-full mt-2 transition-all duration-500 ease-in-out animate-fade-in"
  >
    {t.iniciar}
  </button>
)}

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
            placeholder={t.escribirAqui}
            className="flex-1 border border-gray-300 p-2 rounded"
            disabled={loading}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="bg-[#c45c2d] hover:bg-[#a64a24] text-white px-4 py-2 rounded disabled:opacity-50"
          >
          {t.enviar}
        </button>

        </div>

        <div className="text-center mt-4 animate-fadeInSlideUpDelay">
  <a
    href="https://forms.gle/ZJgfwYivTRRFFiG5A"
    target="_blank"
    rel="noopener noreferrer"
    className="inline-block bg-[#c45c2d] hover:bg-[#a64a24] text-white font-medium py-2 px-6 rounded-full transition-all duration-300 ease-out text-sm sm:text-base sm:px-8"
  >
    😇✨ Compártenos tu experiencia
  </a>
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
