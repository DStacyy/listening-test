# Panduan TOEIC Listening Lab (Vue 3) dari nol

Projek ini sudah jalan. Tugasmu: menjalankannya, mengisi materi, lalu **membaca kodenya per file** untuk belajar Vue. Setiap file kecil dan diberi komentar.

---

## 1. Persiapan

Cek Node.js dulu di terminal:

```bash
node -v
```

Butuh **Node 20.19 ke atas** (atau 22 ke atas). Kalau lebih lama, update dulu dari nodejs.org. Docker **tidak diperlukan** untuk projek ini.

## 2. Menjalankan projek

```bash
cd toeic-listening
npm install        # sekali saja, mengunduh library
npm run dev        # menjalankan server pengembangan
```

Buka alamat yang muncul di terminal (biasanya `http://localhost:5173`). Simpan file apa pun di editor, dan browser otomatis ter-update (namanya *hot reload*).

Hentikan server dengan `Ctrl + C`.

## 3. Mengisi materi

**Audio.** Salin 10 file mp3 ke `public/audio/` dan ganti namanya jadi `01.mp3`, `02.mp3`, sampai `10.mp3`. Urutannya ikuti nomor dari gurumu.

**Soal.** Buka `src/data/soal/audio-01.json`. Isinya sekarang soal **contoh**, jadi ganti dengan 10 soal dari PDF:

```json
{
  "audioId": 1,
  "questions": [
    {
      "id": 1,
      "text": "Teks pertanyaan",
      "options": ["isi opsi A", "isi opsi B", "isi opsi C", "isi opsi D"],
      "answer": "B"
    }
  ]
}
```

- Huruf A, B, C, D dibuat otomatis dari urutan `options`, jadi jangan tulis "A." di depan opsi.
- `answer` adalah huruf jawaban benar.
- Tiap soal perlu `id` yang unik di dalam file itu (1, 2, 3, ...).
- Hati-hati koma: koma setelah item terakhir akan membuat JSON error.

**Audio 2 sampai 10 yang belum punya soal.** Tidak perlu diapa-apakan. Audio tanpa file soal otomatis tampil dalam mode catatan. Begitu kamu (atau gurumu) punya soalnya, buat file `audio-02.json` dengan `"audioId": 2`, dan app langsung mengenalinya. Tidak ada kode yang diubah.

## 4. Peta projek

```
toeic-listening/
├─ index.html              pintu masuk HTML (hanya <div id="app">)
├─ vite.config.js          konfigurasi Vite (pasang plugin Vue)
├─ public/audio/           file mp3 (diakses lewat /audio/01.mp3)
└─ src/
   ├─ main.js              menyalakan aplikasi
   ├─ App.vue              kerangka: header + tempat halaman
   ├─ style.css            semua tampilan
   ├─ router/index.js      daftar halaman (URL -> komponen)
   ├─ stores/progress.js   penyimpanan skor, catatan, kosakata
   ├─ data/
   │  ├─ audios.js         daftar 10 audio
   │  ├─ questions.js      memuat semua file soal otomatis
   │  └─ soal/audio-01.json
   ├─ views/               komponen satu halaman penuh
   │  ├─ HomeView.vue      daftar audio
   │  └─ PracticeView.vue  player + soal + catatan
   └─ components/          komponen kecil yang dipakai ulang
      ├─ AudioPlayer.vue
      ├─ QuestionCard.vue
      └─ NotesPanel.vue
```

Beda `views` dan `components` hanya soal kebiasaan: *view* adalah satu halaman penuh, *component* adalah potongan yang dipakai di dalam halaman.

## 5. Belajar Vue lewat kode ini

Urutan baca yang kusarankan, dari paling gampang. Buka filenya sambil baca bagian di bawah.

### Langkah 1: `src/main.js`

```js
createApp(App).use(createPinia()).use(router).mount('#app')
```

Artinya: buat aplikasi dari komponen `App`, pasang Pinia (penyimpanan data) dan Router (halaman), lalu tempelkan ke `<div id="app">` di `index.html`. Ini cuma ditulis sekali.

### Langkah 2: `src/App.vue`

Sebuah file `.vue` (disebut *Single File Component*) punya hingga tiga bagian:

```vue
<script setup> ... </script>   <!-- logika JavaScript -->
<template> ... </template>     <!-- tampilan HTML -->
<style> ... </style>           <!-- CSS (opsional) -->
```

Di sini hanya ada `<template>`. `<RouterLink>` adalah pengganti `<a>` yang pindah halaman tanpa memuat ulang. `<RouterView>` adalah tempat halaman yang cocok dengan URL ditampilkan.

### Langkah 3: `src/views/HomeView.vue`

Konsep baru:
- **`v-for`**: mengulang elemen untuk tiap item array. Wajib pakai `:key` yang unik.
- **`{{ ... }}`**: menampilkan nilai JavaScript di HTML.
- **`:to="..."`** (titik dua di depan): mengisi atribut dengan nilai JavaScript, bukan teks biasa.
- **`import`**: mengambil data dari file lain.

Coba ubah `'Belum dikerjakan'` jadi teks lain, simpan, lalu lihat browser berubah.

### Langkah 4: `src/components/AudioPlayer.vue`

Konsep baru:
- **`defineProps({ src: String })`**: komponen menerima data dari induknya. Di `PracticeView`, `<AudioPlayer :src="audio.file" />` mengirim alamat file.
- **`ref(0)`**: membuat data **reaktif**. Kalau nilainya berubah, tampilan ikut berubah. Di `<script>` nilainya diakses dengan `.value`, di `<template>` langsung tanpa `.value`.
- **Template ref**: `ref="audioEl"` di tag `<audio>` menghubungkan elemen itu ke variabel `audioEl`, jadi kamu bisa memanggil `audioEl.value.currentTime`.
- **`@click`**: menjalankan fungsi saat diklik.
- **`:class="{ active: speed === s }"`**: class `active` dipasang hanya jika kondisinya benar.
- **`watch`**: menjalankan kode setiap kali sebuah `ref` berubah.

### Langkah 5: `src/components/QuestionCard.vue`

Konsep baru:
- **`defineEmits(['select'])`** dan **`emit('select', huruf)`**: arah kebalikan props. Komponen anak memberi tahu induknya bahwa ada kejadian. Aturan ingatnya: *data turun lewat props, kejadian naik lewat emit*.
- Dari induk, kejadian ini ditangkap dengan `@select="..."`.

### Langkah 6: `src/stores/progress.js` (Pinia)

Masalah: skor harus diingat walau pindah halaman, dan tidak hilang saat browser ditutup. Solusinya store:
- `entries` adalah `ref` yang diisi dari `localStorage` saat app dibuka.
- `watch(entries, ..., { deep: true })` menyimpan ulang ke `localStorage` setiap ada perubahan sekecil apa pun di dalamnya.
- Komponen mana pun bisa memanggil `useProgressStore()` dan mendapat data yang sama.

### Langkah 7: `src/components/NotesPanel.vue`

Konsep baru: **`v-model`**. Ini mengikat dua arah antara input dan data: `<textarea v-model="entry.notes">` berarti apa yang diketik langsung masuk ke `entry.notes`, dan kalau `entry.notes` berubah dari kode, isi kotaknya ikut berubah. Ini yang bikin Vue terasa ringkas.

`@keyup.enter="addWord"` berarti jalankan `addWord` saat tombol Enter dilepas.

### Langkah 8: `src/views/PracticeView.vue`

Ini file paling lengkap. Konsep baru:
- **`useRoute()`** membaca bagian dinamis URL (`/audio/3` jadi `route.params.id = "3"`, perhatikan ini teks, makanya dibungkus `Number()`).
- **`computed`**: nilai yang dihitung dari data lain dan otomatis ter-update, misalnya `answeredCount`.
- **`v-if` / `v-else`**: tampilkan satu dari dua blok. Dipakai untuk membedakan audio yang punya soal dan yang belum.
- **`<template v-if>`**: pembungkus tak terlihat untuk mengelompokkan beberapa elemen sekaligus.

## 6. Contekan sintaks

| Ingin | Tulis |
|---|---|
| Tampilkan nilai | `{{ nama }}` |
| Isi atribut dengan JS | `:src="audio.file"` |
| Event klik | `@click="fungsi"` |
| Ulang elemen | `v-for="item in daftar" :key="item.id"` |
| Tampil bersyarat | `v-if="kondisi"` / `v-else` |
| Input dua arah | `v-model="data"` |
| Data reaktif | `const x = ref(0)` (akses `x.value` di script) |
| Nilai turunan | `const y = computed(() => x.value * 2)` |
| Terima data | `defineProps({ nama: String })` |
| Kirim kejadian | `defineEmits(['nama'])` lalu `emit('nama', data)` |
| Pantau perubahan | `watch(x, (baru) => { ... })` |

## 7. Latihan bertahap (pelajaran sambil menambah fitur)

Kerjakan berurutan, masing-masing sekitar 20-40 menit:

1. **Ganti judul.** Ubah `title` di `src/data/audios.js` jadi nama yang kamu mau (hanya ubah data).
2. **Progres total.** Di `HomeView`, tampilkan "3 dari 10 audio sudah dikerjakan" memakai `computed`.
3. **Tombol hapus progres** per audio di `PracticeView` (petunjuk: `retry()` sudah ada, tinggal tambah `notes` dan `vocab`).
4. **Mode ujian.** Tambah checkbox yang, kalau dicentang, menyembunyikan tombol mundur/maju dan kecepatan di `AudioPlayer` (petunjuk: `ref` boolean + `v-if`). Ini mirip kondisi tes asli, audio diputar sekali jalan.
5. **Flashcard kosakata.** Buat halaman baru `/kosakata` yang mengumpulkan semua kata dari semua audio. Kamu akan berlatih menambah route di `router/index.js`.
6. **Dark mode** lewat variabel CSS di `style.css`.

## 8. Kalau ada masalah

| Gejala | Penyebab / solusi |
|---|---|
| Audio tidak bunyi | Cek file ada di `public/audio/` dan namanya `01.mp3` (bukan `1.mp3`). Buka `http://localhost:5173/audio/01.mp3` langsung. |
| Layar putih | Buka DevTools (F12) lalu tab Console, baca pesan merahnya. Biasanya JSON salah koma. |
| Soal tidak muncul | Cek `audioId` di JSON sama dengan nomor audio, dan nama file di folder `soal/` berakhiran `.json`. |
| Ingin reset semua skor | DevTools, tab Application, Local Storage, hapus `toeic-progress-v1`. |
| `npm run dev` error versi | Update Node (lihat langkah 1). |

## 9. Saran pemakaian (penting)

Tesnya tinggal sekitar 2 minggu. Anggap ngoding ini sebagai selingan, bukan pengganti belajar. Target realistis:

- **Hari 1-2:** jalankan, isi materi, coba kerjakan audio 1, baca kode langkah 1-4.
- **Hari 3-5:** baca sisa kode, kerjakan latihan 1-3.
- **Hari 6-14:** pakai app untuk latihan listening setiap hari. Fitur tambahan hanya kalau masih ada waktu.
