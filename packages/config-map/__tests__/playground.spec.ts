import { Initializable } from "@munkit/types";
import { ConfigMapRecord } from "../src";

describe("Playground", () => {
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
});
