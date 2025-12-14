import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    // OpenAI TTS API kullanımı (opsiyonel)
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

    if (!OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'TTS API key bulunamadı' },
        { status: 400 }
      );
    }

    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'tts-1',
        input: text,
        voice: 'nova', // alloy, echo, fable, onyx, nova, shimmer
        response_format: 'mp3'
      })
    });

    if (!response.ok) {
      throw new Error('TTS API hatası');
    }

    const audioBuffer = await response.arrayBuffer();
    
    return new NextResponse(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.byteLength.toString()
      }
    });

  } catch (error) {
    console.error('TTS Error:', error);
    return NextResponse.json(
      { error: 'Ses oluşturulamadı' },
      { status: 500 }
    );
  }
}
