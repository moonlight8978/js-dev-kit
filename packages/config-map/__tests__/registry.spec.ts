import { CsvConfigMap, ConfigMapRegistry } from "../src";
import { Csv } from "./csv";
import { Student } from "./student";

describe("Registry", () => {
  test("read config map", async () => {
    const csv = new Csv();
    const configMapReader = new CsvConfigMap(csv);
    const students = await configMapReader.read(Student);
    const registry = new ConfigMapRegistry();
    registry.register(students);

    expect(registry.lookup(Student).size).toEqual(3);
    expect(students.size).toEqual(3);
  });
});
