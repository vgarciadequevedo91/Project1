var userID;

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
    // get values
    let firstNameField = document.getElementById("addUserFN")
    let lastNameField = document.getElementById("addUserLN")
    let zipField = document.getElementById("addUserZip")
    let phoneNumberField = document.getElementById("addUserPhone")

    let firstName = firstNameField.value;
    let lastName = lastNameField.value;
    let address1 = document.getElementById("addUserAd1").value;
    let address2 = document.getElementById("addUserAd2").value;
    let city = document.getElementById("addUserCity").value;
    let state = document.getElementById("addUserState").value;
    let zip = zipField.value;
    let phoneNumber = phoneNumberField.value;

    // validate
    var isInvalid = false
    let hasFirstName = firstNameField.validity.valid
    let hasLastName = lastNameField.validity.valid
    let zipIsValid = /^\d{5}(?:[-\s]\d{4})?$/.test(zip)
    let phoneNumberIsValid = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im.test(phoneNumber)
    let borderColor = "#e0e0e0"

    firstNameField.style.borderColor = borderColor
    lastNameField.style.borderColor = borderColor
    zipField.style.borderColor = borderColor
    phoneNumberField.style.borderColor = borderColor

    if (!hasFirstName) {
        isInvalid = true
        firstNameField.style.borderColor = "red"
    }

    if (!hasLastName) {
        isInvalid = true
        lastNameField.style.borderColor = "red"
    }

    if (zip != "" && !zipIsValid) {
        isInvalid = true
        zipField.style.borderColor = "red"
    }

    if (!phoneNumberIsValid) {
        isInvalid = true
        phoneNumberField.style.borderColor = "red"
    }

    if (isInvalid) return;

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
        url: 'http://group5cm-env.h5pguqnamr.us-west-2.elasticbeanstalk.com/contacts/',
        //url: 'http://localhost:8081/contacts/',
        dataType : 'JSON'
    }).done(function(server_data) {
        alert(firstName + " " + lastName + " has been added to your contacts.");
        console.log(server_data)
    }).fail(function() { console.log("failed") });

}

function doDelete()
{
    if (!validateSearchFields()) return;

    var firstName = document.getElementById("otherUserFN").value;
    var lastName = document.getElementById("otherUserLN").value;
    
    var jsonPayload = {
        'firstName' : firstName,
        'lastName' : lastName,
        'userID' : userID
    }

    //Confirm Deletion
    var confirmation = confirm('Are You Sure?');


    //If deletion is confirmed proceed
    if (confirmation === true) {

        $.ajax({
            type: 'DELETE',
            data: jsonPayload,
            url: 'http://group5cm-env.h5pguqnamr.us-west-2.elasticbeanstalk.com/contacts/',
            //url: 'http://localhost:8081/contacts/',
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

        document.getElementById("userName").innerHTML = userID

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

    // clear ID
    userID = ''
}

function doSearch()
{
    if (!validateSearchFields()) return;

    var firstName = document.getElementById("otherUserFN").value;
    var lastName = document.getElementById("otherUserLN").value;


    var jsonPayload = {
        'firstName' : firstName,
        'lastName' : lastName,
        'userID' : userID
    }
    console.log(jsonPayload)


    $.ajax({
        type: 'GET',
        async: true,
        url: 'http://group5cm-env.h5pguqnamr.us-west-2.elasticbeanstalk.com/contacts/?firstName=' + firstName + '&lastName=' + lastName,
        //url: 'http://localhost:8081/contacts/?firstName=' + firstName + '&lastName=' + lastName,
        dataType: 'JSON',
        success: function(server_data){

            if(JSON.stringify(server_data.response).length < 3) {
              console.log(JSON.stringify(server_data.response))
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

function validateSearchFields() {
    let firstNameField = document.getElementById("otherUserFN")
    let lastNameField = document.getElementById("otherUserLN")

    var isInvalid = false
    let hasFirstName = firstNameField.validity.valid
    let hasLastName = lastNameField.validity.valid
    let borderColor = "#e0e0e0"

    firstNameField.style.borderColor = borderColor
    lastNameField.style.borderColor = borderColor

    if (!hasFirstName) {
        isInvalid = true
        firstNameField.style.borderColor = "red"
    }

    if (!hasLastName) {
        isInvalid = true
        lastNameField.style.borderColor = "red"
    }

    return !isInvalid
}
