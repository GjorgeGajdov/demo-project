import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutPage } from '@demo-project/feature-layout';

const routes: Routes = [
    {
        path: '',
        component: LayoutPage,
        children: [
            {
                path: 'file-explorer',
                loadChildren: () => import('@demo-project/feature-file-explorer').then(m => m.FeatureFileExplorerModule)
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }