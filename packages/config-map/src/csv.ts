import { Schema, mixed } from "yup";
import { ConfigMapCollection } from "./collection";
import {
  ProviderOptions,
  collectionMetadataKey,
  columnMetadataKey,
  getAttributes,
  providerMetadataKey,
  schemaMetadataKey,
} from "./symbols";
import { ConfigMapRecordContract } from "./record";
import { Initializable } from "@moonkit/types";

class Attributes<T extends ConfigMapRecordContract> {
  private propertyNameToCollectionAttributes: Map<
    string,
    Attributes<ConfigMapRecordContract>
  > = new Map();
  private propertyNameToEval = new Map<
    string,
    {
      parse: (record: Record<string, any>) => any;
      getRaw: (record: Record<string, any>) => string | undefined | null;
    }
  >();

  constructor(private Type: Initializable<T>) {
    const instance = new Type();
    getAttributes(Type).forEach((propertyName) => {
      const CollectionType = Reflect.getMetadata(
        collectionMetadataKey,
        instance,
        propertyName
      ) as Initializable<ConfigMapRecordContract>;

      if (CollectionType) {
        this.propertyNameToCollectionAttributes.set(
          propertyName,
          new Attributes(CollectionType)
        );
        return;
      }

      const header = Reflect.getMetadata(
        columnMetadataKey,
        instance,
        propertyName
      );
      const schema =
        (Reflect.getMetadata(
          schemaMetadataKey,
          instance,
          propertyName
        ) as Schema) ?? mixed();

      if (header) {
        this.propertyNameToEval.set(propertyName, {
          parse: (row: Record<string, any>) => schema.cast(row[header]),
          getRaw: (row: Record<string, any>) => row[header],
        });
        return;
      }
    });
  }

  public updateOrCreate(record: T | undefined, row: Record<string, any>) {
    const isAnyColumnHasValue = this.anyColumnHasValue(row);

    if (isAnyColumnHasValue) {
      record = new this.Type();

      for (const [
        propertyName,
        { parse },
      ] of this.propertyNameToEval.entries()) {
        try {
          record.setAttribute(propertyName, parse(row));
        } catch (err: any) {
          console.debug(
            `Cannot parse value for property ${propertyName}. ${err.message}`
          );
          console.debug(row);
          throw err;
        }
      }
    }

    for (const [
      propertyName,
      attributes,
    ] of this.propertyNameToCollectionAttributes.entries()) {
      let collection = record!.getAttribute(
        propertyName
      ) as ConfigMapCollection<ConfigMapRecordContract>;
      if (!collection) {
        collection = new ConfigMapCollection(
          [],
          Reflect.getMetadata(collectionMetadataKey, record!, propertyName)
        );
        record!.setAttribute(propertyName, collection);
      }
      const collectionRecord = attributes.updateOrCreate(
        collection.last(),
        row
      );
      if (collectionRecord) {
        collection.add(collectionRecord);
      }
    }

    return isAnyColumnHasValue ? record : null;
  }

  private anyColumnHasValue(row: Record<string, string>): boolean {
    for (const { getRaw } of this.propertyNameToEval.values()) {
      if (getRaw(row)) {
        return true;
      }
    }

    return false;
  }
}

export class CsvConfigMapReader {
  constructor(private csvReader: CsvContract) {}

  public async read<T extends ConfigMapRecordContract>(
    Type: Initializable<T>
  ): Promise<ConfigMapCollection<T>> {
    const instance = new Type();

    const providerMeta = Reflect.getMetadata(
      providerMetadataKey,
      instance
    ) as ProviderOptions;
    if (providerMeta.src !== "csv") {
      throw new Error(
        "Only 'csv' provider is supported when using CsvConfigMapReader"
      );
    }

    const rows = await this.csvReader.getRows(providerMeta.file);

    const collection = new ConfigMapCollection([], Type);
    const attributes = new Attributes(Type);

    rows.forEach((row) => {
      const record = attributes.updateOrCreate(collection.last(), row);
      if (record) {
        collection.add(record);
      }
    });

    return collection;
  }
}

export interface CsvContract {
  getRows(file: string): Promise<Record<string, string>[]>;
}
