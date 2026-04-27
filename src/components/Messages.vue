<template>
  <v-app>
    <!-- Barra superior -->
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
        <span class="barra-titulo">Mensajes</span>
      </v-app-bar-title>
      <template #append>
        <v-btn
          icon="mdi-pencil-outline"
          variant="text"
          color="white"
          size="large"
          aria-label="Escribir nuevo mensaje"
          @click="nuevoMensaje = true"
        />
      </template>
    </v-app-bar>

    <v-main class="main-bg">
      <v-container class="py-4 px-3" style="max-width:480px">

        <!-- Lista de mensajes -->
        <div v-if="!mensajeAbierto">
          <p class="seccion-titulo mb-3">Tus mensajes</p>

          <v-card
            v-for="msg in mensajes"
            :key="msg.id"
            class="mensaje-item mb-3"
            elevation="0"
            border
            @click="abrirMensaje(msg)"
          >
            <v-card-text class="d-flex align-center pa-4 gap-3">
              <v-avatar :color="msg.color" size="52">
                <span class="avatar-inicial">{{ msg.de[0] }}</span>
              </v-avatar>
              <div style="flex:1; min-width:0">
                <div class="d-flex align-center justify-space-between">
                  <span class="msg-nombre">{{ msg.de }}</span>
                  <span class="msg-fecha">{{ msg.fecha }}</span>
                </div>
                <p class="msg-preview mt-1">{{ msg.preview }}</p>
              </div>
              <v-badge
                v-if="!msg.leido"
                dot
                color="success"
                inline
              />
            </v-card-text>
          </v-card>
        </div>

        <!-- Mensaje abierto -->
        <div v-else>
          <div class="d-flex align-center gap-3 mb-4">
            <v-btn
              variant="outlined"
              color="primary"
              prepend-icon="mdi-arrow-left"
              size="large"
              @click="mensajeAbierto = null"
            >
              Volver
            </v-btn>
          </div>

          <v-card elevation="0" border class="pa-5 mb-4">
            <div class="d-flex align-center gap-3 mb-4">
              <v-avatar :color="mensajeAbierto.color" size="52">
                <span class="avatar-inicial">{{ mensajeAbierto.de[0] }}</span>
              </v-avatar>
              <div>
                <p class="msg-nombre">{{ mensajeAbierto.de }}</p>
                <p class="msg-fecha">{{ mensajeAbierto.fecha }}</p>
              </div>
            </div>
            <p class="msg-cuerpo">{{ mensajeAbierto.cuerpo }}</p>
          </v-card>

          <!-- Responder -->
          <v-card elevation="0" border class="pa-4">
            <p class="campo-label mb-2">Responder a {{ mensajeAbierto.de }}:</p>
            <v-textarea
              v-model="respuesta"
              variant="outlined"
              rows="3"
              placeholder="Escribe tu respuesta aquí..."
              hide-details
              class="mb-3 campo-texto"
            />
            <v-btn
              color="primary"
              size="x-large"
              block
              prepend-icon="mdi-send"
              :disabled="!respuesta.trim()"
              @click="enviarRespuesta"
            >
              Enviar respuesta
            </v-btn>
          </v-card>
        </div>

      </v-container>
    </v-main>

    <!-- Dialogo: nuevo mensaje -->
    <v-dialog v-model="nuevoMensaje" max-width="440">
      <v-card class="pa-2">
        <v-card-title class="dialog-titulo pa-4">Nuevo mensaje</v-card-title>
        <v-card-text class="pa-4">
          <p class="campo-label mb-2">Para:</p>
          <v-select
            v-model="destinatario"
            :items="contactos"
            variant="outlined"
            hide-details
            class="mb-4 campo-texto"
          />
          <p class="campo-label mb-2">Mensaje:</p>
          <v-textarea
            v-model="textoNuevo"
            variant="outlined"
            rows="4"
            placeholder="Escribe tu mensaje aquí..."
            hide-details
            class="campo-texto"
          />
        </v-card-text>
        <v-card-actions class="pa-4 pt-0 d-flex flex-column gap-2">
          <v-btn
            color="primary"
            size="x-large"
            block
            prepend-icon="mdi-send"
            :disabled="!destinatario || !textoNuevo.trim()"
            @click="enviarNuevo"
          >
            Enviar mensaje
          </v-btn>
          <v-btn
            variant="outlined"
            size="large"
            block
            @click="nuevoMensaje = false"
          >
            Cancelar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialogo: confirmación enviado -->
    <v-dialog v-model="enviado" max-width="360">
      <v-card class="pa-4 text-center">
        <v-icon color="success" size="56" class="mb-3">mdi-check-circle</v-icon>
        <v-card-title class="dialog-titulo">¡Mensaje enviado!</v-card-title>
        <v-card-text class="dialog-cuerpo">
          Tu mensaje llegará pronto a {{ destinatarioEnviado }}.
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" size="x-large" block @click="enviado = false">
            Entendido
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-app>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const mensajes = ref([
  { id: 1, de: 'Monita (hija)', color: '#185FA5', fecha: 'Hoy, 9:15 am',  preview: 'Mamá, ¿cómo amaneciste hoy?', cuerpo: 'Mamá, ¿cómo amaneciste hoy? Ayer vi que hacía frío así que espero que hayas dormido bien. Te llamo más tarde en la tarde. Besos.', leido: false },
  { id: 2, de: 'Feña (hijo)',  color: '#3B6D11', fecha: 'Ayer',          preview: 'Te mandé las fotos del cumpleaños...', cuerpo: 'Te mandé las fotos del cumpleaños de los niños a tu galería de fotos. Están lindas, mira la del pastel que quedó chistosa. El fin de semana vamos a visitarte. Un abrazo.', leido: false },
  { id: 3, de: 'Sofíta (nieta)', color: '#854F0B', fecha: 'Lunes',         preview: 'Abuela te quiero mucho 💛', cuerpo: 'Abuela, solo quería escribirte para decirte que te quiero muchísimo y que el dibujo que me regalaste lo tengo colgado en mi cuarto. Nos vemos pronto.', leido: true },
])

const contactos = ['María (hija)', 'Feña (hijo)', 'Sofía (nieta)']

const mensajeAbierto    = ref(null)
const respuesta         = ref('')
const nuevoMensaje      = ref(false)
const textoNuevo        = ref('')
const destinatario      = ref('')
const enviado           = ref(false)
const destinatarioEnviado = ref('')

function abrirMensaje(msg) {
  msg.leido = true
  mensajeAbierto.value = msg
  respuesta.value = ''
}

function enviarRespuesta() {
  destinatarioEnviado.value = mensajeAbierto.value.de
  respuesta.value = ''
  mensajeAbierto.value = null
  enviado.value = true
}

function enviarNuevo() {
  destinatarioEnviado.value = destinatario.value
  nuevoMensaje.value = false
  textoNuevo.value = ''
  destinatario.value = ''
  enviado.value = true
}
</script>

<style scoped>
.main-bg       { background: #f8f8f6; }
.barra-titulo  { color: #E6F1FB; font-size: 18px; font-weight: 500; }
.seccion-titulo{ font-size: 20px; font-weight: 500; color: #2C2C2A; }
.mensaje-item  { border-radius: 14px !important; cursor: pointer; }
.mensaje-item:hover { background: #E6F1FB !important; }
.avatar-inicial{ font-size: 20px; font-weight: 600; color: white; }
.msg-nombre    { font-size: 16px; font-weight: 500; color: #2C2C2A; }
.msg-fecha     { font-size: 13px; color: #888780; }
.msg-preview   { font-size: 14px; color: #5F5E5A; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 220px; }
.msg-cuerpo    { font-size: 17px; color: #2C2C2A; line-height: 1.6; }
.campo-label   { font-size: 15px; font-weight: 500; color: #2C2C2A; }
.campo-texto   { font-size: 16px !important; }
.dialog-titulo { font-size: 20px; font-weight: 500; color: #2C2C2A; }
.dialog-cuerpo { font-size: 16px; color: #5F5E5A; }
</style>