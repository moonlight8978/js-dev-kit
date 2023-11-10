import { Initializable } from "@munkit/types";
import { ConfigMapRecordContract } from "./record";
import { ConfigMapCollection } from "./collection";
import {
  ProviderOptions,
  getAttributes,
  providerMetadataKey,
  schemaMetadataKey,
} from "./symbols";
import { Schema, mixed } from "yup";

export class FlatSchemaConfigMap {
  public async read<T extends ConfigMapRecordContract>(
    Type: Initializable<T>
  ): Promise<ConfigMapCollection<T>> {
    const instance = new Type();

    const providerMeta = Reflect.getMetadata(
      providerMetadataKey,
      instance
    ) as ProviderOptions;

    if (providerMeta.src !== "flat-schema") {
      throw new Error(
        "Only 'flat-schema' provider is supported when using CsvConfigMapReader"
      );
    }

    getAttributes(Type).forEach((propertyName) => {
      const schema =
        (Reflect.getMetadata(
          schemaMetadataKey,
          instance,
          propertyName
        ) as Schema) ?? mixed();

      console.log("propertyName", propertyName, schema, schema.cast(""));

      instance.setAttribute(propertyName, schema.cast(""));
    });

    return new ConfigMapCollection([instance], Type);
  }
}
