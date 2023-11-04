import { CsvConfigMap, JsonConfigMap } from "../src";
import { Csv } from "./csv";
import { Student } from "./student";

describe("json config map", () => {
  it.only("dump and read config map", async () => {
    const csv = new Csv();
    const csvConfigMap = new CsvConfigMap(csv);
    let studentConfigMap = await csvConfigMap.read(Student);

    let jsonConfigMap = new JsonConfigMap("");

    const [slug, json] = await jsonConfigMap.dump(Student, studentConfigMap);
    expect(slug).toEqual("student");

    jsonConfigMap = new JsonConfigMap(
      JSON.stringify({
        [slug]: json,
      })
    );
    studentConfigMap = await jsonConfigMap.read(Student);

    expect(studentConfigMap.get("1").name).toEqual("Alice");
    expect(studentConfigMap.get("1").age).toEqual(10);
    expect(studentConfigMap.get("1").courses.size).toEqual(3);
  });
});
