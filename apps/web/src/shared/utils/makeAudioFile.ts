/**
 * 오디오 파일 생성
 * @param audioBlob - 오디오 데이터
 * @param nickname - 닉네임
 * @returns 오디오 파일
 */
const makeAudioFile = (audioBlob: Blob, nickname: string) => {
  const now = new Date();
  const year = now.getFullYear().toString();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const timestamp = now.getTime();

  // emotion_nickname_YYYYMMDD_timestamp.wav
  const filename = `emotion_${nickname}_${year}${month}${day}_${timestamp}.wav`;
  const audiofile = new File([audioBlob], filename, { type: 'audio/wav' });
  return audiofile;
};

export default makeAudioFile;
