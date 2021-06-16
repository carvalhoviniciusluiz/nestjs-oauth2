import { Injectable, Type } from '@nestjs/common';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import { Module } from '@nestjs/core/injector/module';
import { ModulesContainer } from '@nestjs/core/injector/modules-container';
import { Oauth2GrantStrategyInterface } from './protocols';

export interface Oauth2StrategyOptions {
  strategies: Type<Oauth2GrantStrategyInterface>[];
}

@Injectable()
export class StrategyExplorer {
  constructor(private readonly modulesContainer: ModulesContainer) {}

  explore(metadataKey: string): Oauth2StrategyOptions {
    const modules = [...this.modulesContainer.values()];
    const strategies = this.flatMap<Oauth2GrantStrategyInterface>(modules, instance =>
      this.filterProvider(instance, metadataKey)
    );

    return { strategies };
  }

  flatMap<T>(modules: Module[], callback: (instance: InstanceWrapper) => Type<any> | undefined): Type<T>[] {
    const items = modules.map(module => [...module.providers.values()].map(callback)).reduce((a, b) => a.concat(b), []);
    return items.filter(element => !!element) as Type<T>[];
  }

  filterProvider(wrapper: InstanceWrapper, metadataKey: string): Type<any> | undefined {
    const { instance } = wrapper;
    if (!instance) {
      return undefined;
    }
    return this.extractMetadata(instance, metadataKey);
  }

  extractMetadata(instance: any, metadataKey: string): Type<any> {
    if (!instance.constructor) {
      return;
    }

    const metadata = Reflect.getMetadata(metadataKey, instance.constructor);
    return metadata ? (instance.constructor as Type<any>) : undefined;
  }
}
