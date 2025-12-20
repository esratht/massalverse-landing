"use client";
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const [stage, setStage] = useState('kintsugi'); 
  const [userProfile, setUserProfile] = useState({ role: "" });
  const [storyText, setStoryText] = useState("");
  const [audioAllowed, setAudioAllowed] = useState(false);

  const videoRef = useRef(null);

  // --- 1. DOSYA EŞLEŞTİRME (HEPSİ ARTIK .webm) ---
  const getVideoFile = () => {
    switch(stage) {
        case 'kintsugi': return "/videos/kintsugi.webm";
        case 'intro': return "/videos/giris.webm";
        case 'childhood': return "/videos/mum.webm";
        
        // MÜHENDİS YOLU
        case 'attack_muh': return "/videos/muh.webm";
        case 'socket': return "/videos/priz.webm";
        
        // EV KIZI YOLU
        case 'attack_bilge': return "/videos/evkizi.webm";
        case 'kitchen': return "/videos/manti.webm";
        
        // ORTAK TÜNEL
        case 'halis': return "/videos/halis.webm";
        case 'tv': return "/videos/tv.webm";
        case 'el': return "/videos/el.webm";
        case 'tvel': return "/videos/tvel.webm";
        case 'anneel': return "/videos/anneel.webm";
        case 'uzuntu': return "/videos/uzuntu.webm";
        case 'theend': return "/videos/theend.webm";
        
        default: return "/videos/kintsugi.webm";
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

  // --- 3. ZİNCİRLEME GEÇİŞ ---
  const handleVideoEnd = () => {
    if (stage === 'kintsugi') setStage('intro');
    else if (stage === 'intro') setStage('childhood');
    else if (stage === 'childhood') videoRef.current.play(); 

    else if (stage === 'muh') setStage('atakm'); // Mühendis Başlangıç
    else if (stage === 'atakm') setStage('priz');
    else if (stage === 'priz') setStage('halis');

    else if (stage === 'evkizi') setStage('atakb'); // Ev Kızı Başlangıç
    else if (stage === 'atakb') setStage('halis'); 

    else if (stage === 'halis') {
        if (userProfile.role === 'Ev Kızı') setStage('manti');
        else setStage('tv');
    }
    else if (stage === 'manti') setStage('tv');

    else if (stage === 'tv') setStage('el');
    else if (stage === 'el') setStage('tvel');
    else if (stage === 'tvel') setStage('anneel');
    else if (stage === 'anneel') setStage('uzuntu');
    else if (stage === 'uzuntu') setStage('theend');
    
    else if (stage === 'theend') videoRef.current.pause();
  };

  const enterSimulation = () => {
    setAudioAllowed(true);
    if (videoRef.current) {
        videoRef.current.muted = false;
        videoRef.current.play();
    }
  };

  const makeChoice = (role) => {
    setUserProfile({ role });
    if (role === 'Mühendis') setStage('muh'); // .webm olacak
    else setStage('evkizi'); // .webm olacak
  };

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
            <source src={getVideoFile()} type="video/webm" />
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
