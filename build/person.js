"use strict";
function printPerson(PersonObj) {
    console.log(PersonObj.firstName, PersonObj.lastName);
}
let myPerson = { firstName: "Damien", lastName: "Dhommaux" };
printPerson(myPerson);
