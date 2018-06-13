import Handlebars from 'handlebars/dist/handlebars';
import { $ } from '../helpers/helper';
export default class View {
  constructor() {}

  getCompiledHTML(templateName, Obj_data) {
    const templateHTML = $(`${templateName}-template`)
      .innerHTML;
    return Handlebars.compile(templateHTML)(Obj_data);
  }

  renderTemplate(templateName, Obj_data) {
    $(`app`).innerHTML = this.getCompiledHTML(
      templateName,
      Obj_data
    );
  }
}
