interface TargetModule {
  constructor: { name: string };
}

export class EnsureModuleLoadedOnceGuard {
  constructor(targetModule: TargetModule) {
    if (targetModule) {
      throw new Error(`${targetModule.constructor.name} has already been loaded.
      Import this module in AppModule only.`);
    }
  }
}
