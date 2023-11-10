import {
  ConfigMapRecord,
  FlatSchemaConfigMap,
  key,
  provider,
  schema,
} from "../src";
import { mixed } from "yup";

@provider({
  src: "flat-schema",
  slug: "BuildInfo",
})
class BuildInfo extends ConfigMapRecord {
  @schema(mixed().transform(() => "sole"))
  @key()
  public id: string = null!;

  @schema(mixed().transform(() => "1.0.0"))
  public version: string = null!;
}

describe("csv config map", () => {
  test("read config map", async () => {
    const flatSchema = new FlatSchemaConfigMap();
    const buildInfoConfigMap = await flatSchema.read(BuildInfo);
    const buildInfo = buildInfoConfigMap.sole();

    expect(buildInfo.version).toEqual("1.0.0");
  });
});
