

hideOrShow( "UI", false);
hideOrShow("loggedin", false)


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
    var vis = "visible";
    var dis = "block";
    if( !showState )
    {
        vis = "hidden";
        dis = "none";
    }

    document.getElementById( elementId ).style.visibility = vis;
    document.getElementById( elementId ).style.display = dis;
}

function doLogin()
{
    //Show UI when logged in
    hideOrShow( "UI", true);
    hideOrShow( "loggedin", true);
}

function doLogout()
{
    //Show nothing when logged out
    hideOrShow( "UI", false);
    hideOrShow( "loggedin", false);
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
