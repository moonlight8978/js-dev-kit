import { CsvConfigMap } from "../src";
import { Student } from "./student";
import { Csv } from "./csv";

describe("csv config map", () => {
  test("read config map", async () => {
    const csv = new Csv();
    const configMapReader = new CsvConfigMap(csv);
    const students = await configMapReader.read(Student);

    const alice = students.get(1);
    expect(alice.name).toEqual("Alice");
    expect(alice.age).toEqual(10);
    expect(alice.courses.at(0)?.name).toEqual("Math");
    expect(alice.courses.at(0)?.grade).toEqual("A");
    expect(alice.courses.at(1)?.name).toEqual("Physics");
    expect(alice.courses.at(1)?.grade).toEqual("B");
    expect(alice.courses.at(2)?.name).toEqual("Computer Science");
    expect(alice.courses.at(2)?.grade).toEqual("C");

    const bob = students.get(2);
    expect(bob.name).toEqual("Bob");
    expect(bob.age).toEqual(11);
    expect(bob.courses.at(0)?.name).toEqual("Physics");
    expect(bob.courses.at(0)?.grade).toEqual("A");
    expect(bob.courses.at(1)?.name).toEqual("Math");
    expect(bob.courses.at(1)?.grade).toEqual("B");
    expect(bob.courses.at(2)?.name).toEqual("Computer Science");
    expect(bob.courses.at(2)?.grade).toEqual("C");

    const carol = students.get(3);
    expect(carol.name).toEqual("Carol");
    expect(carol.age).toEqual(12);
    expect(carol.courses.at(0)?.name).toEqual("Computer Science");
    expect(carol.courses.at(0)?.grade).toEqual("A");
    expect(carol.courses.at(1)?.name).toEqual("Math");
    expect(carol.courses.at(1)?.grade).toEqual("B");
    expect(carol.courses.at(2)?.name).toEqual("Physics");
    expect(carol.courses.at(2)?.grade).toEqual("C");
  });
});
