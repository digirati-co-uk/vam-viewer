import {
  IManifestoOptions,
  Manifest,
  parseManifest as manifestParseManifest,
} from 'manifesto.js';

export function parseManifest(
  jsonLd: any,
  options?: Partial<IManifestoOptions>
): Manifest {
  return manifestParseManifest(jsonLd, options as any) as Manifest;
}
