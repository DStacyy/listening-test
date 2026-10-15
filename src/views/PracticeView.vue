<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { audios } from '../data/audios'
import { questionsByAudio } from '../data/questions'
import { useProgressStore } from '../stores/progress'
import AudioPlayer from '../components/AudioPlayer.vue'
import QuestionCard from '../components/QuestionCard.vue'
import NotesPanel from '../components/NotesPanel.vue'

const route = useRoute()
const id = Number(route.params.id)
const audio = audios.find((a) => a.id === id)
const questions = questionsByAudio[id] ?? []
const entry = audio ? useProgressStore().entry(id) : null

const revealed = computed(() => entry.score !== null)
const answeredCount = computed(() => Object.keys(entry.answers).length)

function select(questionId, letter) {
  entry.answers[questionId] = letter
}

function submit() {
  entry.score = questions.filter((q) => entry.answers[q.id] === q.answer).length
}

function retry() {
  entry.answers = {}
  entry.score = null
}
</script>

<template>
  <RouterLink to="/" class="back">Kembali ke daftar</RouterLink>

  <section v-if="audio">
    <h1>{{ audio.title }}</h1>
    <AudioPlayer :src="audio.file" />

    <template v-if="questions.length">
      <QuestionCard
        v-for="(q, i) in questions"
        :key="q.id"
        :question="q"
        :index="i"
        :selected="entry.answers[q.id]"
        :revealed="revealed"
        @select="(letter) => select(q.id, letter)"
      />

      <div v-if="!revealed" class="actions">
        <button class="primary" :disabled="answeredCount < questions.length" @click="submit">
          Cek jawaban
        </button>
        <span class="muted">{{ answeredCount }} dari {{ questions.length }} terjawab</span>
      </div>
      <div v-else class="actions result">
        <strong>Skor: {{ entry.score }} dari {{ questions.length }}</strong>
        <button @click="retry">Ulangi soal</button>
      </div>
    </template>
    <p v-else class="banner">
      Audio ini belum punya soal. Dengarkan lalu catat apa yang kamu tangkap di bawah.
      Soal bisa ditambahkan nanti lewat file <code>src/data/soal/audio-{{ String(id).padStart(2, '0') }}.json</code>.
    </p>

    <NotesPanel :id="id" />
  </section>
  <p v-else>Audio tidak ditemukan.</p>
</template>
