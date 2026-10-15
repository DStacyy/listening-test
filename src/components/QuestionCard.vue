<script setup>
const props = defineProps({
  question: Object,
  index: Number,
  selected: String, // huruf yang dipilih: 'A' | 'B' | ...
  revealed: Boolean, // true setelah klik "Cek jawaban"
})
const emit = defineEmits(['select'])

const letter = (i) => String.fromCharCode(65 + i) // 0 -> A, 1 -> B, ...

function state(i) {
  if (!props.revealed) return ''
  if (letter(i) === props.question.answer) return 'correct'
  if (letter(i) === props.selected) return 'wrong'
  return ''
}
</script>

<template>
  <fieldset class="question">
    <legend>{{ index + 1 }}. {{ question.text }}</legend>
    <label
      v-for="(opt, i) in question.options"
      :key="i"
      class="option"
      :class="state(i)"
    >
      <input
        type="radio"
        :name="`q${question.id}`"
        :checked="selected === letter(i)"
        :disabled="revealed"
        @change="emit('select', letter(i))"
      />
      <b>{{ letter(i) }}</b> {{ opt }}
    </label>
  </fieldset>
</template>
