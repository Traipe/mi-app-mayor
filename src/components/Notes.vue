<template>
  <v-app>
    <v-app-bar color="primary" elevation="0" height="64">
      <v-btn icon="mdi-arrow-left" variant="text" color="white" size="large" @click="router.push('/')" aria-label="Volver al inicio" />
      <v-app-bar-title>
        <span class="barra-titulo">Mis notas</span>
      </v-app-bar-title>
      <template #append>
        <v-btn icon="mdi-plus" variant="text" color="white" size="large" aria-label="Nueva nota" @click="abrirNueva" />
      </template>
    </v-app-bar>

    <v-main class="main-bg">
      <v-container class="py-4 px-3" style="max-width:480px">

        <!-- Vista: lista de notas -->
        <div v-if="vista === 'lista'">
          <p class="seccion-titulo mb-3">Tus notas guardadas</p>

          <v-card
            v-for="nota in notas"
            :key="nota.id"
            class="nota-item mb-3"
            elevation="0"
            :style="`border-left: 5px solid ${nota.color} !important`"
            border
            @click="abrirNota(nota)"
          >
            <v-card-text class="pa-4">
              <div class="d-flex justify-space-between align-start">
                <p class="nota-titulo">{{ nota.titulo }}</p>
                <span class="nota-fecha">{{ nota.fecha }}</span>
              </div>
              <p class="nota-preview mt-1">{{ nota.cuerpo }}</p>
            </v-card-text>
          </v-card>

          <v-card
            v-if="notas.length === 0"
            elevation="0"
            border
            class="pa-6 text-center"
          >
            <v-icon size="48" color="#B4B2A9" class="mb-3">mdi-note-outline</v-icon>
            <p style="font-size:17px;color:#5F5E5A">Aún no tienes notas.<br>Toca el <strong>+</strong> arriba para crear una.</p>
          </v-card>
        </div>

        <!-- Vista: leer nota -->
        <div v-else-if="vista === 'leer'">
          <div class="d-flex gap-2 mb-4">
            <v-btn variant="outlined" color="primary" prepend-icon="mdi-arrow-left" size="large" @click="vista = 'lista'">Volver</v-btn>
            <v-spacer />
            <v-btn variant="outlined" color="warning" prepend-icon="mdi-pencil" size="large" @click="editarNota">Editar</v-btn>
            <v-btn variant="outlined" color="error"   prepend-icon="mdi-delete"  size="large" @click="confirmarBorrar = true">Borrar</v-btn>
          </div>
          <v-card elevation="0" border class="pa-5" :style="`border-left: 5px solid ${notaActual.color} !important`">
            <p class="nota-titulo-grande mb-1">{{ notaActual.titulo }}</p>
            <p class="nota-fecha mb-4">{{ notaActual.fecha }}</p>
            <p class="nota-cuerpo">{{ notaActual.cuerpo }}</p>
          </v-card>
        </div>

        <!-- Vista: nueva / editar nota -->
        <div v-else-if="vista === 'editar'">
          <div class="d-flex gap-2 mb-4">
            <v-btn variant="outlined" color="primary" prepend-icon="mdi-arrow-left" size="large" @click="cancelarEdicion">Cancelar</v-btn>
          </div>
          <v-card elevation="0" border class="pa-4">
            <p class="campo-label mb-2">Título de la nota:</p>
            <v-text-field
              v-model="form.titulo"
              variant="outlined"
              placeholder="Ej: Lista del supermercado"
              hide-details
              class="mb-4 campo-texto"
            />
            <p class="campo-label mb-2">Contenido:</p>
            <v-textarea
              v-model="form.cuerpo"
              variant="outlined"
              rows="6"
              placeholder="Escribe tu nota aquí..."
              hide-details
              class="mb-4 campo-texto"
            />
            <p class="campo-label mb-2">Color de la nota:</p>
            <div class="d-flex gap-3 mb-5">
              <div
                v-for="c in colores"
                :key="c"
                class="color-circulo"
                :style="`background:${c}; outline: ${form.color === c ? '3px solid #2C2C2A' : 'none'}`"
                @click="form.color = c"
              />
            </div>
            <v-btn
              color="primary"
              size="x-large"
              block
              prepend-icon="mdi-content-save"
              :disabled="!form.titulo.trim()"
              @click="guardarNota"
            >
              Guardar nota
            </v-btn>
          </v-card>
        </div>

      </v-container>
    </v-main>

    <!-- Dialogo: confirmar borrar -->
    <v-dialog v-model="confirmarBorrar" max-width="360">
      <v-card class="pa-4">
        <v-card-title class="dialog-titulo">¿Borrar esta nota?</v-card-title>
        <v-card-text class="dialog-cuerpo">Esta acción no se puede deshacer.</v-card-text>
        <v-card-actions class="d-flex flex-column gap-2 pa-4 pt-0">
          <v-btn color="error" size="x-large" block prepend-icon="mdi-delete" @click="borrarNota">Sí, borrar</v-btn>
          <v-btn variant="outlined" size="large" block @click="confirmarBorrar = false">Cancelar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-app>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const colores = ['#185FA5', '#3B6D11', '#854F0B', '#534AB7', '#B04A2F']

const notas = ref([
  { id: 1, titulo: 'Lista del supermercado', cuerpo: 'Leche, pan, huevos, manzanas, queso, yogur, jabón de manos.', fecha: 'Hoy', color: '#3B6D11' },
  { id: 2, titulo: 'Teléfonos importantes', cuerpo: 'Doctor Ramírez: 555-1234\nFarmacia: 555-5678\nEmergencias: 131', fecha: 'Lunes', color: '#185FA5' },
])

const vista          = ref('lista')
const notaActual     = ref(null)
const confirmarBorrar = ref(false)
const form = ref({ titulo: '', cuerpo: '', color: '#185FA5' })
let editandoId = null

function abrirNota(nota) {
  notaActual.value = nota
  vista.value = 'leer'
}

function abrirNueva() {
  editandoId = null
  form.value = { titulo: '', cuerpo: '', color: '#185FA5' }
  vista.value = 'editar'
}

function editarNota() {
  editandoId = notaActual.value.id
  form.value = { titulo: notaActual.value.titulo, cuerpo: notaActual.value.cuerpo, color: notaActual.value.color }
  vista.value = 'editar'
}

function cancelarEdicion() {
  vista.value = editandoId ? 'leer' : 'lista'
}

function guardarNota() {
  if (editandoId) {
    const idx = notas.value.findIndex(n => n.id === editandoId)
    notas.value[idx] = { ...notas.value[idx], ...form.value, fecha: 'Hoy' }
    notaActual.value = notas.value[idx]
    vista.value = 'leer'
  } else {
    const nueva = { id: Date.now(), ...form.value, fecha: 'Hoy' }
    notas.value.unshift(nueva)
    vista.value = 'lista'
  }
}

function borrarNota() {
  notas.value = notas.value.filter(n => n.id !== notaActual.value.id)
  confirmarBorrar.value = false
  vista.value = 'lista'
}
</script>

<style scoped>
.main-bg         { background: #f8f8f6; }
.barra-titulo    { color: #E6F1FB; font-size: 18px; font-weight: 500; }
.seccion-titulo  { font-size: 20px; font-weight: 500; color: #2C2C2A; }
.nota-item       { border-radius: 12px !important; cursor: pointer; }
.nota-item:hover { background: #F1EFE8 !important; }
.nota-titulo     { font-size: 16px; font-weight: 500; color: #2C2C2A; }
.nota-titulo-grande { font-size: 22px; font-weight: 500; color: #2C2C2A; }
.nota-fecha      { font-size: 13px; color: #888780; }
.nota-preview    { font-size: 14px; color: #5F5E5A; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.nota-cuerpo     { font-size: 17px; color: #2C2C2A; line-height: 1.7; white-space: pre-line; }
.campo-label     { font-size: 15px; font-weight: 500; color: #2C2C2A; }
.campo-texto     { font-size: 16px !important; }
.dialog-titulo   { font-size: 20px; font-weight: 500; color: #2C2C2A; }
.dialog-cuerpo   { font-size: 16px; color: #5F5E5A; }
.color-circulo   { width: 36px; height: 36px; border-radius: 50%; cursor: pointer; transition: transform 0.1s; }
.color-circulo:hover { transform: scale(1.15); }
</style>