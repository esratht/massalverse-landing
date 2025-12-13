import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { text } = body; // Okunacak metin bu

    if (!text) {
      return NextResponse.json({ error: 'Metin yok!' }, { status: 400 });
    }

    // OpenAI TTS Motoru
    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: "nova", // Seçenekler: alloy, echo, fable, onyx, nova, shimmer
      input: text,
    });

    // Ses dosyasını "Buffer" (veri yığını) olarak alıyoruz
    const buffer = Buffer.from(await mp3.arrayBuffer());

    // Tarayıcıya "Bu bir ses dosyasıdır" diyerek yolluyoruz
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": buffer.length.toString(),
      },
    });

  } catch (error) {
    console.error('Ses Hatası:', error);
    return NextResponse.json({ error: 'Ses oluşturulamadı.' }, { status: 500 });
  }
}