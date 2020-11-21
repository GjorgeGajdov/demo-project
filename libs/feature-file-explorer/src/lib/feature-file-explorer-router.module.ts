import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FileExplorerPage } from './pages/file-explorer/file-explorer.page';

const routes: Routes = [
    {
        path: '',
        component: FileExplorerPage
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FeatureFileExplorerRouterModule { }