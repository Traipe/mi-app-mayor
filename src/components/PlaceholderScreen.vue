<template>
  <v-app>
    <v-app-bar color="primary" elevation="0" height="64">
      <v-btn
        icon="mdi-arrow-left"
        variant="text"
        color="white"
        size="large"
        @click="router.push('/')"
        aria-label="Volver al inicio"
      />
      <v-app-bar-title>
        <span style="color:#E6F1FB; font-size:18px; font-weight:500">
          {{ nombrePantalla }}
        </span>
      </v-app-bar-title>
    </v-app-bar>

    <v-main style="background:#f8f8f6">
      <v-container
        class="d-flex flex-column align-center justify-center"
        style="min-height: 70vh; max-width: 480px;"
      >
        <v-icon size="64" color="#B4B2A9" class="mb-4">mdi-hammer-wrench</v-icon>
        <p style="font-size:20px; font-weight:500; color:#2C2C2A; text-align:center; margin-bottom:8px">
          Esta sección está en construcción
        </p>
        <p style="font-size:16px; color:#5F5E5A; text-align:center; margin-bottom:32px">
          Pronto estará lista. Por ahora puedes volver al inicio.
        </p>
        <v-btn
          color="primary"
          size="x-large"
          prepend-icon="mdi-home"
          @click="router.push('/')"
        >
          Volver al inicio
        </v-btn>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route  = useRoute()

// Capitaliza el nombre de la ruta para mostrarlo como título
const nombrePantalla = computed(() => {
  const nombre = route.name ?? 'Pantalla'
  return nombre.charAt(0).toUpperCase() + nombre.slice(1)
})
</script>
