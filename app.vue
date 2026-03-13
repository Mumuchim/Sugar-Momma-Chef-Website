<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <ToastContainer />
</template>

<script setup lang="ts">
const { init } = useColorMode()

// Initialize theme on client mount (reads localStorage preference)
onMounted(() => init())

// Prevent flash of wrong theme: inline script runs before first render
useHead({
  script: [
    {
      // Runs synchronously before page paint — applies saved theme class
      innerHTML: `(function(){try{var m=localStorage.getItem('sm-theme');if(m==='light')document.documentElement.classList.add('light');}catch(e){}})();`,
      tagPosition: 'head',
    },
  ],
})
</script>
