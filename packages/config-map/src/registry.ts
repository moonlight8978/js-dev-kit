import { Initializable } from "@moonkit/types";
import { ConfigMapCollection } from "./collection";
import { ConfigMapRecordContract } from "./record";
import { getProviderMeta } from "./symbols";

export class ConfigMapRegistry {
  private keyToConfigMap: Map<string, ConfigMapCollection<any>> = new Map();

  public lookup<T extends ConfigMapRecordContract>(
    Type: Initializable<T>
  ): ConfigMapCollection<T> {
    return this.keyToConfigMap.get(
      getProviderMeta(new Type()).slug
    )! as ConfigMapCollection<T>;
  }

  public get size() {
    return this.keyToConfigMap.size;
  }

  public register<T extends ConfigMapRecordContract>(
    configMap: ConfigMapCollection<T>
  ) {
    this.keyToConfigMap.set(configMap.slug!, configMap);
  }
}
