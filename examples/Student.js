class Student {

    constructor(name){
        this._name = name;
    }

    getStudentName = () => {

        return this._name;
    }

    setStudentName = (name) => {

        this._name = name;
    }
}

module.exports = Student;