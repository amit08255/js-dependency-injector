const studentApp = (wire, studentSymbol) => () => {
    wire(this, "stud", studentSymbol);
    this.stud.setStudentName("amit");
    console.log("\n\nobj: ", this.stud.getStudentName());
}

module.exports = studentApp;