var model = arguments[0] || {};
//
// this is setting the view elements of the row view
// based on the arguments passed into the controller
//

$.image.image = model.attributes.urls.preview;
$.titleLabel.text = model.attributes.title || '';
Ti.API.info("Inside feedRow: " + JSON.stringify(model));
// save the model id for use later in app
$.row.row_id = model.id || '';
Ti.API.info("model.id: " + model.id);