import { ModuleWithProviders } from '@angular/core';
import { TranslocoTestingModule, TranslocoConfig } from '@ngneat/transloco';

export function getTranslocoModule(config: Partial<TranslocoConfig> = {}): ModuleWithProviders<TranslocoTestingModule> {
    return TranslocoTestingModule.withLangs(
        {},
        {
            availableLangs: ['en'],
            defaultLang: 'en',
            ...config
        }
    );
}
