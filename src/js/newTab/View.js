import Handlebars from 'handlebars/dist/handlebars';
import { getId } from '../helpers/helper';
export default class View {
  constructor() {}

  getCompiledHTML(templateName, Obj_data) {
    const templateHTML = getId(
      `${templateName}-template`
    ).innerHTML;
    return Handlebars.compile(templateHTML)(
      Obj_data
    );
  }

  renderTemplate(templateName, Obj_data) {
    getId(`app`).innerHTML = this.getCompiledHTML(
      templateName,
      Obj_data
    );
  }

  renderModal(Obj_data) {
    document.getElementById(
      `globalModal`
    ).innerHTML = this.getCompiledHTML(
      `modal`,
      Obj_data
    );
  }
}
