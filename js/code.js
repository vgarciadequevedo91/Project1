function pageLoaded() {
    let usernameField = document.getElementById("loginUser")
    let passwordField = document.getElementById("loginPassword")

    // listen for enter key on username field
    usernameField.addEventListener("keyup", function(event) {
        event.preventDefault();
        if (event.keyCode === 13) {
            if (usernameField.validity.valid && passwordField.validity.valid) {
                doLogin();
            } else {
                passwordField.focus();
            }
        }
    });

    // listen for enter key on password field
    passwordField.addEventListener("keyup", function(event) {
        event.preventDefault();
        if (event.keyCode === 13) {
            if (usernameField.validity.valid && passwordField.validity.valid) {
                doLogin();
            } else {
                usernameField.focus();
            }
        }
    });
}

function doAdd()
{

    var firstName = document.getElementById("addUserFN").value;
    var lastName = document.getElementById("addUserLN").value;
    var address1 = document.getElementById("addUserAd1").value;
    var address2 = document.getElementById("addUserAd2").value;
    var city = document.getElementById("addUserCity").value;
    var state = document.getElementById("addUserState").value;
    var zip = document.getElementById("addUserZip").value;
    var phoneNumber = document.getElementById("addUserPhone").value;
    var userID = firstName.toLowerCase() + "_" + "friend";

    //Single object
    var jsonPayload = {
        'firstName' : firstName,
        'lastName' : lastName,
        'userID' : userID,
        'phoneNumber' : phoneNumber,
        'zipCode' : zip,
        'city' : city,
        'state' : state,
        'address1' : address1,
        'address2' : address2,
    }


    //AJAX for adding contact
    $.ajax({
        type: 'POST',
        data: jsonPayload,
        url: '/contacts/',
        dataType : 'JSON'
    }).done(function(server_data) {
        console.log(server_data)
    }).fail(function() { console.log("failed") });

}

function doDelete()
{

    var firstName = document.getElementById("otherUserFN").value;
    var lastName = document.getElementById("otherUserLN").value;

    var jsonPayload = {
        'firstName' : firstName,
        'lastName' : lastName,
    }

    //Confirm Deletion
    var confirmation = confirm('Are You Sure?');


    //If deletion is confirmed proceed
    if (confirmation === true) {

        $.ajax({
            type: 'DELETE',
            data: jsonPayload,
            url: '/contacts/',
            dataType : 'JSON'
        }).done(function(server_data) {
            console.log(server_data)
        }).fail(function() { console.log("failed") });

    }
    else {
        return false;

    }
}

function hideOrShow( elementId, showState )
{
    document.getElementById( elementId ).style.display = showState ? "block" : "none";
}

function doLogin()
{
    let usernameField = document.getElementById("loginUser")
    let passwordField = document.getElementById("loginPassword")
    let hasUsername = usernameField.validity.valid
    let hasPassword = passwordField.validity.valid
    let borderColor = "#e0e0e0"

    if (hasUsername && hasPassword) {
        //Show search and add contacts when logged in
        hideOrShow( "UI", true);
        hideOrShow( "loggedin", true);
        hideOrShow( "login", false);

        passwordField.style.borderColor = borderColor
        usernameField.style.borderColor = borderColor

        document.getElementById("userName").innerHTML = usernameField.value
        usernameField.value = null
        passwordField.value = null
    }
    else if (hasUsername) {
        usernameField.style.borderColor = borderColor
        passwordField.style.borderColor = "red"
    }
    else if (hasPassword) {
        passwordField.style.borderColor = borderColor
        usernameField.style.borderColor = "red"
    }
    else {
        usernameField.style.borderColor = "red"
        passwordField.style.borderColor = "red"
    }
}

function doLogout()
{
    //Show login form when logged out
    hideOrShow( "UI", false);
    hideOrShow( "loggedin", false);
    hideOrShow( "login", true);
}

function doSearch()
{
    var firstName = document.getElementById("otherUserFN").value;
    var lastName = document.getElementById("otherUserLN").value;

    var jsonPayload = {
        'userID' : firstName.toLowerCase() + "_" + "friend",
    }


    $.ajax({
        type: 'GET',
        data: jsonPayload,
        url: '/contacts/',
        dataType : 'JSON'
    }).done(function(server_data) {
        console.log(server_data)
    }).fail(function() { console.log("failed") });
}
