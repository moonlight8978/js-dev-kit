import { Schema } from "yup";
import { ConfigMapRecordContract } from "./record";
import { Initializable } from "@munkit/types";

export const providerMetadataKey = Symbol("config-map:csv-provider");

export type ProviderOptions = { slug: string } & (
  | {
      src: "csv";
      file: string;
    }
  | {
      src: "flat-schema";
    }
);

export function provider(options: ProviderOptions): ClassDecorator {
  return (target) => {
    Reflect.defineMetadata(providerMetadataKey, options, target.prototype);

    return target;
  };
}

export function getProviderMeta<T extends ConfigMapRecordContract>(
  instance: T
): ProviderOptions {
  return Reflect.getMetadata(providerMetadataKey, instance) as ProviderOptions;
}

export const schemaMetadataKey = Symbol("config-map:schema");

export function schema<T extends Schema>(schema: T): PropertyDecorator {
  return (target, propertyName) => {
    setAttribute(target as ConfigMapRecordContract, propertyName as string);
    Reflect.defineMetadata(
      schemaMetadataKey,
      schema,
      target.constructor.prototype,
      propertyName
    );
  };
}

export const attributesMetadataKey = Symbol("config-map:attributes");

export function getAttributes<T extends ConfigMapRecordContract>(
  Type: Initializable<T>
): string[] {
  return Reflect.getMetadata(attributesMetadataKey, new Type()) ?? [];
}

function setAttribute<T extends ConfigMapRecordContract>(
  instance: T,
  propertyName: string
) {
  const attributes = Reflect.getMetadata(attributesMetadataKey, instance) ?? [];
  Reflect.defineMetadata(
    attributesMetadataKey,
    [...attributes, propertyName],
    instance.constructor.prototype
  );
}

export const collectionMetadataKey = Symbol("config-map:collection");

export function collection<T extends ConfigMapRecordContract>(
  Type: Initializable<T>
): PropertyDecorator {
  return (target, propertyName) => {
    setAttribute(target as ConfigMapRecordContract, propertyName as string);
    Reflect.defineMetadata(
      collectionMetadataKey,
      Type,
      target.constructor.prototype,
      propertyName
    );
  };
}

export const columnMetadataKey = Symbol("config-map:column");

export function column(header?: string): PropertyDecorator {
  return (target, propertyName) => {
    Reflect.defineMetadata(
      columnMetadataKey,
      header ?? propertyName,
      target.constructor.prototype,
      propertyName
    );
  };
}

export const keyMetadataKey = Symbol("config-map:key");

export function key() {
  return Reflect.metadata(keyMetadataKey, true);
}
