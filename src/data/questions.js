// Membaca SEMUA file .json di folder soal/ secara otomatis.
// Tambah file baru (mis. audio-02.json) -> langsung terbaca, tanpa ubah kode.
const files = import.meta.glob('./soal/*.json', { eager: true })

export const questionsByAudio = {}
for (const mod of Object.values(files)) {
  const data = mod.default
  questionsByAudio[data.audioId] = data.questions
}
