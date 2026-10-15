import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

const KEY = 'toeic-progress-v1'

export const useProgressStore = defineStore('progress', () => {
  // state: { [audioId]: { answers, score, notes, vocab } }
  const entries = ref(JSON.parse(localStorage.getItem(KEY) || '{}'))

  // setiap data berubah -> simpan ke localStorage
  watch(entries, (v) => localStorage.setItem(KEY, JSON.stringify(v)), { deep: true })

  // ambil data satu audio; kalau belum ada, dibuatkan
  function entry(id) {
    if (!entries.value[id]) {
      entries.value[id] = { answers: {}, score: null, notes: '', vocab: [] }
    }
    return entries.value[id]
  }

  return { entries, entry }
})
