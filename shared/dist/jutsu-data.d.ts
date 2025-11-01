import { JutsuRarity } from './index.js';
import type { JutsuDefinition } from './index.js';
export declare const JUTSU_DATABASE: JutsuDefinition[];
export declare function getJutsuById(id: string): JutsuDefinition | undefined;
export declare function getJutsuByLevel(level: number): JutsuDefinition[];
export declare function getJutsuByRarity(rarity: JutsuRarity): JutsuDefinition[];
//# sourceMappingURL=jutsu-data.d.ts.map