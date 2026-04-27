<template>
  <v-app>
    <!-- Barra superior -->
    <v-app-bar color="primary" elevation="0" height="64">
      <v-app-bar-title>
        <span class="app-title">Mi Asistente</span>
      </v-app-bar-title>
      <template #append>
        <span class="app-time">{{ horaActual }}</span>
      </template>
    </v-app-bar>

    <!-- Contenido principal -->
    <v-main class="main-bg">
      <v-container class="py-6 px-4" style="max-width: 480px;">

        <!-- Saludo -->
        <p class="saludo">Buen día, {{ nombre }}</p>
        <p class="fecha-hoy">{{ fechaActual }}</p>

        <!-- Notificación de mensajes nuevos -->
        <v-alert
          v-if="mensajesNuevos > 0"
          type="success"
          variant="tonal"
          class="mb-5 alerta-mensajes"
          :icon="false"
        >
          <div class="d-flex align-center gap-2">
            <v-icon color="success" size="20">mdi-check-circle</v-icon>
            <span class="alerta-texto">
              Tienes {{ mensajesNuevos }} mensaje{{ mensajesNuevos > 1 ? 's' : '' }} nuevo{{ mensajesNuevos > 1 ? 's' : '' }} de tu familia
            </span>
          </div>
        </v-alert>

        <!-- Cuadrícula de botones principales -->
        <v-row dense class="mb-3">

          <!-- Ver mensajes -->
          <v-col cols="6">
            <v-card
              class="boton-principal"
              color="white"
              elevation="0"
              border
              @click="irA('/mensajes')"
              :ripple="true"
            >
              <v-card-text class="d-flex flex-column align-center pa-5">
                <div class="icono-wrap icono-azul mb-3">
                  <v-icon size="28" color="#185FA5">mdi-email-outline</v-icon>
                </div>
                <span class="boton-label">Ver mensajes</span>
                <v-badge
                  v-if="mensajesNuevos > 0"
                  :content="mensajesNuevos"
                  color="success"
                  class="mt-2"
                  inline
                />
              </v-card-text>
            </v-card>
          </v-col>

          <!-- Ver fotos -->
          <v-col cols="6">
            <v-card
              class="boton-principal"
              color="white"
              elevation="0"
              border
              @click="irA('/fotos')"
            >
              <v-card-text class="d-flex flex-column align-center pa-5">
                <div class="icono-wrap icono-verde mb-3">
                  <v-icon size="28" color="#3B6D11">mdi-image-outline</v-icon>
                </div>
                <span class="boton-label">Ver fotos</span>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- Mis notas -->
          <v-col cols="6">
            <v-card
              class="boton-principal"
              color="white"
              elevation="0"
              border
              @click="irA('/notas')"
            >
              <v-card-text class="d-flex flex-column align-center pa-5">
                <div class="icono-wrap icono-ambar mb-3">
                  <v-icon size="28" color="#854F0B">mdi-note-text-outline</v-icon>
                </div>
                <span class="boton-label">Mis notas</span>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- Calendario -->
          <v-col cols="6">
            <v-card
              class="boton-principal"
              color="white"
              elevation="0"
              border
              @click="irA('/calendario')"
            >
              <v-card-text class="d-flex flex-column align-center pa-5">
                <div class="icono-wrap icono-morado mb-3">
                  <v-icon size="28" color="#534AB7">mdi-calendar-outline</v-icon>
                </div>
                <span class="boton-label">Calendario</span>
              </v-card-text>
            </v-card>
          </v-col>

        </v-row>

        <!-- Botón de ayuda -->
        <v-card
          class="boton-ayuda"
          color="white"
          elevation="0"
          border
          @click="irA('/ayuda')"
        >
          <v-card-text class="d-flex align-center pa-4 gap-4">
            <v-avatar
              color="#F1EFE8"
              size="48"
            >
              <v-icon color="#5F5E5A" size="24">mdi-help-circle-outline</v-icon>
            </v-avatar>
            <div>
              <p class="ayuda-titulo">Necesito ayuda</p>
              <p class="ayuda-sub">Te explicamos paso a paso</p>
            </div>
            <v-spacer />
            <v-icon color="#B4B2A9">mdi-chevron-right</v-icon>
          </v-card-text>
        </v-card>

      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

// ── Datos del usuario ──────────────────────────────────────────
// En una app real estos vendrían de un store (Pinia) o props
const nombre = ref('Usuario(a)')
const mensajesNuevos = ref(2)

// ── Navegación ─────────────────────────────────────────────────
const router = useRouter()

function irA(ruta) {
  router.push(ruta)
}

// ── Hora en tiempo real ────────────────────────────────────────
const horaActual = ref('')
const fechaActual = ref('')
let intervalReloj = null

function actualizarReloj() {
  const ahora = new Date()

  // Hora: "10:30 am"
  horaActual.value = ahora.toLocaleTimeString('es-CL', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })

  // Fecha: "Martes 21 de abril, 2026"
  fechaActual.value = ahora.toLocaleDateString('es-CL', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

onMounted(() => {
  actualizarReloj()
  intervalReloj = setInterval(actualizarReloj, 30_000) // actualiza cada 30 seg
})

onUnmounted(() => {
  clearInterval(intervalReloj)
})
</script>

<style scoped>
/* ── Fondo principal ── */
.main-bg {
  background-color: #f8f8f6;
}

/* ── Barra superior ── */
.app-title {
  font-size: 18px;
  font-weight: 500;
  color: #E6F1FB;
}

.app-time {
  font-size: 14px;
  color: #B5D4F4;
  padding-right: 16px;
}

/* ── Saludo ── */
.saludo {
  font-size: 22px;
  font-weight: 500;
  color: #2C2C2A;
  margin-bottom: 4px;
  line-height: 1.3;
}

.fecha-hoy {
  font-size: 15px;
  color: #5F5E5A;
  margin-bottom: 20px;
  /* Capitaliza solo la primera letra (la fecha viene en minúsculas del locale) */
  text-transform: capitalize;
}

/* ── Alerta de mensajes ── */
.alerta-mensajes {
  border-radius: 12px !important;
}

.alerta-texto {
  font-size: 15px;
  font-weight: 500;
}

/* ── Botones principales ── */
.boton-principal {
  border-radius: 14px !important;
  cursor: pointer;
  transition: background-color 0.15s ease;
  min-height: 130px;
  border-color: #B5D4F4 !important;
}

.boton-principal:hover {
  background-color: #E6F1FB !important;
}

.boton-principal:active {
  transform: scale(0.97);
}

.boton-label {
  font-size: 16px;
  font-weight: 500;
  color: #2C2C2A;
  text-align: center;
  line-height: 1.3;
}

/* ── Íconos con fondo de color ── */
.icono-wrap {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icono-azul   { background-color: #E6F1FB; }
.icono-verde  { background-color: #EAF3DE; }
.icono-ambar  { background-color: #FAEEDA; }
.icono-morado { background-color: #EEEDFE; }

/* ── Botón de ayuda ── */
.boton-ayuda {
  border-radius: 14px !important;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.boton-ayuda:hover {
  background-color: #F1EFE8 !important;
}

.ayuda-titulo {
  font-size: 16px;
  font-weight: 500;
  color: #2C2C2A;
  margin: 0;
}

.ayuda-sub {
  font-size: 14px;
  color: #5F5E5A;
  margin: 2px 0 0;
}
</style>