// Membuat daftar 10 audio: /audio/01.mp3 ... /audio/10.mp3
// (file mp3-nya ditaruh di folder public/audio/)
export const audios = Array.from({ length: 10 }, (_, i) => {
  const n = String(i + 1).padStart(2, '0')
  return { id: i + 1, title: `Audio ${n}`, file: `/audio/${n}.mp3` }
})
