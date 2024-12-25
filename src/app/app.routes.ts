import { Routes } from '@angular/router';
import {HubComponent} from './pages/hub/hub.component';
import {CpsTestComponent} from './pages/cps-test/cps-test.component';
import {ConfigEditorComponent} from './pages/config-editor/config-editor.component';

export const routes: Routes = [
  {path: '', component:HubComponent},
  {path: 'cps-test', component:CpsTestComponent},
  {path:"config-editor",component:ConfigEditorComponent},

  // Match all routes that aren't valid redirect to /
  {path: '**', redirectTo: ''}
];
