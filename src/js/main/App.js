import Handlebars from '../3rd/handlebars';

export default class App {
  constructor($el) {
    this.$el = $el;
    this.load();

    this.$el.addEventListener(`submit`, this.submit.bind(this));

    if (this.dateOfBirth) {
      this.renderAgeLoop();
    } else {
      this.renderChoose();
    }
  }

  load() {
    const value = localStorage.dateOfBirth;
    if (value) {
      this.dateOfBirth = this.dateOfBirth.getTime();
    }
  }

  save() {
    if (this.dob) localStorage.dob = this.dob.getTime();
  }

  submit(e) {
    e.preventDefault();

    var input = this.$$('input')[0];
    if (!input.valueAsDate) return;

    this.dob = input.valueAsDate;
    this.save();
    this.renderAgeLoop();
  }

  renderChoose() {
    this.html(this.view('dob')());
  }

  renderAgeLoop() {
    this.interval = setInterval(this.renderAge.bind(this), 100);
  }

  renderAge() {
    var now = new Date();
    var duration = now - this.dob;
    var years = duration / 31556900000;

    var majorMinor = years
      .toFixed(9)
      .toString()
      .split('.');

    requestAnimationFrame(
      function() {
        this.html(
          this.view('age')({
            year: majorMinor[0],
            milliseconds: majorMinor[1],
          })
        );
      }.bind(this)
    );
  }

  $$(sel) {
    return this.$el.querySelectorAll(sel);
  }

  html(html) {
    this.$el.innerHTML = html;
  }

  view(name) {
    var $ = document.getElementById.bind(document);
    var $el = $(name + '-template');
    return Handlebars.compile($el.innerHTML);
  }
}
