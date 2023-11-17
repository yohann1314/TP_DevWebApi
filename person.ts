interface Person {
    firstName:string,
    lastName:string
}
   
  function printPerson(PersonObj: Person) {
    console.log(PersonObj.firstName,PersonObj.lastName);
  }
   
  let myPerson = { firstName: "Damien", lastName: "Dhommaux" };

  printPerson(myPerson)