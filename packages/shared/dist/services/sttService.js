// 기본 설정
const DEFAULT_CONFIG = {
    apiUrl: process.env.NEXT_PUBLIC_STT_URL || '/api/stt',
    apiKey: process.env.NEXT_PUBLIC_STT_API_KEY || '',
    language: 'ko-KR',
    maxRetries: 3,
};
// 오디오 블롭을 FormData로 변환
const createAudioFormData = (audioBlob, fileName = 'audio.webm') => {
    const formData = new FormData();
    formData.append('audio', audioBlob, fileName);
    formData.append('language', DEFAULT_CONFIG.language);
    return formData;
};
// STT API 호출 함수
export const convertSpeechToText = async (audioBlob, config = {}) => {
    const finalConfig = { ...DEFAULT_CONFIG, ...config };
    try {
        const formData = createAudioFormData(audioBlob);
        const response = await fetch(finalConfig.apiUrl, {
            method: 'POST',
            headers: {
                ...(finalConfig.apiKey && { 'Authorization': `Bearer ${finalConfig.apiKey}` }),
            },
            body: formData,
        });
        if (!response.ok) {
            throw new Error(`STT API 오류: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        return {
            success: true,
            text: data.text || data.transcript || '',
            confidence: data.confidence,
        };
    }
    catch (error) {
        console.error('STT 변환 오류:', error);
        return {
            success: false,
            text: '',
            error: error instanceof Error ? error.message : '음성 인식에 실패했습니다.',
        };
    }
};
// Web Speech API를 백업으로 사용하는 함수 (개발/테스트용)
export const convertSpeechToTextFallback = async (audioBlob) => {
    return new Promise((resolve) => {
        // Web Speech API 사용 (브라우저 지원 확인)
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            resolve({
                success: false,
                text: '',
                error: 'Web Speech API를 지원하지 않는 브라우저입니다.',
            });
            return;
        }
        try {
            // 개발 환경에서는 더미 데이터 반환
            if (process.env.NODE_ENV === 'development') {
                setTimeout(() => {
                    resolve({
                        success: true,
                        text: '테스트 음성 인식 결과입니다. 이것은 개발 환경에서의 더미 데이터입니다.',
                        confidence: 0.95,
                    });
                }, 1500); // 1.5초 지연으로 실제 API 호출 시뮬레이션
                return;
            }
            // 실제 환경에서는 오류 반환
            resolve({
                success: false,
                text: '',
                error: 'STT API 설정이 필요합니다.',
            });
        }
        catch (error) {
            resolve({
                success: false,
                text: '',
                error: 'Web Speech API 오류가 발생했습니다.',
            });
        }
    });
};
// 재시도 로직이 포함된 STT 함수
export const convertSpeechToTextWithRetry = async (audioBlob, config = {}) => {
    const finalConfig = { ...DEFAULT_CONFIG, ...config };
    let lastError = '';
    for (let attempt = 1; attempt <= finalConfig.maxRetries; attempt++) {
        try {
            const result = await convertSpeechToText(audioBlob, config);
            if (result.success) {
                return result;
            }
            lastError = result.error || '알 수 없는 오류';
            // 마지막 시도가 아니면 잠시 대기
            if (attempt < finalConfig.maxRetries) {
                await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
            }
        }
        catch (error) {
            lastError = error instanceof Error ? error.message : '네트워크 오류';
            // 마지막 시도가 아니면 잠시 대기
            if (attempt < finalConfig.maxRetries) {
                await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
            }
        }
    }
    // 모든 재시도 실패 시 fallback 시도
    console.warn('STT API 재시도 모두 실패, fallback 사용');
    return convertSpeechToTextFallback(audioBlob);
};
