<template>
  <header class="top">
    <RouterLink to="/" class="brand">TOEIC Listening Lab</RouterLink>
  </header>
  <main>
    <!-- key = URL, supaya halaman dibuat ulang saat pindah dari audio 1 ke audio 2 -->
    <RouterView :key="$route.fullPath" />
  </main>
</template>
