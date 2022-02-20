'use strict';

window.App.vue = new window.Vue({
  el: '#app',
  data: function () {
    return {
      // titulo: 'Datos carnet de discapacidad y bono Eustaquio Moto Méndez',
      titulo: 'Datos bono Eustaquio Moto Méndez',
      // descripcion: 'Datos carnet de discapacidad y bono Eustaquio Moto Méndez',
      descripcion: 'Datos bono Eustaquio Moto Méndez',
      datos: null,
      error: window.error || null
    };
  },
  created: function () {
    if (!this.error) {
      this.datos = window.datos;
    }
  },
  methods: {
    capitalize: function (text) {
      return window.App.text.capitalize(text);
    },
    buscar: function () {
      var url = '?t=' + window.token;
      window.location = url;
    }
  }
});
