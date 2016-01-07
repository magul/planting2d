import { chain, range, map } from 'underscore';
import jquery from 'jquery';
import { View, Collection } from 'core';
import ToolboxObject from './sidebar-object';
import ToolboxModel from '../plant/model';
import { Event } from 'const';

export const ToolboxCollection = Collection.extend({
  model: ToolboxModel,
});

export default View.extend({
  className: 'plantingjs-toolbox',
  template: require('./sidebar.hbs'),

  initialize: function initialize() {
    const objectsIds = range(this.manifesto().getCopy('toolboxobjects').length);
    const objectsProjs = map(this.manifesto().getCopy('toolboxobjects'), ({ projections }) => projections);
    const objectsData = chain(objectsIds)
      .zip(objectsProjs)
      .map(([ objectId, projections ]) => ({ objectId, projections, currentProjection: 0 }))
      .value();

    this.collection = new ToolboxCollection(objectsData, { app: this.app });
    this.objects = this.collection.map(model => new ToolboxObject({ model, app: this.app }));
    this.app.on(Event.START_PLANTING, () => {
      this.$el.show();
    });
    this.render(this.objects);
  },

  render: function render(objects) {
    const $template = jquery('<div />').append(this.template());
    const $list = $template.find('.plantingjs-toolboxobject-container');

    objects.forEach(({ $el }) => {
      $list.append($el);
    });
    this.$el.append($template);
  },

  hide: function hide() {
    this.$el.hide();
  },

  show() {
    this.$el.show();
  },
});
