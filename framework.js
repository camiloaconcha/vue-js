class CamiloReactive {
  constructor(options) {
    this.origen = options.data();

    //Destino
    this.$data = new Proxy(this.origen, {
      get(target, name) {
        if (name in target) {
          return target[name];
        }
        console.warn('la propiedad', name, 'no existe');
        return target[name];
      },
    });
  }
  mount() {
    document.querySelectorAll("*[c-text]").forEach((el) => {
      this.cText(el, this.$data, el.getAttribute("c-text"));
    });
  }
  cText(el, target, name) {
    el.innerText = target[name];
  }
  cModel() {}
}

var Camilo = {
  createApp(options) {
    return new CamiloReactive(options);
  },
};
