import React, { createContext, useContext, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Button, Text } from 'react-native';

const AppContent: React.FC = () => {

  const [myText, setMyText] = useState(new Student());

  return (

    <Student.Provider value={{ student: myText, setStudent: setMyText }}>
      <SafeAreaProvider>
        <StudentInformation />
        <Botao />
      </SafeAreaProvider>
    </Student.Provider>
  );
};

const StudentInformation = () => {

  const [student, setStudent] = Student.use();

  return (
    <Text>
      {student.toString()}
    </Text>
  );
};


const Botao = () => {

  const [student, setStudent] = Student.use();

  return (
    <Button title={`CLICK ME - ${student}`} onPress={() => {
      setStudent(prevStudent => prevStudent.withName('John').withAge(30));
    }} />
  );
};

export class Student {

  public readonly name: string;
  public readonly age: number;

  constructor({
                name = '',
                age = 0
              }: {
    name?: string,
    age?: number
  } = {}) {
    this.name = name;
    this.age = age;
  }

  public withName(newName: string): Student {
    return new Student({ name: newName, age: this.age });
  }

  public withAge(newAge: number): Student {
    return new Student({ name: this.name, age: newAge });
  }

  public toString(): string {
    if (this.name === '') return '';
    else {
      let ageString = this.age === 0 ? 'unknown' : this.age.toString();
      return this.name + ' (age: ' + ageString + ')';
    }
  }

  static Provider: React.FC<{
    value: { student: Student; setStudent: React.Dispatch<React.SetStateAction<Student>>; };
    children: React.ReactNode
  }> = ({ value, children }) => {
    return <Student.Context.Provider value={value}>{children}</Student.Context.Provider>;
  };

  private static readonly Context = createContext<{
    student: Student;
    setStudent: React.Dispatch<React.SetStateAction<Student>>
  }>({
    student: new Student(), setStudent: () => {
    }
  });

  static use(): [Student, React.Dispatch<React.SetStateAction<Student>>] {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { student, setStudent } = useContext(Student.Context);
    return [student, setStudent];
  }
}

