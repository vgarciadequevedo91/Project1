 userID;

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

    alert(userID);


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

        userID = usernameField.value;

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

    var jsonPayload = {
        'userName' : usernameField,
        'password' : passwordField,
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
        'firstName' : firstName,
        'lastName' : lastName,
        'userID' : userID,
    }



    $.ajax({
        type: 'GET',
        async : false,
        data: jsonPayload,
        url: '/contacts/',
        dataType: 'JSON',
        success: function(server_data){

            if(JSON.stringify(server_data.response).length < 3) {
                alert("Contact not found");
            }

            else
                {
                var userData = [];
                var brokenString = JSON.stringify(server_data.response).split(",");
                var displayString = "";

                //Brake up the JSON string and
                for (var i = 1; i < 10; i++)
                {
                    var temp = brokenString[i].split(":");
                    userData[i] = temp[1];
                }

                //Parse through the user data and
                for (var i = 1; i < userData.length; i++)
                {
                    var temp = userData[i].split("");
                    var element = [];

                    for (var j = 1; j < temp.length - 1; j++)
                    {
                        element[j - 1] = temp[j];
                    }

                    //Obtain userData elements without quotations
                    for (var j = 0; j < element.length; j++)
                    {
                        if(i != 3)
                        {
                            //Diplay the first values as they are
                            if (i < 9) {

                                if (element[j] != 'Undefined') {
                                    displayString += element[j];
                                }

                            }

                            //else ignore unwanted characters
                            else {
                                if (j < element.length - 2) {
                                    displayString += element[j];
                                }
                            }
                        }
                    }

                    //First Name and Last Name on the same line
                    if (i == 1) {
                        displayString += " ";
                    }

                    //userID might not need to be displayed
                    else if (i == 3)
                    {
                        //Skip the user ID
                    }

                    //Skip lines
                    else if (i < 7) {
                        displayString += "\n";
                    }

                    //City and State seperated by comma
                    else if (i == 7) {
                        displayString += ", "
                    }

                    //Zip on the same line as city and state
                    else {
                        displayString += " "
                    }
                }

                //Display the final text to the user
                alert(displayString);
            }
        }

    }).done(function (server_data) {
    }).fail(function () {
        console.log("failed")
    });

}
