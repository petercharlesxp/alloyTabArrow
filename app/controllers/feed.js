// Arguments passed into this controller can be accessed off of the `$.args` object directly or:
var args = $.args;

OS_IOS && $.cameraButton.addEventListener("click",function(_event){
    $.cameraButtonClicked(_event);
});

// handlers
$.cameraButtonClicked = function(_event) {
  alert("user clicked camera button");
};

$.cameraButtonClicked = function(_event) {
   alert("user clicked camera button");

//   var photoSource = Titanium.Media.getIsCameraSupported() ? 
//       Titanium.Media.showCamera : Titanium.Media.openPhotoGallery;

//photoSource ({ 
//	note: the above comment codes of the book not working, should changed to Titanium.Media.showCamera
Titanium.Media.showCamera({	

		success : function(event) {
			processImage(event.media, function(/*photoResp*/processResponse) {
				//photoObject = _photoResp;
				if (processResponse.success) {
					// create the row
					//var row = Alloy.createController("feedRow", photoResp);
					var rowController = Alloy.createController("feedRow", processResponse.model);

					// add the controller view, which is a row to the table
					if ($.feedTable.getData().length === 0) {
						$.feedTable.setData([]);
						$.feedTable.appendRow(/*row*/
						rowController.getView(), true);
					} else {
						$.feedTable.insertRowBefore(0, /*row*/
						rowController.getView(), true);
					}
				} else {
					alert("Error saving photo " + processResponse.message);
				}
			});
		},


      cancel : function() {
       // called when user cancels taking a picture
      },
      error : function(error) {
       // display alert on error
          if (error.code == Titanium.Media.NO_CAMERA) {
             alert('Please run this test on device');
          } else {
             alert('Unexpected error: ' + error.code);
          }
       },
       saveToPhotoGallery : false,
       allowEditing : true,
       // only allow for photos, no video
       mediaTypes : [Ti.Media.MEDIA_TYPE_PHOTO]
   });
};


function processImage(_mediaObject, _callback) {
  /*
  // since there is no ACS integration yet, we will fake it
  var photoObject = {
    image : _mediaObject,
    title : "Sample Photo " + new Date()
  };

  // return the object to the caller
  _callback(photoObject);
  */
 
	var parameters = {
		"photo" : _mediaObject,
		"title" : "Sample Photo " + new Date(),
		"photo_sizes[preview]" : "200x200#",
		"photo_sizes[iphone]" : "320x320#",
		// We need this since we are showing the image immediately
		"photo_sync_sizes[]" : "preview"
	}; 

	var photo = Alloy.createModel('Photo', parameters);

	photo.save({}, {
		success : function(_model, _response) { debugger;
			Ti.API.info('success: ' + _model.toJSON());
			_callback({
				model : _model,
				message : null,
				success : true
			});
		},
		error : function(e) { debugger;
			Ti.API.error('error: ' + e.message);
			_callback({
				model : parameters,
				message : e.message,
				success : false
			});
		}
	}); 

}