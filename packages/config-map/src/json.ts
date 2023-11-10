import { ConfigMapCollection } from "./collection";
import { ConfigMapRecordContract } from "./record";
import { Initializable } from "@munkit/types";
import {
  ProviderOptions,
  collectionMetadataKey,
  getAttributes,
  providerMetadataKey,
} from "./symbols";

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

      this.propertyNameToEval.set(propertyName, {
        parse: (row: Record<string, any>) => row[propertyName],
        getRaw: (row: Record<string, any>) => row[propertyName],
      });
    });
  }

  public create(object: Record<string, any>) {
    const record = new this.Type();

    for (const [propertyName, { parse }] of this.propertyNameToEval.entries()) {
      try {
        record.setAttribute(propertyName, parse(object));
      } catch (err: any) {
        console.debug(
          `Cannot parse value for property ${propertyName}. ${err.message}`
        );
        console.debug(object);
        throw err;
      }
    }

    for (const [
      collectionName,
      attributes,
    ] of this.propertyNameToCollectionAttributes.entries()) {
      const arr = object[collectionName] as Record<string, any>[];

      const collection = arr.map((item) => attributes.create(item));
      record!.setAttribute(
        collectionName,
        new ConfigMapCollection(
          collection,
          Reflect.getMetadata(collectionMetadataKey, record!, collectionName)
        )
      );
    }

    return record;
  }

  public dump(record: T): Record<string, any> {
    const entries: Array<[string, any]> = [];

    for (const [propertyName] of this.propertyNameToEval.entries()) {
      entries.push([propertyName, record.getAttribute(propertyName)]);
    }

    for (const [
      propertyName,
      attributes,
    ] of this.propertyNameToCollectionAttributes.entries()) {
      const collection = record.getAttribute(
        propertyName
      ) as ConfigMapCollection<ConfigMapRecordContract>;

      entries.push([
        propertyName,
        collection.map((item) => attributes.dump(item)),
      ]);
    }

    return Object.fromEntries(entries);
  }
}

export class JsonConfigMap {
  constructor(private configMapSlugToJson: string) {}

  public async read<T extends ConfigMapRecordContract>(
    Type: Initializable<T>
  ): Promise<ConfigMapCollection<T>> {
    const instance = new Type();

    const providerMeta = Reflect.getMetadata(
      providerMetadataKey,
      instance
    ) as ProviderOptions;
    if (!providerMeta.slug) {
      throw new Error("`slug` must be defined when use `JsonConfigMap`");
    }

    const objects = JSON.parse(this.configMapSlugToJson)[
      providerMeta.slug
    ] as Record<string, any>[];

    const attributes = new Attributes(Type);
    const collection = objects.map((object) => attributes.create(object));

    return new ConfigMapCollection(collection, Type);
  }

  public async dump<T extends ConfigMapRecordContract>(
    Type: Initializable<T>,
    collection: ConfigMapCollection<T>
  ): Promise<[string, Record<string, any>[]]> {
    const instance = new Type();

    const providerMeta = Reflect.getMetadata(
      providerMetadataKey,
      instance
    ) as ProviderOptions;
    if (!providerMeta.slug) {
      throw new Error("`slug` must be defined when use `JsonConfigMap`");
    }

    const attributes = new Attributes(Type);

    return [
      providerMeta.slug,
      collection.map((record) => attributes.dump(record)),
    ];
  }
}
