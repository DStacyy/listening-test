<script setup>
import { audios } from '../data/audios'
import { questionsByAudio } from '../data/questions'
import { useProgressStore } from '../stores/progress'

const store = useProgressStore()

function status(audio) {
  const total = questionsByAudio[audio.id]?.length ?? 0
  if (!total) return 'Belum ada soal, mode catatan'
  const score = store.entries[audio.id]?.score
  return score === null || score === undefined ? 'Belum dikerjakan' : `Skor ${score} dari ${total}`
}
</script>

<template>
  <h1>10 audio latihan</h1>
  <p class="lead">Pilih satu audio, dengarkan, lalu jawab soalnya.</p>
  <ol class="tracklist">
    <li v-for="audio in audios" :key="audio.id">
      <RouterLink :to="`/audio/${audio.id}`">
        <span class="num">{{ audio.id }}</span>
        <span class="name">{{ audio.title }}</span>
        <span class="status">{{ status(audio) }}</span>
      </RouterLink>
    </li>
  </ol>
</template>
