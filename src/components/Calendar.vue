<template>
  <v-app>
    <v-app-bar color="primary" elevation="0" height="64">
      <v-btn icon="mdi-arrow-left" variant="text" color="white" size="large" @click="router.push('/')" aria-label="Volver al inicio" />
      <v-app-bar-title>
        <span class="barra-titulo">Calendario</span>
      </v-app-bar-title>
      <template #append>
        <v-btn icon="mdi-plus" variant="text" color="white" size="large" @click="nuevoRecordatorio = true" aria-label="Nuevo recordatorio" />
      </template>
    </v-app-bar>

    <v-main class="main-bg">
      <v-container class="py-4 px-3" style="max-width:480px">

        <!-- Navegador de mes -->
        <v-card elevation="0" border class="pa-4 mb-4" style="border-radius:14px">
          <div class="d-flex align-center justify-space-between mb-4">
            <v-btn icon="mdi-chevron-left" variant="text" size="large" @click="mesAnterior" aria-label="Mes anterior" />
            <span class="mes-titulo">{{ nombreMes }} {{ anio }}</span>
            <v-btn icon="mdi-chevron-right" variant="text" size="large" @click="mesSiguiente" aria-label="Mes siguiente" />
          </div>

          <!-- Días de la semana -->
          <div class="grilla-dias">
            <div v-for="d in diasSemana" :key="d" class="dia-header">{{ d }}</div>
          </div>

          <!-- Celdas del mes -->
          <div class="grilla-dias">
            <div v-for="(celda, i) in celdasMes" :key="i" class="celda-dia">
              <button
                v-if="celda"
                class="boton-dia"
                :class="{
                  'dia-hoy':       esHoy(celda),
                  'dia-seleccionado': diaSeleccionado === celda,
                  'dia-con-evento': tieneEvento(celda),
                }"
                @click="seleccionarDia(celda)"
                :aria-label="`${celda} de ${nombreMes}`"
              >
                {{ celda }}
                <span v-if="tieneEvento(celda)" class="punto-evento" />
              </button>
            </div>
          </div>
        </v-card>

        <!-- Eventos del día seleccionado -->
        <div v-if="diaSeleccionado">
          <p class="seccion-titulo mb-3">
            {{ diaSeleccionado }} de {{ nombreMes }}
          </p>

          <div v-if="eventosDia.length === 0">
            <v-card elevation="0" border class="pa-5 text-center" style="border-radius:12px">
              <v-icon size="36" color="#B4B2A9" class="mb-2">mdi-calendar-check</v-icon>
              <p style="font-size:16px;color:#5F5E5A">Sin recordatorios para este día.</p>
            </v-card>
          </div>

          <v-card
            v-for="ev in eventosDia"
            :key="ev.id"
            elevation="0"
            border
            class="evento-item mb-3 pa-4"
          >
            <div class="d-flex align-center gap-3">
              <v-avatar :color="ev.color" size="44" rounded="lg">
                <v-icon color="white" size="22">{{ ev.icono }}</v-icon>
              </v-avatar>
              <div style="flex:1">
                <p class="evento-titulo">{{ ev.titulo }}</p>
                <p class="evento-hora">{{ ev.hora }}</p>
              </div>
              <v-btn
                icon="mdi-delete-outline"
                variant="text"
                color="error"
                size="small"
                @click="confirmarBorrarEvento(ev)"
                aria-label="Borrar recordatorio"
              />
            </div>
          </v-card>
        </div>

        <div v-else>
          <p class="hint-texto">Toca un día para ver o agregar recordatorios.</p>
        </div>

      </v-container>
    </v-main>

    <!-- Dialogo: nuevo recordatorio -->
    <v-dialog v-model="nuevoRecordatorio" max-width="440">
      <v-card class="pa-2">
        <v-card-title class="dialog-titulo pa-4">Nuevo recordatorio</v-card-title>
        <v-card-text class="pa-4">
          <p class="campo-label mb-2">Descripción:</p>
          <v-text-field
            v-model="formEvento.titulo"
            variant="outlined"
            placeholder="Ej: Cita con el doctor"
            hide-details
            class="mb-4 campo-texto"
          />
          <p class="campo-label mb-2">Día del mes:</p>
          <v-text-field
            v-model.number="formEvento.dia"
            variant="outlined"
            type="number"
            :min="1"
            :max="31"
            hide-details
            class="mb-4 campo-texto"
          />
          <p class="campo-label mb-2">Hora (opcional):</p>
          <v-text-field
            v-model="formEvento.hora"
            variant="outlined"
            placeholder="Ej: 10:30 am"
            hide-details
            class="campo-texto"
          />
        </v-card-text>
        <v-card-actions class="d-flex flex-column gap-2 pa-4 pt-0">
          <v-btn
            color="primary"
            size="x-large"
            block
            prepend-icon="mdi-content-save"
            :disabled="!formEvento.titulo.trim() || !formEvento.dia"
            @click="guardarEvento"
          >
            Guardar recordatorio
          </v-btn>
          <v-btn variant="outlined" size="large" block @click="nuevoRecordatorio = false">Cancelar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialogo: confirmar borrar evento -->
    <v-dialog v-model="confirmarBorrar" max-width="360">
      <v-card class="pa-4">
        <v-card-title class="dialog-titulo">¿Borrar este recordatorio?</v-card-title>
        <v-card-actions class="d-flex flex-column gap-2 pa-4 pt-2">
          <v-btn color="error" size="x-large" block @click="borrarEvento">Sí, borrar</v-btn>
          <v-btn variant="outlined" size="large" block @click="confirmarBorrar = false">Cancelar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-app>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const hoy   = new Date()
const mes   = ref(hoy.getMonth())
const anio  = ref(hoy.getFullYear())

const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

const meses = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']
const nombreMes = computed(() => meses[mes.value])

// Genera las celdas del mes (con espacios vacíos al inicio)
const celdasMes = computed(() => {
  const primerDia = new Date(anio.value, mes.value, 1).getDay()
  const totalDias = new Date(anio.value, mes.value + 1, 0).getDate()
  const celdas = Array(primerDia).fill(null)
  for (let d = 1; d <= totalDias; d++) celdas.push(d)
  return celdas
})

function mesAnterior()  { if (mes.value === 0) { mes.value = 11; anio.value-- } else mes.value-- }
function mesSiguiente() { if (mes.value === 11) { mes.value = 0; anio.value++ } else mes.value++ }
function esHoy(dia) { return dia === hoy.getDate() && mes.value === hoy.getMonth() && anio.value === hoy.getFullYear() }

const diaSeleccionado = ref(hoy.getDate())

function seleccionarDia(dia) { diaSeleccionado.value = dia }

// Eventos de ejemplo
const eventos = ref([
  { id: 1, dia: hoy.getDate(), mes: hoy.getMonth(), anio: hoy.getFullYear(), titulo: 'Llamada con María', hora: '11:00 am', color: '#185FA5', icono: 'mdi-phone' },
  { id: 2, dia: hoy.getDate() + 2, mes: hoy.getMonth(), anio: hoy.getFullYear(), titulo: 'Cita médica', hora: '9:30 am', color: '#854F0B', icono: 'mdi-medical-bag' },
])

const eventosDia = computed(() =>
  eventos.value.filter(e => e.dia === diaSeleccionado.value && e.mes === mes.value && e.anio === anio.value)
)

function tieneEvento(dia) {
  return eventos.value.some(e => e.dia === dia && e.mes === mes.value && e.anio === anio.value)
}

const nuevoRecordatorio = ref(false)
const formEvento = ref({ titulo: '', dia: null, hora: '' })

function guardarEvento() {
  eventos.value.push({
    id: Date.now(),
    dia: formEvento.value.dia,
    mes: mes.value,
    anio: anio.value,
    titulo: formEvento.value.titulo,
    hora: formEvento.value.hora || 'Sin hora definida',
    color: '#534AB7',
    icono: 'mdi-bell',
  })
  diaSeleccionado.value = formEvento.value.dia
  formEvento.value = { titulo: '', dia: null, hora: '' }
  nuevoRecordatorio.value = false
}

const confirmarBorrar  = ref(false)
const eventoABorrar    = ref(null)

function confirmarBorrarEvento(ev) { eventoABorrar.value = ev; confirmarBorrar.value = true }
function borrarEvento() { eventos.value = eventos.value.filter(e => e.id !== eventoABorrar.value.id); confirmarBorrar.value = false }
</script>

<style scoped>
.main-bg        { background: #f8f8f6; }
.barra-titulo   { color: #E6F1FB; font-size: 18px; font-weight: 500; }
.mes-titulo     { font-size: 20px; font-weight: 500; color: #2C2C2A; }
.seccion-titulo { font-size: 20px; font-weight: 500; color: #2C2C2A; }
.hint-texto     { font-size: 15px; color: #888780; text-align: center; margin-top: 8px; }
.grilla-dias    { display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; }
.dia-header     { text-align: center; font-size: 13px; font-weight: 500; color: #888780; padding: 4px 0; }
.celda-dia      { display: flex; justify-content: center; }
.boton-dia      { position: relative; width: 40px; height: 40px; border-radius: 50%; border: none; background: transparent; font-size: 15px; color: #2C2C2A; cursor: pointer; display: flex; align-items: center; justify-content: center; flex-direction: column; gap: 2px; }
.boton-dia:hover     { background: #E6F1FB; }
.dia-hoy             { background: #E6F1FB !important; font-weight: 700; color: #185FA5 !important; }
.dia-seleccionado    { background: #185FA5 !important; color: white !important; font-weight: 700; }
.dia-con-evento .punto-evento { width: 5px; height: 5px; border-radius: 50%; background: #854F0B; }
.dia-seleccionado .punto-evento { background: white; }
.evento-item    { border-radius: 12px !important; }
.evento-titulo  { font-size: 16px; font-weight: 500; color: #2C2C2A; }
.evento-hora    { font-size: 14px; color: #5F5E5A; }
.campo-label    { font-size: 15px; font-weight: 500; color: #2C2C2A; }
.campo-texto    { font-size: 16px !important; }
.dialog-titulo  { font-size: 20px; font-weight: 500; color: #2C2C2A; }
</style>