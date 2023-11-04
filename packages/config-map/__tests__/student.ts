import { string, number } from "yup";
import {
  ConfigMapRecord,
  column,
  schema,
  key,
  collection,
  ConfigMapCollection,
  provider,
} from "../src";

export class Course extends ConfigMapRecord {
  @column("Course")
  @schema(string().required().trim())
  public name: string = null!;

  @column("Grade")
  @schema(string().required().trim())
  public grade: string = null!;
}

export class Achievement extends ConfigMapRecord {
  @column("ParentAchievement")
  @schema(string().required().trim())
  public title: string = null!;
}

export class Parent extends ConfigMapRecord {
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
export class Student extends ConfigMapRecord {
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
