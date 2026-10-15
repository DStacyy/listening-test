<script setup>
import { ref, watch } from 'vue'

defineProps({ src: String })

const audioEl = ref(null) // terhubung ke <audio ref="audioEl">
const speed = ref(1)
const speeds = [0.75, 1, 1.25]

function skip(seconds) {
  audioEl.value.currentTime = Math.max(0, audioEl.value.currentTime + seconds)
}

// kalau speed berubah, terapkan ke elemen audio
watch(speed, (v) => {
  audioEl.value.playbackRate = v
})
</script>

<template>
  <div class="player">
    <audio ref="audioEl" :src="src" controls preload="metadata"></audio>
    <div class="player-row">
      <button @click="skip(-5)">Mundur 5 detik</button>
      <button @click="skip(5)">Maju 5 detik</button>
      <span class="spacer"></span>
      <button
        v-for="s in speeds"
        :key="s"
        :class="{ active: speed === s }"
        @click="speed = s"
      >
        {{ s }}x
      </button>
    </div>
  </div>
</template>
