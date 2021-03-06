class CamiloReactive {
  //Depedencias
  deps = new Map();

  constructor({data}) {
    this.origen = data();

    const self = this;

    //Destino
    this.$data = new Proxy(this.origen, {
      get(target, name) {
        if (Reflect.has(target, name)) {
          self.track(target, name);
          return Reflect.get(target, name);
        }
        console.warn("la propiedad", name, "no existe");
        return "";
      },
      set(target, name, value) {
        Reflect.set(target, name, value);
        self.trigger(name);
      },
    });
  }

  track(target, name) {
    if (!this.deps.has(name)) {
      const effect = () => {
        document.querySelectorAll(`*[c-text=${name}]`).forEach(el => {
          this.cText(el, target, name);
        });
      };
      this.deps.set(name, effect);
    }
  }
  trigger(name) {
    const effect = this.deps.get(name);
    effect();
  }

  mount() {
    document.querySelectorAll("*[c-text]").forEach(el => {
      this.cText(el, this.$data, el.getAttribute("c-text"));
    });

    document.querySelectorAll("*[c-model]").forEach(el => {
      const name = el.getAttribute("c-model");
      this.cModel(el, this.$data, name);

      el.addEventListener("input", () => {
        Reflect.set(this.$data, name, el.value);
      });
    });
  }

  cText(el, target, name) {
    el.innerText = Reflect.get(target, name);
  }
  cModel(el, target, name) {
    el.value = Reflect.get(target, name);
  }
}

var Camilo = {
  createApp(options) {
    return new CamiloReactive(options);
  },
};
