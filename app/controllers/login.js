// Arguments passed into this controller can be accessed off of the `$.args` object directly or:
var args=$.args;
$.parentController = args.parentController;
$.showLoginBtn.addEventListener('click',showLoginBtnClicked);
$.showCreateAccountBtn.addEventListener('click',showCreateAccountBtnClicked);
$.cancelCreateAcctBtn.addEventListener('click',cancelActionButtonClicked);
$.cancelLoginBtn.addEventListener('click',cancelActionButtonClicked);
$.doLoginBtn.addEventListener('click',doLoginBtnClicked);
$.doCreateAcctBtn.addEventListener('click',doCreateAcctBtnClicked);

function showLoginBtnClicked() {
    $.createAcctView.hide();
    $.homeView.hide();
    $.loginView.show();
}

function showCreateAccountBtnClicked() {
    $.createAcctView.show();
    $.homeView.hide();
    $.loginView.hide();
}

function cancelActionButtonClicked() {
    $.createAcctView.hide();
    $.loginView.hide();

    // set the global login state to false
    Alloy.Globals.loggedIn = false;

    // display only the home state view
    $.homeView.show();
}

function doLoginBtnClicked() {

    // create instance of the user model
    var user = Alloy.createModel('User');

    // call the extended model's function
    user.login($.email.value, $.password.value, function(_resp) {
        if (_resp.success === true) {

            // Do stuff after successful login.
            Alloy.Globals.loggedIn = true;
            Alloy.Globals.CURRENT_USER = _resp.model;

            $.parentController.loginSuccessAction(_resp);

        } else {
            // Show the error message.
            alert("loginFailed", _response.error.message);

            Alloy.Globals.CURRENT_USER = null;
            Alloy.Globals.loggedIn = false;
        }
    });
}

function userActionResponseHandler(_resp) {
    if (_resp.success === true) {

        // Do stuff after successful login.
        Alloy.Globals.loggedIn = true;
        Alloy.Globals.CURRENT_USER = _resp.model;

        $.parentController.loginSuccessAction(_resp);

    } else {
        // Show the error message and let the user try again.
       alert("loginFailed", _resp.error.message);

        Alloy.Globals.CURRENT_USER = null;
        Alloy.Globals.loggedIn = false;
    }
}

function doLoginBtnClicked() {

    var user = Alloy.createModel('User');

    user.login($.email.value, $.password.value, 
                                        userActionResponseHandler);
}

function doCreateAcctBtnClicked() {
    if ($.acct_password.value !== 
                             $.acct_password_confirmation.value) {
        alert("Please re-enter information");
        return;
    }

    var params = {
        first_name : $.acct_fname.value,
        last_name : $.acct_lname.value,
        username : $.acct_email.value,
        email : $.acct_email.value,
        password : $.acct_password.value,
        password_confirmation : $.acct_password_confirmation.value,
    };

    var user = Alloy.createModel('User');

    user.createAccount(params, userActionResponseHandler);
}

$.open = function(_reset) {
  _reset && cancelActionButtonClicked();
  $.index.open();
};

$.close = function() {
  $.index.close();
};