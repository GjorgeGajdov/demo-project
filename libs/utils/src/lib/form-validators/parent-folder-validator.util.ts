import { AbstractControl, ValidatorFn } from '@angular/forms';
import { ResourceType } from '@demo-project/domains';

export function resourceParentFolderValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
        const optionalType = [ResourceType.FOLDER, ResourceType.SHORTCUT].includes(control.parent?.get('type').value);
        const valid = optionalType || control.value;
        return valid ? null : { required: true };
    };
}