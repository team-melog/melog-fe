import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const audioUrl = searchParams.get('url');

    if (!audioUrl) {
      return NextResponse.json(
        { error: 'Audio URL is required' },
        { status: 400 }
      );
    }

    console.log('오디오 프록시 요청:', audioUrl);

    // 외부 오디오 파일 가져오기
    const response = await fetch(audioUrl);

    if (!response.ok) {
      console.error('오디오 파일 가져오기 실패:', response.status);
      return NextResponse.json(
        { error: 'Failed to fetch audio file' },
        { status: response.status }
      );
    }

    // 오디오 파일 스트림
    const audioBuffer = await response.arrayBuffer();

    // CORS 헤더 설정
    const headers = new Headers();
    headers.set(
      'Content-Type',
      response.headers.get('Content-Type') || 'audio/wav'
    );
    headers.set('Content-Length', audioBuffer.byteLength.toString());
    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    headers.set('Access-Control-Allow-Headers', 'Content-Type');

    console.log('오디오 프록시 성공:', audioBuffer.byteLength, 'bytes');

    return new NextResponse(audioBuffer, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error('오디오 프록시 에러:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  // CORS preflight 요청 처리
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
