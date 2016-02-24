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

   var photoSource = Titanium.Media.getIsCameraSupported() ? 
       Titanium.Media.showCamera : Titanium.Media.openPhotoGallery;

photoSource ({
      success : function(event) {
          processImage(event.media, function(_photoResp){
              //photoObject = _photoResp;
                            
		      // create the row
		      var row = Alloy.createController("feedRow", photoResp);
		
		      // add the controller view, which is a row to the table
		      if ($.feedTable.getData().length === 0) {
		         $.feedTable.setData([]);
		         $.feedTable.appendRow(row.getView(), true);
		      } else {
		           $.feedTable.insertRowBefore(0,row.getView(), true);
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
  // since there is no ACS integration yet, we will fake it
  var photoObject = {
    image : _mediaObject,
    title : "Sample Photo " + new Date()
  };

  // return the object to the caller
  _callback(photoObject);
}