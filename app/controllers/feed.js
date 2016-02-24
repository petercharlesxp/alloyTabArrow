// Arguments passed into this controller can be accessed off of the `$.args` object directly or:
var args = $.args;

OS_IOS && $.cameraButton.addEventListener("click",function(_event){
    $.cameraButtonClicked(_event);
});

// handlers
$.cameraButtonClicked = function(_event) {
  alert("user clicked camera button");
};