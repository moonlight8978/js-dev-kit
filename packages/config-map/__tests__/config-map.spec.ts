import {
  ConfigMapCollection,
  CsvConfigMapReader,
  collection,
  column,
  key,
  provider,
  schema,
  CsvContract,
  ConfigMapRecord,
  ConfigMapRegistry,
} from "../src";
import { number, string } from "yup";
import * as path from "path";
import { parse } from "csv-parse/sync";
import * as fs from "fs";
import { Initializable } from "@munkit/types";

class ConfigMapCsv implements CsvContract {
  public async getRows(file: string): Promise<Record<string, string>[]> {
    const filePath = path.join(__dirname, file);
    const rows = parse(fs.readFileSync(filePath, "utf-8"), {
      columns: true,
      skip_empty_lines: true,
    }) as Record<string, any>[];
    return rows;
  }
}

describe("config map", () => {
  test("config map record interface", () => {
    class Student extends ConfigMapRecord {
      public id: string = null!;
    }

    const create = <T>(Type: Initializable<T>) => new Type();
    const student = create(Student);
    student.setAttribute("id", "asdas");
  });

  test("array init", () => {
    class Person {
      public aliases: string[] = [];
    }

    const bich = new Person();
    bich.aliases.push("bach", "depzai");

    const viet = new Person();
    viet.aliases.push("cun");

    expect(bich.aliases).toEqual(["bach", "depzai"]);
    expect(viet.aliases).toEqual(["cun"]);
  });

  test("read config map", async () => {
    class Course extends ConfigMapRecord {
      @column("Course")
      @schema(string().required().trim())
      public name: string = null!;

      @column("Grade")
      @schema(string().required().trim())
      public grade: string = null!;
    }

    class Achievement extends ConfigMapRecord {
      @column("ParentAchievement")
      @schema(string().required().trim())
      public title: string = null!;
    }

    class Parent extends ConfigMapRecord {
      @column("ParentName")
      @schema(string().required().trim())
      public name: string = null!;

      @column("ParentRelationship")
      @schema(string().required().trim())
      @key()
      public relationship: string = null!;

      @collection(Achievement)
      public achievements = new ConfigMapCollection([], Achievement);
    }

    @provider({ src: "csv", file: "TestStudent.csv", slug: "student" })
    class Student extends ConfigMapRecord {
      @column("Id")
      @schema(number().integer().required())
      @key()
      public id: number = null!;

      @column("Name")
      @schema(string().required().trim())
      public name: string = null!;

      @column("Age")
      @schema(number().integer().required())
      public age: number = null!;

      @collection(Course)
      public courses = new ConfigMapCollection([], Course);

      @collection(Parent)
      public parents = new ConfigMapCollection([], Course);
    }

    const csv = new ConfigMapCsv();
    const configMapReader = new CsvConfigMapReader(csv);
    const students = await configMapReader.read(Student);
    const registry = new ConfigMapRegistry();
    registry.register(students);

    expect(registry.lookup(Student).size).toEqual(3);
    expect(students.size).toEqual(3);

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
