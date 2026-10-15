<script setup>
import { ref } from 'vue'
import { useProgressStore } from '../stores/progress'

const props = defineProps({ id: Number })
const entry = useProgressStore().entry(props.id)

const word = ref('')
const meaning = ref('')

function addWord() {
  if (!word.value.trim()) return
  entry.vocab.push({ word: word.value.trim(), meaning: meaning.value.trim() })
  word.value = ''
  meaning.value = ''
}

function removeWord(index) {
  entry.vocab.splice(index, 1)
}
</script>

<template>
  <section class="notes">
    <h2>Catatan</h2>
    <textarea
      v-model="entry.notes"
      rows="6"
      placeholder="Tulis apa yang kamu dengar, ide utama, atau jawabanmu sendiri."
    ></textarea>

    <h2>Kosakata baru</h2>
    <div class="vocab-form">
      <input v-model="word" placeholder="Kata (English)" @keyup.enter="addWord" />
      <input v-model="meaning" placeholder="Arti" @keyup.enter="addWord" />
      <button @click="addWord">Tambah kata</button>
    </div>
    <ul class="vocab">
      <li v-for="(v, i) in entry.vocab" :key="i">
        <b>{{ v.word }}</b> <span>{{ v.meaning }}</span>
        <button class="link" @click="removeWord(i)">Hapus</button>
      </li>
    </ul>
    <p v-if="!entry.vocab.length" class="muted">Belum ada kata. Tambahkan kata yang belum kamu paham.</p>
  </section>
</template>
