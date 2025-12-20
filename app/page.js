"use client";
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  // AKIŞ HARİTASI:
  // 1. MÜHENDİS: kintsugi->intro->mum -> muh -> atakm -> priz -> halis -> tv...
  // 2. EV KIZI:   kintsugi->intro->mum -> evkizi -> atakb -> halis -> manti -> tv...
  
  const [stage, setStage] = useState('kintsugi'); 
  const [userProfile, setUserProfile] = useState({ role: "" });
  const [storyText, setStoryText] = useState("");
  const [audioAllowed, setAudioAllowed] = useState(false);

  const videoRef = useRef(null);

  // --- 1. DOSYA EŞLEŞTİRME ---
  const getVideoFile = () => {
    switch(stage) {
        case 'kintsugi': return "/videos/kintsugi.mp4";
        case 'intro': return "/videos/giris.mp4";
        case 'childhood': return "/videos/mum.mp4";
        
        // MÜHENDİS ZİNCİRİ
        case 'muh': return "/videos/muh.mp4";
        case 'atakm': return "/videos/atakm.mp4";
        case 'priz': return "/videos/priz.mp4";

        // EV KIZI ZİNCİRİ
        case 'evkizi': return "/videos/evkizi.mp4";
        case 'atakb': return "/videos/atakb.mp4";
        case 'manti': return "/videos/manti.mp4";

        // ORTAK / ÇOKLU KULLANIM
        case 'halis': return "/videos/halis.mp4"; // İki rolde de var
        case 'tv': return "/videos/tv.mp4";
        case 'el': return "/videos/el.mp4";
        case 'tvel': return "/videos/tvel.mp4";
        case 'anneel': return "/videos/anneel.mp4";
        case 'uzuntu': return "/videos/uzuntu.mp4";
        case 'theend': return "/videos/theend.mp4";
        
        default: return "/videos/kintsugi.mp4";
    }
  };

  // --- 2. SAHNE YÖNETİCİSİ ---
  useEffect(() => {
    if (!audioAllowed) return; 

    const fetchStory = async () => {
        try {
            const res = await fetch('/api/story', {
                method: 'POST',
                body: JSON.stringify({ stage, userProfile })
            });
            const data = await res.json();
            setStoryText(data.text);
        } catch(e) { console.log("Hata"); }
    };
    fetchStory();

    if(videoRef.current) {
        videoRef.current.load();
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) playPromise.catch(() => {});
    }
  }, [stage, audioAllowed]);

  // --- 3. OTOMATİK GEÇİŞ (ZİNCİR MANTIĞI) ---
  const handleVideoEnd = () => {
    // Giriş
    if (stage === 'kintsugi') setStage('intro');
    else if (stage === 'intro') setStage('childhood');
    else if (stage === 'childhood') videoRef.current.play(); // Seçim bekle

    // --- MÜHENDİS YOLU ---
    else if (stage === 'muh') setStage('atakm');
    else if (stage === 'atakm') setStage('priz');
    else if (stage === 'priz') setStage('halis');

    // --- EV KIZI YOLU ---
    else if (stage === 'evkizi') setStage('atakb');
    else if (stage === 'atakb') setStage('halis'); // Burada halis'e gidiyor

    // --- KRİTİK KAVŞAK (HALİS) ---
    else if (stage === 'halis') {
        if (userProfile.role === 'Ev Kızı') {
            setStage('manti'); // Ev kızıysa Mantı'ya git
        } else {
            setStage('tv'); // Mühendisse direkt TV'ye git
        }
    }
    
    // --- EV KIZI EKSTRA (MANTI) ---
    else if (stage === 'manti') setStage('tv'); // Mantıdan sonra TV'ye bağlan

    // --- ORTAK TÜNEL ---
    else if (stage === 'tv') setStage('el');
    else if (stage === 'el') setStage('tvel');
    else if (stage === 'tvel') setStage('anneel');
    else if (stage === 'anneel') setStage('uzuntu');
    else if (stage === 'uzuntu') setStage('theend');
    
    // --- FİNAL ---
    else if (stage === 'theend') videoRef.current.pause();
  };

  // --- 4. ETKİLEŞİMLER ---
  const enterSimulation = () => {
    setAudioAllowed(true);
    if (videoRef.current) {
        videoRef.current.muted = false;
        videoRef.current.play();
    }
  };

  const makeChoice = (role) => {
    setUserProfile({ role });
    // İLK VİDEOYU BAŞLAT
    if (role === 'Mühendis') setStage('muh');
    else setStage('evkizi');
  };

  // --- STİL ---
  const css = `
    .main-stage { position: relative; height: 100vh; width: 100vw; background: black; overflow: hidden; font-family: 'Courier New', monospace; }
    .video-layer { position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 0; }
    .video-layer video { width: 100%; height: 100%; object-fit: cover; }
    .content-layer {
        position: absolute; bottom: 0; width: 100%; min-height: 30%;
        background: linear-gradient(to top, black 90%, transparent);
        z-index: 10; display: flex; flex-direction: column; align-items: center; justify-content: center;
        padding: 20px; text-align: center; pointer-events: none;
    }
    .story-text { color: #fff; font-size: 1.2rem; margin-bottom: 20px; max-width: 800px; text-shadow: 0 2px 10px black; }
    .btn {
        pointer-events: auto; padding: 15px 30px; background: transparent; border: 1px solid rgba(255,255,255,0.8);
        color: white; font-size: 1rem; cursor: pointer; transition: all 0.3s; font-family: inherit; letter-spacing: 2px; margin: 0 10px;
    }
    .btn:hover { background: white; color: black; transform: scale(1.05); }
    .start-screen {
        position: absolute; top: 0; left: 0; width: 100%; height: 100%;
        background: black; z-index: 100; display: flex; flex-direction: column;
        align-items: center; justify-content: center; color: white;
    }
    .glitch { font-size: 2rem; margin-bottom: 20px; animation: glitch 1s infinite; }
    @keyframes glitch { 0% {transform: translate(0)} 20% {transform: translate(-2px, 2px)} 40% {transform: translate(-2px, -2px)} 60% {transform: translate(2px, 2px)} 80% {transform: translate(2px, -2px)} 100% {transform: translate(0)} }
  `;

  return (
    <div className="main-stage">
      <style dangerouslySetInnerHTML={{ __html: css }} />
      
      {!audioAllowed && (
        <div className="start-screen">
            <h1 className="glitch">MASSALVERSE</h1>
            <button className="btn" onClick={enterSimulation}>SİMÜLASYONU BAŞLAT</button>
        </div>
      )}

      <div className="video-layer">
        <video 
            ref={videoRef} 
            playsInline 
            onEnded={handleVideoEnd}
            muted={!audioAllowed}
        >
            <source src={getVideoFile()} type="video/mp4" />
        </video>
      </div>

      {audioAllowed && (
        <div className="content-layer">
            <AnimatePresence mode="wait">
                <motion.h2 
                    key={storyText} 
                    initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
                    className="story-text"
                >
                    {storyText}
                </motion.h2>
            </AnimatePresence>

            {stage === 'childhood' && (
                <div>
                    <button className="btn" onClick={() => makeChoice('Mühendis')}>İLİMLE KORU</button>
                    <button className="btn" onClick={() => makeChoice('Ev Kızı')}>HİKMETLE YÜCELT</button>
                </div>
            )}
            
            {stage === 'theend' && (
                <button className="btn" onClick={() => window.location.reload()}>BAŞA DÖN</button>
            )}
        </div>
      )}
    </div>
  );
}