<template>
  <v-app>
    <v-app-bar color="primary" elevation="0" height="64">
      <v-btn icon="mdi-arrow-left" variant="text" color="white" size="large" @click="router.push('/')" aria-label="Volver al inicio" />
      <v-app-bar-title>
        <span class="barra-titulo">Mis fotos</span>
      </v-app-bar-title>
      <template #append>
        <v-btn
          variant="text"
          color="white"
          prepend-icon="mdi-image-plus"
          size="large"
          @click="triggerSubida"
          aria-label="Agregar foto"
        >
          Agregar
        </v-btn>
      </template>
    </v-app-bar>

    <v-main class="main-bg">
      <v-container class="py-4 px-3" style="max-width:480px">

        <!-- Input de archivo oculto -->
        <input
          ref="inputArchivo"
          type="file"
          accept="image/*"
          style="display:none"
          @change="procesarImagen"
        />

        <!-- Zona de subida (visible si no hay fotos) -->
        <v-card
          v-if="fotos.length === 0"
          elevation="0"
          border
          class="zona-subida pa-8 mb-4 text-center"
          @click="triggerSubida"
        >
          <v-icon size="56" color="#B4B2A9" class="mb-3">mdi-image-plus</v-icon>
          <p style="font-size:18px;font-weight:500;color:#2C2C2A;margin-bottom:6px">Agrega tu primera foto</p>
          <p style="font-size:15px;color:#5F5E5A">Toca aquí para elegir una imagen de tu computadora</p>
        </v-card>

        <!-- Galería de fotos -->
        <div v-else>
          <p class="seccion-titulo mb-3">Tus fotos ({{ fotos.length }})</p>

          <!-- Botón de subir siempre visible cuando hay fotos -->
          <v-btn
            color="primary"
            variant="outlined"
            size="large"
            block
            prepend-icon="mdi-image-plus"
            class="mb-4"
            @click="triggerSubida"
          >
            Agregar otra foto
          </v-btn>

          <div class="grilla-fotos">
            <div
              v-for="foto in fotos"
              :key="foto.id"
              class="foto-celda"
              @click="verFoto(foto)"
            >
              <img :src="foto.src" :alt="foto.nombre" class="foto-img" />
              <div class="foto-overlay">
                <v-icon color="white" size="20">mdi-magnify</v-icon>
              </div>
            </div>
          </div>
        </div>

        <!-- Alerta de carga -->
        <v-alert
          v-if="cargando"
          type="info"
          variant="tonal"
          class="mt-4"
        >
          Cargando imagen...
        </v-alert>

        <!-- Alerta de éxito -->
        <v-alert
          v-if="exitoVisible"
          type="success"
          variant="tonal"
          class="mt-4"
        >
          ✓ Foto agregada correctamente
        </v-alert>

        <!-- Alerta de error -->
        <v-alert
          v-if="errorArchivo"
          type="error"
          variant="tonal"
          class="mt-4"
        >
          Solo se pueden agregar imágenes (JPG, PNG, etc.)
        </v-alert>

      </v-container>
    </v-main>

    <!-- Lightbox: ver foto grande -->
    <v-dialog v-model="lightbox" max-width="520">
      <v-card v-if="fotoActual" class="pa-0 overflow-hidden" style="border-radius:16px">
        <img
          :src="fotoActual.src"
          :alt="fotoActual.nombre"
          style="width:100%;max-height:70vh;object-fit:contain;background:#1a1a1a"
        />
        <v-card-text class="pa-4">
          <p class="foto-nombre">{{ fotoActual.nombre }}</p>
          <p class="foto-fecha">{{ fotoActual.fecha }}</p>
        </v-card-text>
        <v-card-actions class="d-flex flex-column gap-2 pa-4 pt-0">
          <v-btn
            color="error"
            variant="outlined"
            size="large"
            block
            prepend-icon="mdi-delete"
            @click="confirmarBorrar = true"
          >
            Borrar esta foto
          </v-btn>
          <v-btn
            variant="outlined"
            size="large"
            block
            @click="lightbox = false"
          >
            Cerrar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialogo: confirmar borrar foto -->
    <v-dialog v-model="confirmarBorrar" max-width="360">
      <v-card class="pa-4">
        <v-card-title class="dialog-titulo">¿Borrar esta foto?</v-card-title>
        <v-card-text class="dialog-cuerpo">Esta acción no se puede deshacer.</v-card-text>
        <v-card-actions class="d-flex flex-column gap-2 pa-4 pt-0">
          <v-btn color="error" size="x-large" block prepend-icon="mdi-delete" @click="borrarFoto">Sí, borrar</v-btn>
          <v-btn variant="outlined" size="large" block @click="confirmarBorrar = false">Cancelar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-app>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router      = useRouter()
const inputArchivo = ref(null)

const fotos         = ref([])
const fotoActual    = ref(null)
const lightbox      = ref(false)
const confirmarBorrar = ref(false)
const cargando      = ref(false)
const exitoVisible  = ref(false)
const errorArchivo  = ref(false)

function triggerSubida() {
  errorArchivo.value  = false
  exitoVisible.value  = false
  inputArchivo.value.click()
}

function procesarImagen(evento) {
  const archivo = evento.target.files[0]
  if (!archivo) return

  // Valida que sea imagen
  if (!archivo.type.startsWith('image/')) {
    errorArchivo.value = true
    evento.target.value = ''
    return
  }

  cargando.value = true
  errorArchivo.value = false

  const reader = new FileReader()

  reader.onload = (e) => {
    fotos.value.unshift({
      id:     Date.now(),
      src:    e.target.result,
      nombre: archivo.name,
      fecha:  new Date().toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' }),
    })
    cargando.value     = false
    exitoVisible.value = true
    setTimeout(() => { exitoVisible.value = false }, 3000)
  }

  reader.onerror = () => {
    cargando.value     = false
    errorArchivo.value = true
  }

  reader.readAsDataURL(archivo)

  // Limpia el input para que se pueda subir el mismo archivo de nuevo
  evento.target.value = ''
}

function verFoto(foto) {
  fotoActual.value = foto
  lightbox.value   = true
}

function borrarFoto() {
  fotos.value       = fotos.value.filter(f => f.id !== fotoActual.value.id)
  confirmarBorrar.value = false
  lightbox.value    = false
  fotoActual.value  = null
}
</script>

<style scoped>
.main-bg       { background: #f8f8f6; }
.barra-titulo  { color: #E6F1FB; font-size: 18px; font-weight: 500; }
.seccion-titulo{ font-size: 20px; font-weight: 500; color: #2C2C2A; }
.zona-subida   { border-radius: 16px !important; cursor: pointer; border-style: dashed !important; }
.zona-subida:hover { background: #E6F1FB !important; }

.grilla-fotos  {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.foto-celda    {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  aspect-ratio: 1 / 1;
  background: #e0e0e0;
}

.foto-img      { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.2s; }
.foto-celda:hover .foto-img { transform: scale(1.04); }

.foto-overlay  {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s;
}
.foto-celda:hover .foto-overlay { opacity: 1; }

.foto-nombre   { font-size: 15px; font-weight: 500; color: #2C2C2A; word-break: break-all; }
.foto-fecha    { font-size: 13px; color: #5F5E5A; margin-top: 2px; }
.dialog-titulo { font-size: 20px; font-weight: 500; color: #2C2C2A; }
.dialog-cuerpo { font-size: 16px; color: #5F5E5A; }
</style>